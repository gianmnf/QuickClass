/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Text, View, Image, Button, FlatList } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import RNExitApp from 'react-native-exit-app';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './styles';

export default function ClassList() {
  const db = firestore();
  const [aulas, setAulas] = useState();
  const [emailAluno, setEmailAluno] = useState('');
  useEffect(() => {
    const usuarios = db.collection('usuarios');
    const turmas = db.collection('turmas');
    async function getUsuario() {
      const id = await AsyncStorage.getItem('@user');
      usuarios
        .doc('tipo')
        .collection('alunos')
        .doc(id)
        .get()
        .then((x) => {
          setEmailAluno(x.data().email);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    async function getTurma() {
      turmas
        .where('listaAlunos', 'array-contains', emailAluno)
        .get()
        .then((response) => {
          const resultTurma = [];

          response.forEach((documentSnapshot) => {
            resultTurma.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          console.log(AsyncStorage.getItem('@turma'));
          AsyncStorage.setItem('@turma', resultTurma[0].key);
        });
    }

    async function getAulas() {
      const idTurma = AsyncStorage.getItem('@turma');
      turmas
        .doc(idTurma)
        .collection('aulas')
        .get()
        .then((response) => {
          const resultAulas = [];

          response.forEach((documentSnapshot) => {
            resultAulas.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          setAulas(resultAulas);
        });
    }

    getUsuario();
    getTurma();
    getAulas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Aulas</Text>
      <FlatList
        data={aulas}
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
            <Text>Professor: {item.professor}</Text>
          </View>
        )}
      />
    </View>
  );
}
