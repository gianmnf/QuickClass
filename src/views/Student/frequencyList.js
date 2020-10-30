/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import styles from './styles';

export default function FrequencyList() {
  const db = firestore();
  const aulas = db.collection('aulas');
  const [listaPresenca, setListaPresenca] = useState();
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function populatePresenca() {
      setEmail(await AsyncStorage.getItem('@email'));
      aulas
        .where('emailAlunos', 'array-contains', email)
        .onSnapshot((documentSnapshot) => {
          const resultPresenca = [];
          documentSnapshot.forEach((snap) => {
            resultPresenca.push({
              ...snap.data(),
              key: snap.id,
              dataPresenca: snap
                .data()
                .alunosPresentes.filter((x) => x.emailAluno === email)[0]
                .dataPresenca,
            });
          });
          setListaPresenca(resultPresenca);
        });
    }

    populatePresenca();
  }, [listaPresenca !== undefined]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minha Frequência</Text>
      <FlatList
        data={listaPresenca}
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
            <Text>Professor: {item.professor}</Text>
            <Text>
              Data/Hora Presença:{' '}
              {format(item.dataPresenca.toDate(), ' d/M/yyyy - H:mm')}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
