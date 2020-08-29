import React, { useState, useEffect } from 'react';
import {Text, View, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

export default function Student() {
  const navigation = useNavigation();

  return (
    <View>
      <Button title="voltar" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
