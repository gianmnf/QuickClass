import React, { useState, useEffect } from 'react';
import { Text, View, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import RNExitApp from 'react-native-exit-app';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Picker } from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';

export default function NewClass() {
  const navigation = useNavigation();
  const turmas = firestore().collection('turmas');
  const usuarios = firestore().collection('usuarios');
  const [emailProfessor, setEmailProfessor] = useState('');
  const [nomeProfessor, setNomeProfessor] = useState('');
  const [listaTurmas, setListaTurmas] = useState({});
  const [turma, setTurma] = useState('');
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFim, setHoraFim] = useState(new Date());
  const [data, setData] = useState(new Date());
  const [showAlert, setShowAlert] = useState(false);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);

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

  function criarAula() {
    turmas
      .doc(turma)
      .collection('aulas')
      .add({
        professor: nomeProfessor,
        turmaSelecionada: turma,
        inicio: horaInicio,
        fim: horaFim,
      })
      .then((response) => {
        navigation.navigate('Teacher');
      });
  }

  useEffect(() => {
    async function getProfessorTurmas() {
      const id = await AsyncStorage.getItem('@user');
      usuarios
        .doc('tipo')
        .collection('professores')
        .doc(id)
        .get()
        .then((x) => {
          setEmailProfessor(x.data().email);
          setNomeProfessor(x.data().nome);
        })
        .catch((error) => {
          console.log(error);
        });
      turmas
        .where('listaProfessores', 'array-contains', emailProfessor)
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
    getProfessorTurmas();
  }, []);

  return (
    <View style={styles.container}>
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
              value={listaTurmas[id].key}
            />
          );
        })}
      </Picker>
      <Button onPress={() => setShowInicio(true)} title="Horário Inicio" />
      <Button onPress={() => setShowFim(true)} title="Horário Fim" />
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
      <Button onPress={() => criarAula()} title="Enviar" />
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
