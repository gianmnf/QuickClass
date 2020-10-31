import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import { PermissionsAndroid } from 'react-native';

export async function configureGoogleLogin() {
  GoogleSignin.configure({
    webClientId:
      '1071424142938-obk2deb2c8otbcmsdbklhcmdtgc9nvv1.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
}

export async function auth() {
  async function storeUserKey(uk) {
    await AsyncStorage.setItem('@user', uk);
  }

  async function saveTipo(tipo) {
    AsyncStorage.setItem('@tipo', tipo);
  }

  async function saveProfessor(info) {
    const userKey = await AsyncStorage.getItem('@user');
    return firestore()
      .collection('usuarios')
      .doc('tipo')
      .collection('professores')
      .doc(userKey)
      .update({
        nome: info.user.name,
        fotoUrl: info.user.photo,
      })
      .then(() => {
        saveTipo('professor');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function saveAluno(info) {
    const userKey = await AsyncStorage.getItem('@user');
    return firestore()
      .collection('usuarios')
      .doc('tipo')
      .collection('alunos')
      .doc(userKey)
      .update({
        nome: info.user.name,
        fotoUrl: info.user.photo,
      })
      .then(() => {
        saveTipo('aluno');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function checkProfessor(info) {
    firestore()
      .collection('usuarios')
      .doc('tipo')
      .collection('professores')
      .where('email', '==', info.user.email)
      .get()
      .then((response) => {
        const result = [];

        response.forEach((documentSnapshot) => {
          result.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        if (result.length === 1) {
          storeUserKey(result[0].key);
          saveProfessor(info);
        }
        return false;
      });
  }

  async function checkAluno(info) {
    firestore()
      .collection('usuarios')
      .doc('tipo')
      .collection('alunos')
      .where('email', '==', info.user.email)
      .get()
      .then((response) => {
        const resultAluno = [];

        response.forEach((documentSnapshot) => {
          resultAluno.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        if (resultAluno.length === 1) {
          storeUserKey(resultAluno[0].key);
          saveAluno(info);
        }
        return false;
      });
  }

  async function loginGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (
        userInfo.user.email.endsWith('@unipam.edu.br') ||
        userInfo.user.email.startsWith('gianveloxsi')
      ) {
        checkProfessor(userInfo);
        checkAluno(userInfo);
      } else {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Login cancelado.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('O login já está sendo efetuado.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(
          'A sua versão do Google Play Services está desatualizada ou indisponível.'
        );
      } else {
        console.log('ERRO: ', error);
      }
    }
  }
  await loginGoogle();
  return true;
}

export async function permissaoLocalizacao() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Permissão de Localização',
        message:
          'Para o correto funcionamento deste aplicativo ' +
          'é necessário habilitar o uso da sua Localização.',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Uso permitido.');
    } else {
      console.log('Falha.');
    }
  } catch (err) {
    console.warn(err);
  }
}
