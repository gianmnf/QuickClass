import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './styles';

export default function Teacher() {
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

    async function getUser() {
      const id = await AsyncStorage.getItem('@user');
      usuarios
        .doc('tipo')
        .collection('professores')
        .doc(id)
        .get()
        .then((x) => {
          setFirstName(x.data().nome);
          setFoto(x.data().fotoUrl);
          AsyncStorage.setItem('@emailProfessor', x.data().email);
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
      <Text style={styles.titulo}>Página do Professor</Text>
      <Image style={styles.image} source={{ uri: foto }} />
      <Text style={styles.header}>
        Bem-vindo {nome}, o que você deseja fazer?
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('NewClass')}
        style={styles.button}
      >
        <Text style={styles.textButton}>Criar Aula</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ClassListTeacher')}
        style={styles.button}
      >
        <Text style={styles.textButton}>Visualizar Frequência</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('MyClasses')}
        style={styles.button}
      >
        <Text style={styles.textButton}>Minhas Turmas</Text>
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
          BackHandler.exitApp();
        }}
      />
    </View>
  );
}
