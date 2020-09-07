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
      const data = await AsyncStorage.getItem('@user');
      if (data !== null) {
        navigation.navigate('Student');
      }
    }

    configureGoogleLogin();
    checkLogin();
  }, []);

  async function storageSave(value) {
    await AsyncStorage.setItem('@user', value);
  }

  async function loginGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.user.email.endsWith('@unipam.edu.br')) {
        setMensagem('Autorizado');
        usuarios
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
          });
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
