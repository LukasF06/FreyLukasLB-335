import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import ColorPicker from 'react-native-wheel-color-picker';
import { Entypo, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, push } from "firebase/database";
import { useFocusEffect } from '@react-navigation/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import IncorrectEntryMessage from './IncorrectEntryMessage.js';

function AddCategory({navigation}) {
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('');
    const [nav, setNav] = useState(false);

    useFocusEffect(
      useCallback(() => {
        getNavigation();
      })
  );

    // saveCategory erstellt mithilfe von: https://firebase.google.com/docs/database/web/read-and-write?hl=de -----//
    const saveCategory = () => {

      if(title == '' && color != '#ffffff') {
        IncorrectEntryMessage('Sie haben keinen Titel eingegeben');
      } else if(color == '#ffffff' && title != '') {
        IncorrectEntryMessage('Sie haben keine Farbe ausgewählt');
      } else if(title == '' && color == '#ffffff') {
        IncorrectEntryMessage('Sie haben keine Eingaben eingegeben');
      } else {
        const db = getDatabase();

        const newCategory = {
          title: title,
          color: color,
        };

        const categoriesRef = ref(db, 'categories');

        push(categoriesRef, newCategory);

        if (nav == true) {
          navigation.navigate("ToDo erstellen");
        } else {
          navigation.navigate("Deine Kategorien");
        }
      }
    }

    const getNavigation = async () => {

      try {
        const nav = await AsyncStorage.getItem('Navigation');

        if(nav != 'false') {
          setNav(true)
        }
      } catch (e) {
        console.error(e);
      }
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.addCategoryContainer}>
          <TextInput style={styles.titleInput} placeholder='Geben Sie einen Namen ein...' onChangeText={title => setTitle(title)} value={title}></TextInput>
          <View style={styles.categoryColorpickerContainer}>
            <ColorPicker onColorChange={color => setColor(color)} style={{width: '100%', marginTop: hp('1%') }} thumbSize={35} sliderHidden={true} swatches={false}></ColorPicker>
          </View>
          {
            nav ? (
              <View style={styles.actionButtonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={() => {saveCategory();}}>
                  <Entypo name="check" size={55} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: '10%'}} onPress={() => navigation.navigate("ToDo erstellen")}>
                  <Ionicons name="arrow-back-circle-sharp" style={styles.closeButton} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionButtonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={() => {saveCategory();}}>
                  <Entypo name="check" size={55} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: '10%'}} onPress={() => navigation.navigate("Deine Kategorien")}>
                  <Ionicons name="arrow-back-circle-sharp" style={styles.closeButton} />
                </TouchableOpacity>
              </View>
            )
          }
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
    );
}

export default AddCategory

const styles = StyleSheet.create({
    addCategoryContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    titleInput: {
      backgroundColor: 'white',
      borderBottomWidth: 2,
      width: '88%',
      height: '5%',
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: hp('7%')
    },
    categoryColorpickerContainer: {
      width: '90%',
      height: '53.75%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitButton: {
      width: '40%',
      height: '100%',
      borderRadius: 10,
      backgroundColor: '#46ff40',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#07de00',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.7,
      shadowRadius: 7,
      marginLeft: wp('25%')
    },
    actionButtonContainer: {
      width: wp('100%'),
      height: hp('7%'),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    closeButton: {
      color: 'red',
      fontSize: 60,
  },
  });