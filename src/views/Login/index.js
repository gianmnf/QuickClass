import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Text, BackHandler } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './styles';
import Background from '../../components/Background';
import LogoApp from '../../components/LogoApp';
import Paragraph from '../../components/Paragraph';
import * as authFunctions from '../../functions/auth';

export default function Login() {
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    authFunctions.permissaoLocalizacao();
    authFunctions.configureGoogleLogin();
  }, []);

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      setShowAlert(true);
    });
  }, []);

  return (
    <>
      <Background>
        <LogoApp />
        <Paragraph>Seja bem-vindo(a)!</Paragraph>
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
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Sair do Aplicativo"
          message="Você deseja sair do aplicativo?"
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showCancelButton
          showConfirmButton
          cancelText="Não"
          confirmText="Sim"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            BackHandler.exitApp();
          }}
        />
      </Background>
    </>
  );
}
