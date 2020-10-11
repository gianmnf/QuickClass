import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Login from '../views/Login/index';
import Student from '../views/Student/index';
import ClassList from '../views/Student/classList';
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

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Student" component={StudentScreen} />
        <Stack.Screen name="ClassList" component={ClassListScreen} />
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
