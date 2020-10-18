/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import Dialog, { DialogTitle, DialogContent } from 'react-native-popup-dialog';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import styles from './styles';

export default function ClassListTeacher() {
  const usuarios = firestore().collection('usuarios');
  const aulas = firestore().collection('aulas');
  const [listaAulas, setListaAulas] = useState({});
  const [isModalVisible, setIsVisible] = useState(false);
  const [listaAlunos, setListaAlunos] = useState({});

  async function getAlunos(idAula) {
    await aulas
      .doc(idAula)
      .collection('alunosPresentes')
      .get()
      .then((response) => {
        const resultAlunos = [];

        response.forEach((documentSnapshot) => {
          resultAlunos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setListaAlunos(resultAlunos);
      })
      .catch((error) => {
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
              <Text style={{ color: 'white' }}>{item.nome}</Text>
            )}
          />
          <Button title="Fechar" onPress={() => setIsVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}
