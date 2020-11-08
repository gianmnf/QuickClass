import React from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    lineHeight: 26,
    color: 'white',
    textAlign: 'center',
    marginBottom: 14,
    fontFamily: 'Marmelad-Regular',
  },
});

const Paragraph = ({ children }) => <Text style={styles.text}>{children}</Text>;

export default Paragraph;
