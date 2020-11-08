/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import styles from './styles';

export default function ClassList() {
  const db = firestore();
  const [listaAulas, setListaAulas] = useState();
  useEffect(() => {
    const aulas = db.collection('aulas');
    async function getAulas() {
      const nomeTurma = await AsyncStorage.getItem('@turma');
      aulas
        .where('turmaNome', '==', nomeTurma)
        .get()
        .then((response) => {
          const resultAulas = [];

          response.forEach((documentSnapshot) => {
            resultAulas.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          setListaAulas(resultAulas);
        })
        .catch((error) => {
          ToastAndroid.show(error, ToastAndroid.LONG);
        });
    }
    getAulas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Aulas</Text>
      <FlatList
        data={listaAulas}
        renderItem={({ item }) => (
          <View
            style={{
              height: 80,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFCC00',
              marginTop: 10,
            }}
          >
            <Text>Disciplina: {item.disciplinaAula}</Text>
            <Text>
              Horário de Início:{' '}
              {format(item.inicio.toDate(), ' d/M/yyyy - H:mm')}
            </Text>
            <Text>
              Horário de Término:{' '}
              {format(item.fim.toDate(), ' d/M/yyyy - H:mm')}
            </Text>
            <Text>Professor: {item.professor}</Text>
          </View>
        )}
      />
    </View>
  );
}
