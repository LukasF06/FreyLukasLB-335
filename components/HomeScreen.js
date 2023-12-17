import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Entypo, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ref, getDatabase, update } from 'firebase/database';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import ShowDetails from './ShowDetails.js';
import FilterPopup from './FilterPopup.js';
import GetData from './GetData.js';
import DeleteData from './DeleteData.js';
import IncorrectEntryMessage from './IncorrectEntryMessage.js';

function HomeScreen({navigation}) {
  const [savedTodos, setSavedTodos] = useState([]);
  const [alreadyFinished, setAlreadyFinished] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [filterPopupVisible, setFilterPopupVisible] = useState(false);
  const [categoryToFilter, setCategoryToFilter] = useState('');
  const [categoryFilterEnabled, setCategoryFilterEnabled] = useState(false);
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
  const [sortedTodosByDate, setsortedTodosByDate] = useState([]);
  const [detailedTodo, setDetailedTodo] = useState([]);
  const [detailedTodoKey, setDetailedTodoKey] = useState('');

  const getDataLink = '/todos';
  const deleteDataLink = 'todos/';

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const getData = () =>
  {
    GetData(getDataLink, setSavedTodos);
  }

  const markAsFinished = (key) => {
    const db = getDatabase();
    const todoRef = ref(db, 'todos/' + key);

    if(alreadyFinished == false) {
      setAlreadyFinished(true);
      
      update(todoRef, { isFinished: true })
        .then(() => {
          getData();
      })
      
      Alert.alert('Wollen Sie das Todo löschen lassen?', null, [
        {
          text: 'Ja',
          onPress: () => deleteData(key)
        },
        {
          text: 'Nein'
        }
      ]);
    } else {
    
      update(todoRef, { isFinished: false })
        .then(() => {
          getData();
      })
      
      setAlreadyFinished(false);
    }
    
  }

  const deleteData = (todoToDelete) => {
    setAlreadyFinished(false);

    DeleteData(deleteDataLink, todoToDelete, getData);
  }

  const onShowDetails = (todoToShow, key) => {
    setDetailsVisible(true);
    setDetailedTodo(todoToShow);
    setDetailedTodoKey(key);
  }

  const onShowDetailsClose = () => {
    setDetailsVisible(false);
  }

  const onShowFilterCategory = () => {
    setFilterPopupVisible(true);
  }

  const onShowFilterCategoryClose = () => {
    setFilterPopupVisible(false);
  }

  const filterCategory = (category) => {
    if(category == '') {
      IncorrectEntryMessage('Sie haben keine Kategorie ausgewählt');
    } else {
      setFilterPopupVisible(false);
      setCategoryFilterEnabled(true);
      setCategoryToFilter(category);    
    }
  }

  const filterDate = () => {
    setDateFilterEnabled(true)
    const today = new Date();

      const sortedTodos = Object.entries(savedTodos)
      .map(([key, value]) => ({key, ...value}))
      .sort((a, b) => {
        const distanceA = new Date(a.date) - today;
        const distanceB = new Date(b.date) - today;

        return distanceA - distanceB
      });

    setsortedTodosByDate(sortedTodos);
  }

  const renderTodos = (todo, key) => {

    return (
      <TouchableOpacity key={key} style={styles.todoBox} onPress={() => onShowDetails(todo, key)}>
        <Text style={styles.dateText}>{todo.textDate}</Text>
        <Text style={styles.todoText}>{todo.title}</Text>
        <View style={[styles.todoCategory, {backgroundColor: todo.selectedCategory}]}></View>
        <TouchableOpacity style={styles.todoCheckbox} onPress={() => markAsFinished(key)}>
          {
            todo.isFinished && (
              <Entypo name="check" size={24} color="red" />
            )
          }
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => filterDate()}>
          <Text style={styles.buttonText}>Nach Datum ordnen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => onShowFilterCategory()}>
          <Text style={styles.buttonText}>Nach Kategorie filtern</Text>
        </TouchableOpacity>
      </View>
        <ScrollView style={styles.todoContainer} contentContainerStyle={{alignItems: 'center'}}>
      {
        savedTodos && (
          Object.keys(savedTodos).map((key) => {
            const todo = savedTodos[key];
  
            if(categoryFilterEnabled == false && dateFilterEnabled == false) {
              
              return renderTodos(todo, key);
  
            } else {
              if(categoryFilterEnabled == true && todo.selectedCategory == categoryToFilter && dateFilterEnabled == false) {
                
                return renderTodos(todo, key);
  
              }
            }
          })
        )
      }
      {
        dateFilterEnabled && sortedTodosByDate.map((todoWithDate) => {
          return renderTodos(todoWithDate, todoWithDate.key);
        })
      }
      </ScrollView>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('ToDo erstellen')}>
          <MaterialCommunityIcons name="calendar-plus" style={styles.addTodoButton} />
        </TouchableOpacity>
        {
          (categoryFilterEnabled || dateFilterEnabled) && (
            <TouchableOpacity style={styles.filterDisableButton} onPress={() => {setDateFilterEnabled(false); setCategoryFilterEnabled(false)}}>
              <Text style={styles.filterDisableText}>Filter ausschalten</Text>
            </TouchableOpacity>   
          )
        }
      </View>
      <View style={styles.buttonBox}>
            <Entypo name="home" style={styles.homeButton} />
            <TouchableOpacity onPress={() => navigation.navigate('Deine Kategorien')}>
            <AntDesign name="folder1" style={styles.categoryButton} />
            </TouchableOpacity>
      </View>
        <ShowDetails isVisible={detailsVisible} onClose={onShowDetailsClose} todo={detailedTodo} todoKey={detailedTodoKey}>
        </ShowDetails>
        <FilterPopup isVisible={filterPopupVisible} onClose={onShowFilterCategoryClose} filterTodos={filterCategory}>
        </FilterPopup>
      <StatusBar style="auto" />
    </View>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    buttonContainer: {
      //backgroundColor: '#dedede',
      height: '10%',
      width: '90%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginTop: hp('5%')
    },
    buttonBox: {
      backgroundColor: 'white',
      height: '14%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      marginTop: 2.1
    },
    homeButton: {
      color: '#24d7ff',
      fontSize: 50,
      marginRight: '35%',
      shadowColor: '#00add4',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.7,
      shadowRadius: 5,
    },
    categoryButton: {
      color: 'black',
      fontSize: 50
    },
    addTodoButton: {
      color: '#46ff40',
      fontSize: 56,
      shadowColor: '#07de00',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.7,
      shadowRadius: 5,
    },
    filterButton: {
      backgroundColor: '#24d7ff',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      height: '80%',
      width: '45%',
      shadowColor: '#00add4',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.7,
      shadowRadius: 7,
    },
    buttonText: {
      color: 'white',
      fontSize: 15,
      fontWeight: 'bold'
    },
    todoContainer: {
      //backgroundColor: '#dedede',
      height: '61%',
      width: '95%',
      marginTop: hp('2%'),
    },
    todoBox: {
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      height: 82,
      width: '95%',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 7,
      marginTop: 21
    },
    dateText: {
      color: 'black',
      fontSize: 15,
      fontWeight: 'bold',
      marginLeft: '3%',
      flex: 0.3,
    },
    todoText: {
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
      flex: 0.5
    },
    todoCategory: {
      borderRadius: 5,
      height: '100%',
      flex: 0.17
    },
    todoCheckbox: {
      backgroundColor: 'white',
      borderRadius: 7,
      borderWidth: 3,
      borderColor: 'black',
      height: '37%',
      width: '8%',
      marginRight: '5%',
      marginLeft:'3%'
    },
    actionButtonContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      height: 65,
      width: wp('57%'),
      marginLeft: wp('43%'),
    },
    filterDisableButton: {
      width: '63%',
      height: '50%',
    },
    filterDisableText: {
      fontSize: 17,
      color: 'red',
      textDecorationLine: 'underline',
    }
});