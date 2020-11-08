/* eslint-disable global-require */
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  image: {
    width: 360,
    height: 60,
    marginBottom: 12,
  },
});

const LogoApp = () => (
  <Image source={require('../assets/LogoApp.png')} style={styles.image} />
);

export default LogoApp;
