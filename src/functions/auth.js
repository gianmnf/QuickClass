import { GoogleSignin } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import { PermissionsAndroid, ToastAndroid } from 'react-native';

export async function configureGoogleLogin() {
  GoogleSignin.configure({
    webClientId:
      '1071424142938-obk2deb2c8otbcmsdbklhcmdtgc9nvv1.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
}

export async function storageSave(value, tipo) {
  await AsyncStorage.setItem('@user', value);
  await AsyncStorage.setItem('@tipo', tipo);
}

export async function limparCredenciais() {
  await GoogleSignin.revokeAccess();
  await GoogleSignin.signOut();
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
      ToastAndroid.show('Uso do GPS permitido.', ToastAndroid.LONG);
    } else {
      ToastAndroid.show(
        'Falha ao ativar GPS, tente novamente.',
        ToastAndroid.LONG
      );
    }
  } catch (err) {
    console.warn(err);
  }
}
