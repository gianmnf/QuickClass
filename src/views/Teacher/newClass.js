import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import RNExitApp from 'react-native-exit-app';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Picker } from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from 'react-native-geolocation-service';
import styles from './styles';

export default function NewClass() {
  const navigation = useNavigation();
  const turmas = firestore().collection('turmas');
  const usuarios = firestore().collection('usuarios');
  const aulas = firestore().collection('aulas');
  const [nomeProfessor, setNomeProfessor] = useState('');
  const [listaTurmas, setListaTurmas] = useState({});
  const [listaDisciplinas, setListaDisciplinas] = useState({});
  const [turma, setTurma] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFim, setHoraFim] = useState(new Date());
  const [showAlert, setShowAlert] = useState(false);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const onChangeInicio = (event, selectedInicio) => {
    const currentInicio = selectedInicio || horaInicio;
    setShowInicio(false);
    setHoraInicio(currentInicio);
  };

  const onChangeFim = (event, selectedFim) => {
    const currentFim = selectedFim || horaFim;
    setShowFim(false);
    setHoraFim(currentFim);
  };

  async function criarAula() {
    const email = await AsyncStorage.getItem('@emailProfessor');
    if (lat !== 0 && lon !== 0) {
      aulas
        .add({
          professor: nomeProfessor,
          professorEmail: email,
          disciplinaAula: disciplina,
          inicio: horaInicio,
          fim: horaFim,
          turmaNome: turma,
          latitude: lat,
          longitude: lon,
        })
        .then(() => {
          ToastAndroid.show('Aula cadastrada com sucesso!', ToastAndroid.SHORT);
          navigation.navigate('Teacher');
        })
        .catch((err) => {
          ToastAndroid.show(err, ToastAndroid.SHORT);
        });
    } else {
      ToastAndroid.show(
        'Ligue sua localização antes de criar uma aula!',
        ToastAndroid.LONG
      );
    }
  }

  function getDisciplinas(id) {
    usuarios
      .doc('tipo')
      .collection('professores')
      .doc(id)
      .get()
      .then((x) => {
        const resultList = [];
        const disciplinaList = x.data().listaDisciplinas;
        let i = 0;
        disciplinaList.forEach((documentSnapshot) => {
          resultList.push({
            key: i + 1,
            value: documentSnapshot,
          });
          i += 1;
        });
        setListaDisciplinas(resultList);
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      });
  }

  function getProfessor(id) {
    usuarios
      .doc('tipo')
      .collection('professores')
      .doc(id)
      .get()
      .then((x) => {
        setNomeProfessor(x.data().nome);
        getDisciplinas(id);
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      });
  }

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

  useEffect(() => {
    async function getProfessorDados() {
      const id = await AsyncStorage.getItem('@user');
      const email = await AsyncStorage.getItem('@emailProfessor');
      if (email !== null) {
        getTurmas(email);
        getProfessor(id);
      } else {
        getProfessor(id);
      }
    }
    getProfessorDados();
  }, []);

  useEffect(() => {
    async function getLocation() {
      Geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          ToastAndroid.show(
            `Código do Erro:${error.code} - Erro:${error.message}`,
            ToastAndroid.LONG
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
    getLocation();
  }, [lat, lon]);

  return (
    <View style={styles.containerIndex}>
      <Text style={styles.titulo}>Nova Aula</Text>
      <Text>Turma</Text>
      <Picker
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue) => setTurma(itemValue)}
        selectedValue={turma}
      >
        {Object.keys(listaTurmas).map((id) => {
          return (
            <Picker.Item
              key={id}
              label={listaTurmas[id].nome}
              value={listaTurmas[id].nome}
            />
          );
        })}
      </Picker>
      <Text>Disciplina</Text>
      <Picker
        style={{ height: 50, width: 250 }}
        onValueChange={(itemValue) => setDisciplina(itemValue)}
        selectedValue={disciplina}
      >
        {Object.keys(listaDisciplinas).map((id) => {
          return (
            <Picker.Item
              key={id}
              label={listaDisciplinas[id].value}
              value={listaDisciplinas[id].value}
            />
          );
        })}
      </Picker>
      <TouchableOpacity
        onPress={() => setShowInicio(true)}
        style={styles.button}
      >
        <Text style={styles.textButton}>Horário Início</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowFim(true)} style={styles.button}>
        <Text style={styles.textButton}>Horário Fim</Text>
      </TouchableOpacity>
      {showInicio && (
        <DateTimePicker
          testID="dateTimePicker"
          value={horaInicio}
          mode="time"
          is24Hour
          display="default"
          onChange={onChangeInicio}
        />
      )}
      {showFim && (
        <DateTimePicker
          testID="dateTimePicker"
          value={horaFim}
          mode="time"
          is24Hour
          display="default"
          onChange={onChangeFim}
        />
      )}
      <TouchableOpacity onPress={() => criarAula()} style={styles.button}>
        <Text style={styles.textButton}>Criar</Text>
      </TouchableOpacity>
      {/* Alert para sair do App */}
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Sair do Aplicativo"
        message="Você deseja sair do aplicativo?"
        closeOnTouchOutside
        closeOnHardwareBackPress={false}
        showCancelButton
        showConfirmButton
        cancelText="Não"
        confirmText="Sim"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          RNExitApp.exitApp();
        }}
      />
    </View>
  );
}
