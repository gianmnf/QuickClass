import * as React from 'react';
import Login from '../views/Login/index';
import Student from '../views/Student/index';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

function StudentScreen() {
  return <Student />;
}

function LoginScreen() {
  return <Login />;
}

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Student" component={StudentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;