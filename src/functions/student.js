import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';

export async function setTurma(email) {
  const turmas = firestore().collection('turmas');

  turmas
    .where('listaAlunos', 'array-contains', email)
    .get()
    .then((response) => {
      const resultTurma = [];

      response.forEach((documentSnapshot) => {
        resultTurma.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      AsyncStorage.setItem('@turma', resultTurma[0].key);
    });
}
