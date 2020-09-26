import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
// Login usando o google
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
// Importando FireStore
import firestore from '@react-native-firebase/firestore';
import styles from './styles';

import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';

export default function Login() {
  const navigation = useNavigation();
  const [mensagem, setMensagem] = useState('');
  const [isAluno, setIsAluno] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);
  const [userKey, setUserKey] = useState('');

  const usuarios = firestore().collection('usuarios');
  useEffect(() => {
    async function configureGoogleLogin() {
      GoogleSignin.configure({
        webClientId:
          '1071424142938-obk2deb2c8otbcmsdbklhcmdtgc9nvv1.apps.googleusercontent.com',
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
    }

    async function checkLogin() {
      const user = await AsyncStorage.getItem('@user');
      const tipo = await AsyncStorage.getItem('@tipo');
      if (user !== null && tipo === 'aluno') {
        navigation.navigate('Student');
      } else if (user !== null && tipo === 'professor') {
        navigation.navigate('Teacher');
      }
    }

    configureGoogleLogin();
    checkLogin();
  }, []);

  async function storageSave(value, tipo) {
    await AsyncStorage.setItem('@user', value);
    await AsyncStorage.setItem('@tipo', tipo);
  }

  async function loginGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.user.email.endsWith('@unipam.edu.br')) {
        usuarios
          .doc('tipo')
          .collection('professores')
          .where('email', '==', userInfo.user.email)
          .get()
          .then((response) => {
            const result = [];

            response.forEach((documentSnapshot) => {
              result.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });

            if (result.length === 1) {
              setIsProfessor(true);
              setUserKey(result[0].key);
            } else {
              setIsProfessor(false);
            }
          });
        usuarios
          .doc('tipo')
          .collection('alunos')
          .where('email', '==', userInfo.user.email)
          .get()
          .then((response) => {
            const resultAluno = [];

            response.forEach((documentSnapshot) => {
              resultAluno.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });

            if (resultAluno.length === 1) {
              setIsAluno(true);
              setUserKey(resultAluno[0].key);
            } else {
              setIsAluno(false);
            }
          });
        setMensagem('Autorizado');
        if (isAluno) {
          usuarios
            .doc('tipo')
            .collection('alunos')
            .doc(userKey)
            .update({
              nome: userInfo.user.name,
              fotoUrl: userInfo.user.photo,
            })
            .then(() => {
              console.log('cheguei aqui');
              storageSave(userKey, 'aluno');
              navigation.navigate('Student');
            });
        } else if (isProfessor) {
          usuarios
            .doc('tipo')
            .collection('professores')
            .doc(userKey)
            .update({
              nome: userInfo.user.name,
              fotoUrl: userInfo.user.photo,
            })
            .then(() => {
              console.log('Cheguei aqui');
              storageSave(userKey, 'professor');
              navigation.navigate('Teacher');
            });
        }
        /* usuarios
          .add({
            id: userInfo.user.id,
            nome: userInfo.user.name,
            email: userInfo.user.email,
            fotoUrl: userInfo.user.photo,
            tipo: 'Aluno',
            turma: 'SIN8N-S',
          })
          .then((response) => {
            storageSave(JSON.stringify(response.id));
            navigation.navigate('Student');
          }); */
      } else {
        setMensagem('Email não autorizado.');
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setMensagem('Login cancelado.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setMensagem('O login já está sendo efetuado.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setMensagem(
          'A sua versão do Google Play Services está desatualizada ou indisponível.'
        );
      } else {
        setMensagem('ERRO: ', error);
      }
    }
  }

  return (
    <Background>
      <Header>Quick Class</Header>
      <Logo />
      <Paragraph>
        Seja bem-vindo ao Quick Class! Para efetuar o login, toque o botão
        abaixo!
      </Paragraph>
      <Text>{mensagem}</Text>
      <GoogleSigninButton
        style={styles.googleBtn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={loginGoogle}
      />
    </Background>
  );
}
