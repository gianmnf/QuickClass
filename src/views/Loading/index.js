import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Background from '../../components/Background';
import LogoApp from '../../components/LogoApp';

export default function Loading() {
  const navigation = useNavigation();

  const isSignedIn = async () => {
    const user = await AsyncStorage.getItem('@user');
    const tipo = await AsyncStorage.getItem('@tipo');
    if (user !== null && tipo === 'aluno') {
      navigation.navigate('Student');
    } else if (user !== null && tipo === 'professor') {
      navigation.navigate('Teacher');
    } else {
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      isSignedIn();
    }, 1200);
  }, []);

  return (
    <>
      <Background>
        <LogoApp />
      </Background>
    </>
  );
}
