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
  useEffect(() => {
   /*  async function getAulas() {
      const t = await AsyncStorage.getItem('@turma');
      db.collection('turmas')
        .doc(t)
        .collection('disciplinas')
        .onSnapshot((querySnapshot) => {
          const classes = [];

          querySnapshot.forEach((documentSnapshot) => {
            classes.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          setAulas(classes);
        });
    }
    getAulas(); */
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Aulas</Text>
      {/* <FlatList
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
      /> */}
    </View>
  );
}
