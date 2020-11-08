import React from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  header: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Marmelad-Regular',
  },
});

const Header = ({ children }) => <Text style={styles.header}>{children}</Text>;

export default Header;
