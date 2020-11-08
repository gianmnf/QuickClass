/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, ToastAndroid } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import styles from './styles';

export default function MyClasses() {
  const turmas = firestore().collection('turmas');
  const usuarios = firestore().collection('usuarios');
  const [listaTurmas, setListaTurmas] = useState();

  async function getTurmas(email) {
    turmas
      .where('listaProfessores', 'array-contains', email)
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

  async function getProfessorEmail(id) {
    const email = await AsyncStorage.getItem('@emailProfessor');
    usuarios
      .doc('tipo')
      .collection('professores')
      .doc(id)
      .get()
      .then((x) => {
        AsyncStorage.setItem('@emailProfessor', x.data().email);
        getTurmas(email);
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      });
  }

  useEffect(() => {
    async function getProfessorDados() {
      const id = await AsyncStorage.getItem('@user');
      const email = await AsyncStorage.getItem('@emailProfessor');
      if (email !== null) {
        getTurmas(email);
      } else {
        getProfessorEmail(id);
      }
    }
    getProfessorDados();
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
            <Text> Turma: {item.nome}</Text>
            <Text> Curso: {item.curso}</Text>
          </View>
        )}
      />
    </View>
  );
}
