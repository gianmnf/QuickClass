import React, { useState, useEffect } from 'react';
import { Text, View, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import RNExitApp from 'react-native-exit-app';
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

    function setPhoto(p) {
      const photo = p.replace('96', '64');
      setFoto(photo);
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
          setPhoto(x.data().fotoUrl);
          AsyncStorage.setItem('@emailProfessor', x.data().email);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    getUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Página do Professor</Text>
      <Text style={styles.welcome}>
        <Image style={styles.image} source={{ uri: foto }} />
        {` ${nome}`}
      </Text>
      <Text style={styles.header}>O que você deseja fazer?</Text>
      <Button
        title="Criar Aula"
        onPress={() => navigation.navigate('NewClass')}
      />
      <Button
        title="Lista de Aulas"
        onPress={() => navigation.navigate('ClassListTeacher')}
      />
      <Button
        title="Minhas Turmas"
        onPress={() => navigation.navigate('MyClasses')}
      />
      <Button title="Sair" onPress={() => setShowAlert(true)} />
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
