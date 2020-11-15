/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import Modal from 'react-native-modal';
import styles from './styles';

export default function ClassListTeacher() {
  const usuarios = firestore().collection('usuarios');
  const aulas = firestore().collection('aulas');
  const [listaAulas, setListaAulas] = useState({});
  const [isModalVisible, setIsVisible] = useState(false);
  const [listaAlunos, setListaAlunos] = useState();

  async function getAlunos(idAula) {
    await aulas
      .doc(idAula)
      .get()
      .then((response) => {
        setListaAlunos(response.data().alunosPresentes);
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      });
    setIsVisible(true);
  }

  async function getAulas(email) {
    await aulas
      .where('professorEmail', '==', email)
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

  async function getProfessorEmail(id) {
    const email = await AsyncStorage.getItem('@emailProfessor');
    usuarios
      .doc('tipo')
      .collection('professores')
      .doc(id)
      .get()
      .then((x) => {
        AsyncStorage.setItem('@emailProfessor', x.data().email);
        getAulas(email);
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
        getAulas(email);
      } else {
        getProfessorEmail(id);
      }
    }
    getProfessorDados();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Visualizar Frequência</Text>
      <FlatList
        data={listaAulas}
        renderItem={({ item }) => (
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
            <Text>Turma: {item.turmaNome} </Text>
            <Text>
              Horário de Início:
              {format(item.inicio.toDate(), ' d/M/yyyy - H:mm')}
            </Text>
            <Text>
              Horário de Fim:{format(item.fim.toDate(), ' d/M/yyyy - H:mm')}
            </Text>
            <Button
              title="Visualizar alunos presentes"
              onPress={() => getAlunos(item.key)}
            />
          </View>
        )}
      />
      <Modal
        isVisible={isModalVisible}
        backdropColor="orange"
        backdropOpacity={1}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>Lista de Alunos Presentes</Text>
          <FlatList
            data={listaAlunos}
            renderItem={({ item }) => (
              <Text style={{ color: 'white' }} key={item.nome}>
                {item.nome} - Data/Hora Presença: {format(item.dataPresenca.toDate(), ' d/M/yyyy - H:mm')}
              </Text>
            )}
            keyExtractor={(item) => item.key}
          />
          <Button title="Fechar" onPress={() => setIsVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}
