import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff7c03',
  },
  containerIndex: {
    flex: 1,
    alignItems: 'center',
    resizeMode: 'center',
    backgroundColor: '#ff7c03',
  },
  titulo: {
    fontSize: 25,
    fontFamily: 'Marmelad-Regular',
    textAlign: 'center',
    color: 'white',
    paddingBottom: 5,
  },
  welcome: {
    fontSize: 25,
    fontFamily: 'Marmelad-Regular',
    textAlign: 'center',
    color: 'white',
    paddingTop: 15,
  },
  header: {
    fontSize: 25,
    fontFamily: 'Marmelad-Regular',
    textAlign: 'center',
    color: 'white',
    paddingTop: 5,
    paddingBottom: 10,
  },
  image: {
    width: 64,
    height: 64,
    paddingLeft: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  button: {
    backgroundColor: '#2295f3',
    padding: 10,
    marginBottom: 10,
    borderRadius: 2,
    width: 200,
  },
  textButton: {
    textAlign: 'center',
  },
});

export default styles;
