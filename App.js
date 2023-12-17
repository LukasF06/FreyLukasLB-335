import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './components/HomeScreen.js';
import AddTodo from './components/AddTodo.js';
import AddCategory from './components/AddCategory.js';
import CategoryScreen from './components/CategoryScreen.js';
import Authentication from './components/Authentication.js';
import Register from './components/Register.js';

//----- React Navigation erstellt mithilfe von: https://reactnavigation.org/docs/getting-started/ -----//
function App() {
  const Stack = createNativeStackNavigator();
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Anmeldung" screenOptions={{animation: 'none'}}>
        <Stack.Screen name="Anmeldung" component={Authentication} options={{ title: "Anmeldung", headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="Registrieren" component={Register} options={{ title: "Registrieren", headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="Deine ToDo's" component={HomeScreen} options={{ title: "Deine ToDo's", headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ToDo erstellen" component={AddTodo} options={{ title: "ToDo erstellen", headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="Kategorie erstellen" component={AddCategory} options={{ title: "Kategorie erstellen", headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="Deine Kategorien" component={CategoryScreen} options={{ title: "Deine Kategorien", headerShown: false, gestureEnabled: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App