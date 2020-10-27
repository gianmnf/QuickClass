/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { format, isWithinInterval } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function Frequency() {
  const db = firestore();
  const aulas = db.collection('aulas');
  const navigation = useNavigation();
  const [listaAulas, setListaAulas] = useState();
  const [email, setEmail] = useState('');

  async function marcarPresenca(idAula) {
    const nomeAluno = await AsyncStorage.getItem('@nome');
    aulas
      .doc(idAula)
      .collection('alunosPresentes')
      .add({
        nome: nomeAluno,
        emailAluno: email,
        dataPresenca: new Date(),
      })
      .then(() => {
        ToastAndroid.show(
          'Frequência registrada com sucesso!',
          ToastAndroid.SHORT
        );
        navigation.navigate('Student');
      })
      .catch((err) => {
        ToastAndroid.show(err, ToastAndroid.SHORT);
      });
  }

  /* async function checarPresenca(idAula) {
    const resultPresenca = [];
    await aulas
      .doc(idAula)
      .collection('alunosPresentes')
      .where('email', '==', email)
      .get()
      .then((response) => {
        response.forEach((documentSnapshot) => {
          resultPresenca.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        console.log('Dados', resultPresenca.length);
      })
      .catch((err) => {
        ToastAndroid.show(err, ToastAndroid.SHORT);
      });
  } */

  useEffect(() => {
    async function getAulas() {
      const nomeTurma = await AsyncStorage.getItem('@turma');
      setEmail(await AsyncStorage.getItem('@email'));
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
          console.log(error);
        });
    }
    getAulas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Aulas</Text>
      <FlatList
        data={listaAulas}
        renderItem={({ item }) =>
          isWithinInterval(new Date(), {
            start: item.inicio.toDate(),
            end: item.fim.toDate(),
          }) === true ? (
            <View
              style={{
                height: 120,
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
              <Button
                title="Marcar Presença"
                onPress={() => marcarPresenca(item.key)}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}
