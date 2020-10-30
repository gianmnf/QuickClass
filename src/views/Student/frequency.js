/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { format, isWithinInterval } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { getPreciseDistance } from 'geolib';
import styles from './styles';

export default function Frequency() {
  const db = firestore();
  const aulas = db.collection('aulas');
  const navigation = useNavigation();
  const [listaAulas, setListaAulas] = useState();
  const [listaPresenca, setListaPresenca] = useState();
  const [getLoc, setGetLoc] = useState(false);
  const [email, setEmail] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  async function getLocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        setGetLoc(false);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  async function marcarPresenca(item) {
    setGetLoc(true);
    const latLonTeacher = {
      latitude: item.latitude,
      longitude: item.longitude,
    };
    const latLonStudent = {
      latitude: lat,
      longitude: lon,
    };
    const dist = getPreciseDistance(latLonTeacher, latLonStudent);
    console.log(dist);
    const nomeAluno = await AsyncStorage.getItem('@nome');
    const objAluno = {
      nome: nomeAluno,
      emailAluno: email,
      dataPresenca: new Date(),
    };
    if (dist >= 0 && dist <= 100) {
      aulas
        .doc(item.key)
        .update({
          alunosPresentes: firestore.FieldValue.arrayUnion(objAluno),
          emailAlunos: firestore.FieldValue.arrayUnion(email),
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
    } else if (dist > 100) {
      ToastAndroid.show(
        'Você está muito longe do professor. É necessário estar no máximo a 100 metros do professor para que a chamada possa ser efetuada.',
        ToastAndroid.LONG
      );
    } else if (Number.isNaN(dist)) {
      ToastAndroid.show(
        'Não foi possível calcular a distância. Verifique se a sua localização está ativada e tente novamente.',
        ToastAndroid.LONG
      );
    }
  }

  useEffect(() => {
    async function getAulas() {
      const nomeTurma = await AsyncStorage.getItem('@turma');
      aulas
        .where('turmaNome', '==', nomeTurma)
        .onSnapshot((documentSnapshot) => {
          const resultAulas = [];

          documentSnapshot.forEach((snap) => {
            resultAulas.push({
              ...snap.data(),
              key: snap.id,
            });
          });
          setListaAulas(resultAulas);
        });
    }

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
            });
          });
          setListaPresenca(resultPresenca);
        });
    }

    getAulas();
    populatePresenca();
  }, [listaPresenca !== undefined]);

  useEffect(() => {
    getLocation();
  }, [getLoc !== false]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Marcar Presença</Text>
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
              {listaPresenca !== undefined &&
              listaPresenca.some((aula) => aula.key === item.key) !== true ? (
                <Button
                  title="Marcar Presença"
                  onPress={() => marcarPresenca(item)}
                />
              ) : (
                <Text>Você já marcou presença nesta aula.</Text>
              )}
            </View>
          ) : null
        }
      />
    </View>
  );
}
