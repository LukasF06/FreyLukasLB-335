import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Entypo, AntDesign, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import GetData from './GetData.js';
import DeleteData from './DeleteData.js';

function CategoryScreen({navigation}) {
  const [savedCategories, setSavedCategories] = useState([]);

  const getDataLink = '/categories';
  const deleteDataLink = 'categories/';

  useFocusEffect(
    useCallback(() => {
      getData();
      changeNavigation();
    }, [])
  );

  const getData = () =>
  {
    GetData(getDataLink, setSavedCategories);
  }

  const deleteData = (catToDelete) =>
  {
    DeleteData(deleteDataLink, catToDelete, getData);
  }

  const changeNavigation = async () => {

    try {
      await AsyncStorage.setItem('Navigation', 'false');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.categoryContainer} contentContainerStyle={{alignItems: 'center'}}>
      {
        savedCategories ? Object.keys(savedCategories).map((key) => {
          const category = savedCategories[key];
          return (
            <View key={key} style={[styles.categoryBox, {backgroundColor: category.color}]}>
              <Text style={styles.categoryText}>{category.title}</Text>
              <TouchableOpacity onPress={() => deleteData(key)}>
                <MaterialIcons name="delete" style={styles.deleteButton} />
              </TouchableOpacity>
            </View>
          );
        }) : <Text></Text>
      }
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('Kategorie erstellen')}>
            <AntDesign name="addfolder" style={styles.addCategoryButton} />
        </TouchableOpacity>
      <View style={styles.buttonBox}>
            <TouchableOpacity onPress={() => navigation.navigate("Deine ToDo's")}>
                <Entypo name="home" style={styles.homeButton} />
            </TouchableOpacity>
            <AntDesign name="folder1" style={styles.categoryButton} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default CategoryScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    buttonBox: {
      backgroundColor: 'white',
      height: '14%',
      width: '100%',
      marginTop: '2%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    homeButton: {
      color: 'black',
      fontSize: 50,
      marginRight: '35%',
    },
    categoryButton: {
        color: '#24d7ff',
        fontSize: 50,
        shadowColor: '#00add4',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
    },
    addCategoryButton: {
      color: '#46ff40',
      fontSize: 56,
      shadowColor: '#07de00',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.7,
      shadowRadius: 5,
      marginTop: hp('0.9%')
    },
    categoryContainer: {
      //backgroundColor: '#dedede',
      height: '71.2%',
      width: '95%',
      marginTop: hp('7%')
    },
    categoryBox: {
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      height: 95,
      width: '80%',
      padding: 19,
      marginBottom: hp('1.4%'),
    },
    categoryText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    deleteButton: {
      color: 'red',
      fontSize: 40,
    },
});