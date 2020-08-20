import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import styles from './styles';
//Login usando o google
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import reactotron from 'reactotron-react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

export default function Login() {
  const [user, setUser] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    async function configureGoogleLogin() {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId:
          '1071424142938-obk2deb2c8otbcmsdbklhcmdtgc9nvv1.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        //hostedDomain: '', // specifies a hosted domain restriction
        //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        //accountName: '', // [Android] specifies an account name on the device that should be used
        //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      });
    }

    configureGoogleLogin();
  }, []);

  async function login() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.user.email.endsWith('@unipam.edu.br')) {
        setMensagem('Autorizado');
        setUser(userInfo);
        const userID = JSON.stringify(user.user.id);
        const userName = JSON.stringify(user.user.name);
        AsyncStorage.setItem('@userId', userID);
        AsyncStorage.setItem('@userName', userName);
        navigation.navigate('Student');
      } else {
        setMensagem('Email não autorizado.');
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setMensagem('Login cancelado.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setMensagem('O login já está sendo efetuado.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setMensagem(
          'A sua versão do Google Play Services está desatualizada ou indisponível.',
        );
      } else {
        console.log(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text>{user.user !== undefined ? user.user.name : 'Padrão'}</Text>
      <Text>{user.user !== undefined ? user.user.email : 'Padrão'}</Text>
      <Text>{mensagem}</Text>
      <GoogleSigninButton
        style={styles.googleBtn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={login}
      />
    </View>
  );
}
