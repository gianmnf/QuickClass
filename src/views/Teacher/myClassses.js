/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Text, View, Image, Button, FlatList } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import RNExitApp from 'react-native-exit-app';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './styles';

export default function MyClasses() {
  const turmas = firestore().collection('turmas');
  const usuarios = firestore().collection('usuarios');
  const [listaTurmas, setListaTurmas] = useState();
  const [emailProfessor, setEmailProfessor] = useState();

  useEffect(() => {
    async function getProfessorTurmas() {
      const id = await AsyncStorage.getItem('@user');
      usuarios
        .doc('tipo')
        .collection('professores')
        .doc(id)
        .get()
        .then((x) => {
          setEmailProfessor(x.data().email);
        })
        .catch((error) => {
          console.log(error);
        });
      turmas
        .where('listaProfessores', 'array-contains', emailProfessor)
        .get()
        .then((response) => {
          const resultTurmas = [];

          response.forEach((documentSnapshot) => {
            resultTurmas.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setListaTurmas(resultTurmas);
        });
    }
    getProfessorTurmas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minhas Turmas</Text>
      <FlatList
        data={listaTurmas}
        renderItem={({ item }) => (
          <View
            style={{
              height: 50,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFCC00',
              marginTop: 10,
            }}
          >
            <Text>{item.nome}</Text>
          </View>
        )}
      />
    </View>
  );
}
