import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import RNExitApp from 'react-native-exit-app';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './styles';
import * as sf from '../../functions/student';

export default function Student() {
  const navigation = useNavigation();
  const usuarios = firestore().collection('usuarios');
  const [nome, setNome] = useState();
  const [foto, setFoto] = useState();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    function setFirstName(u) {
      const fullName = u;
      const firstName = fullName.split(' ')[0];
      setNome(firstName);
    }

    async function setDados(dados) {
      await AsyncStorage.setItem('@nome', dados.nome);
      await AsyncStorage.setItem('@email', dados.email);
    }

    async function getUser() {
      const id = await AsyncStorage.getItem('@user');
      usuarios
        .doc('tipo')
        .collection('alunos')
        .doc(id)
        .get()
        .then((x) => {
          setFirstName(x.data().nome);
          sf.setTurma(x.data().email);
          setFoto(x.data().fotoUrl);
          setDados(x.data());
        })
        .catch((error) => {
          ToastAndroid.show(error, ToastAndroid.LONG);
        });
    }

    getUser();
  }, []);

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      setShowAlert(true);
    });
  }, []);

  return (
    <View style={styles.containerIndex}>
      <Text style={styles.titulo}>Página do Aluno</Text>
      <Image style={styles.image} source={{ uri: foto }} />
      <Text style={styles.header}>
        Bem-vindo {nome}, o que você deseja fazer?
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Frequency')}
        style={styles.button}
      >
        <Text style={styles.textButton}>Marcar Presença</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ClassList')}
        style={styles.button}
      >
        <Text style={styles.textButton}>Lista de Aulas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('FrequencyList')}
        style={styles.button}
      >
        <Text style={styles.textButton}>Minha Frequência</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setShowAlert(true)}
        style={styles.button}
      >
        <Text style={styles.textButton}>Sair</Text>
      </TouchableOpacity>
      {/* Alert para sair do App */}
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
          RNExitApp.exitApp();
        }}
      />
    </View>
  );
}
