import React, { useEffect } from 'react';
import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import styles from './styles';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import * as authFunctions from '../../functions/auth';

export default function LoginStudent() {
  const usuarios = firestore().collection('usuarios');
  const navigation = useNavigation();

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { accessToken, idToken } = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken
      );
      await auth().signInWithCredential(credential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        ToastAndroid.show('Login cancelado.', ToastAndroid.LONG);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        ToastAndroid.show(
          'Efetuando Login, por favor aguarde...',
          ToastAndroid.LONG
        );
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastAndroid.show(
          'A sua versão do Google Play Services está desatualizada ou indisponível.',
          ToastAndroid.LONG
        );
      } else {
        ToastAndroid.show(error, ToastAndroid.LONG);
      }
    }
  };

  const salvarDados = async (user, userKey) => {
    usuarios
      .doc('tipo')
      .collection('alunos')
      .doc(userKey)
      .update({
        nome: user.displayName,
        fotoUrl: user.photoURL,
      })
      .then(() => {
        authFunctions.storageSave(userKey, 'aluno');
        navigation.navigate('Student');
      })
      .catch((err) => ToastAndroid.show(err, ToastAndroid.LONG));
  };

  function onAuthStateChanged(user) {
    if (user) {
      if (
        user.email.endsWith('@unipam.edu.br') ||
        user.email.startsWith('gianveloxsi')
      ) {
        usuarios
          .doc('tipo')
          .collection('alunos')
          .where('email', '==', user.email)
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
              salvarDados(user, result[0].key);
            } else if (result.length !== 1) {
              ToastAndroid.show(
                'Email Incorreto! Você não possui cadastro ou logou com um tipo de usuário diferente do seu!',
                ToastAndroid.LONG
              );
              authFunctions.limparCredenciais();
            }
          })
          .catch((err) => ToastAndroid.show(err, ToastAndroid.LONG));
      } else {
        ToastAndroid.show(
          'Email não autorizado. Por favor, peça ao administrador para fazer seu cadastro caso não possua, ou verifique se o email usado é do domínio unipam.edu.br e tente novamente.',
          ToastAndroid.LONG
        );
        authFunctions.limparCredenciais();
      }
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <>
      <Background>
        <Header>Quick Class</Header>
        <Logo />
        <Paragraph>
          Para efetuar o login como aluno, pressione o botão abaixo:
        </Paragraph>
        <GoogleSigninButton
          style={styles.googleBtn}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      </Background>
    </>
  );
}
