import React, { useEffect } from 'react';
import { GoogleSigninButton } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import * as authFunctions from '../../functions/auth';

export default function Login() {
  const navigation = useNavigation();

  useEffect(() => {
    async function checkLogin() {
      const user = await AsyncStorage.getItem('@user');
      const tipo = await AsyncStorage.getItem('@tipo');
      if (user !== null && tipo === 'aluno') {
        navigation.navigate('Student');
      } else if (user !== null && tipo === 'professor') {
        navigation.navigate('Teacher');
      }
    }
    authFunctions.configureGoogleLogin();
    checkLogin();
  }, []);

  async function saveDados() {
    const authUser = await authFunctions.auth();
    if (authUser) {
      const userType = await AsyncStorage.getItem('@tipo');
      if (userType === 'aluno') {
        navigation.navigate('Student');
      } else if (userType === 'professor') {
        navigation.navigate('Teacher');
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
      <GoogleSigninButton
        style={styles.googleBtn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={saveDados}
      />
    </Background>
  );
}
