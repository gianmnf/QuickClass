import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import * as authFunctions from '../../functions/auth';

export default function Login() {
  const navigation = useNavigation();

  const isSignedIn = async () => {
    const user = await AsyncStorage.getItem('@user');
    const tipo = await AsyncStorage.getItem('@tipo');
    if (user !== null && tipo === 'aluno') {
      navigation.navigate('Student');
    } else if (user !== null && tipo === 'professor') {
      navigation.navigate('Teacher');
    }
  };

  useEffect(() => {
    authFunctions.permissaoLocalizacao();
    authFunctions.configureGoogleLogin();
    isSignedIn();
  }, []);

  return (
    <>
      <Background>
        <Header>Quick Class</Header>
        <Logo />
        <Paragraph>Seja bem-vindo ao Quick Class!</Paragraph>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginTeacher')}
        >
          <Text style={styles.textButton}>Entrar como Professor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginStudent')}
        >
          <Text style={styles.textButton}>Entrar como Aluno</Text>
        </TouchableOpacity>
      </Background>
    </>
  );
}
