import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Loading from '../views/Loading/index';
import Login from '../views/Login/index';
// Aluno - Student
import LoginStudent from '../views/Login/student';
import Student from '../views/Student/index';
import ClassList from '../views/Student/classList';
import Frequency from '../views/Student/frequency';
import FrequencyList from '../views/Student/frequencyList';
// Professor - Teacher
import LoginTeacher from '../views/Login/teacher';
import Teacher from '../views/Teacher/index';
import NewClass from '../views/Teacher/newClass';
import MyClasses from '../views/Teacher/myClassses';
import ClassListTeacher from '../views/Teacher/classListTeacher';

const Stack = createStackNavigator();

function StudentScreen() {
  return <Student />;
}

function LoginScreen() {
  return <Login />;
}

function ClassListScreen() {
  return <ClassList />;
}

function TeacherScreen() {
  return <Teacher />;
}

function NewClassScreen() {
  return <NewClass />;
}

function MyClassesScreen() {
  return <MyClasses />;
}

function ClassListTeacherScreen() {
  return <ClassListTeacher />;
}

function FrequencyScreen() {
  return <Frequency />;
}

function FrequencyListScreen() {
  return <FrequencyList />;
}

function LoginStudentScreen() {
  return <LoginStudent />;
}

function LoginTeacherScreen() {
  return <LoginTeacher />;
}

function LoadingScreen() {
  return <Loading />;
}

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LoginStudent" component={LoginStudentScreen} />
        <Stack.Screen name="LoginTeacher" component={LoginTeacherScreen} />
        <Stack.Screen name="Student" component={StudentScreen} />
        <Stack.Screen name="ClassList" component={ClassListScreen} />
        <Stack.Screen name="Frequency" component={FrequencyScreen} />
        <Stack.Screen name="FrequencyList" component={FrequencyListScreen} />
        <Stack.Screen name="Teacher" component={TeacherScreen} />
        <Stack.Screen name="NewClass" component={NewClassScreen} />
        <Stack.Screen name="MyClasses" component={MyClassesScreen} />
        <Stack.Screen
          name="ClassListTeacher"
          component={ClassListTeacherScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
