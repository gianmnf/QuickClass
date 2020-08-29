import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Login usando o google
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
// Importando FireStore
import firestore from '@react-native-firebase/firestore';
import styles from './styles';

export default function Login() {
  const navigation = useNavigation();
  const [user, setUser] = useState([]);
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

    configureGoogleLogin();
  }, []);

  async function loginGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.user.email.endsWith('@unipam.edu.br')) {
        setMensagem('Autorizado');
        setUser(userInfo);
        /*  const userID = JSON.stringify(user.user.id);
        const userName = JSON.stringify(user.user.name);
        AsyncStorage.setItem('@userId', userID);
        AsyncStorage.setItem('@userName', userName); */
        console.log(user.user);
        usuarios
          .add({
            Nome: JSON.stringify(user.user.name),
            Email: JSON.stringify(user.user.email),
            FotoUrl: JSON.stringify(user.user.photo),
            Tipo: 'Aluno',
          })
          .then(() => {
            navigation.navigate('Student');
            console.log('Usuário Adicionado!');
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
        console.log('ERRO: ', error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text>{user.user !== undefined ? user.user.name : 'Padrão'}</Text>
      <Text>{user.user !== undefined ? user.user.email : 'Padrão'}</Text>
      <Text>{mensagem}</Text>
      <GoogleSigninButton
        style={styles.googleBtn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={loginGoogle}
      />
    </View>
  );
}
