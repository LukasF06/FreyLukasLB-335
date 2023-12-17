import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Vibration, Alert } from 'react-native';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo, Ionicons } from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ref, getDatabase, push } from 'firebase/database';
import { Gyroscope } from 'expo-sensors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import GetData from './GetData.js';
import IncorrectEntryMessage from './IncorrectEntryMessage.js';

function AddTodo({navigation}) {
    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [savedCategories, setSavedCategories] = useState([]);
    const gyroSubscriptionRef = useRef(null);
    const alertVisibleRef= useRef(false);

    const getDataLink = '/categories';

    const checkIfShaking = ({x,y,z}) => {
      if(alertVisibleRef.current == false && (Math.abs(x) > 5 || Math.abs(y) > 5 || Math.abs(z) > 5)) {
        alertVisibleRef.current = true;
        Vibration.vibrate();
        Alert.alert('Wollen Sie den eingegebenen Text löschen?', null, [
          {
            text: 'Ja',
            onPress: () => {setTitle(''); setText(''); alertVisibleRef.current = false;}
          },
          {
            text: 'Nein',
            onPress: () => alertVisibleRef.current = false
          }        
        ]);
      }
    }
    // subscribeGyro, unSubscribeGyro und der daraufflogedene useEffect erstellt mithilfe von: https://docs.expo.dev/versions/latest/sdk/gyroscope/ -----//
    const subscribeGyro = () => {
      if(!gyroSubscriptionRef.current) {
        const getGyroData = Gyroscope.addListener(checkIfShaking);
        gyroSubscriptionRef.current = getGyroData;
      }
    }

    const unSubscribeGyro = () => {
      if(gyroSubscriptionRef.current) {
        gyroSubscriptionRef.current.remove();
        gyroSubscriptionRef.current = null;
      }
    }

    useEffect(() => {
      Gyroscope.setUpdateInterval(1000);
      subscribeGyro();

      return() => unSubscribeGyro();
    }, []);

    useFocusEffect(
      useCallback(() => {
        getCategories();
      }, [])
    );

    // saveTodo erstellt mithilfe von: https://firebase.google.com/docs/database/web/read-and-write?hl=de -----//
    const saveTodo = () =>
    {
      if(title == '') {
        IncorrectEntryMessage('Sie haben keinen Titel eingegeben');
      } else if(text == '') {
        IncorrectEntryMessage('Sie haben keinen Text eingegeben');
      } else if(selectedCategory == '') {
        IncorrectEntryMessage('Sie haben keine Kategorie ausgewählt');
      } else {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().padStart(-2);
  
        const newDate = `${day}.${month}.${year}`;
  
        const db = getDatabase();
  
        const newTodo = {
          title: title,
          text: text,
          textDate: newDate,
          date: `${date}`,
          selectedCategory: selectedCategory,
          isFinished: false
        };
  
        const todosRef = ref(db, 'todos');
  
        push(todosRef, newTodo);

        navigation.navigate("Deine ToDo's")
      }
    }

    const togglePickerVisibility = () => {
        setIsPickerVisible(!isPickerVisible);
    }

  const getCategories = () =>
  {
    GetData(getDataLink, setSavedCategories);
  }

  const changeNavigation = async () => {
    try {
      await AsyncStorage.setItem('Navigation', 'true');
    } catch (e) {
      console.log(e);
    }
  }
  
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <TextInput style={styles.titleInput} placeholder='Geben Sie einen Titel ein...' maxLength={21} onChangeText={title => setTitle(title)} value={title}></TextInput>
          <TextInput style={styles.textInput} placeholder='Geben Sie Details ein...' onChangeText={text => setText(text)} value={text} multiline></TextInput>
          <View style={styles.createButtonContainer}>
            <DateTimePicker mode='date' display='default' minimumDate={new Date()} onChange={(event, selectedDate) => { const currentDate = selectedDate || date; setDate(currentDate)}} value={date}></DateTimePicker>
            <View style={styles.createButtonContainerVertical}>
              <TouchableOpacity style={styles.addCategoryButton} onPress={() => togglePickerVisibility()}>
                <Text style={styles.createButtonText}>Kategorie hinzufügen</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createCategoryButton} onPress={async () => {await changeNavigation(); navigation.navigate('Kategorie erstellen')}}>
              <Entypo name="plus" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          {isPickerVisible && (
            <View style={styles.categoryPopup}>
              <Picker selectedValue={selectedCategory} onValueChange={(categoryValue) => {setSelectedCategory(categoryValue)}} style={styles.categoryPicker}>
                  {
                    savedCategories ? Object.keys(savedCategories).map((key) => {
                      const category = savedCategories[key];
                      return (
                        <Picker.Item key={key} label={category.title} value={category.color} />
                      );
                    }) : <Picker.Item label='' value='' />
                  }
              </Picker>
            </View>
            )}
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={async () => {saveTodo();}}>
                <Entypo name="check" size={55} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: '10%'}} onPress={() => navigation.navigate("Deine ToDo's")}>
                <Ionicons name="arrow-back-circle-sharp" style={styles.closeButton} />
              </TouchableOpacity>
            </View>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
    );
}

export default AddTodo;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    addCategoryContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleInput: {
      backgroundColor: 'white',
      borderBottomWidth: 2,
      width: '88%',
      height: '5%',
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: hp('5%')
    },
    textInput: {
      backgroundColor: 'white',
      borderWidth: 2,
      borderRadius: 10,
      width: '88%',
      height: '30%',
      color: 'black',
      fontSize: 18,
      marginTop: hp('4%'),
      padding: 5
    },
    createButtonContainer: {
      //backgroundColor: '#dedede',
      height: '20%',
      width: '93%',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginTop: 15
    },
    createButtonContainerVertical: {
      //backgroundColor: '#dedede',
      height: '100%',
      width: wp('45%'),
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      marginRight: '2.5%',
    },
    addCategoryButton: {
      backgroundColor: '#ededed',
      width: '100%',
      height: '40%',
      borderRadius: 10,
      shadowColor: 'black',
      marginRight: '2.5%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    createCategoryButton: {
      backgroundColor: '#dedede',
      width: '60%',
      height: 30,
      borderEndEndRadius: 10,
      borderEndStartRadius: 10,
      marginRight: '2.5%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    createButtonText: {
      color: 'black',
      fontSize: 15,
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
    categoryPicker: {
      width: '100%',
      height: '109%',
      justifyContent: 'center'
    },
    categoryPopup: {
      width: '70%',
      height: '25%',
      borderRadius: 15,
      backgroundColor: '#f2f2f2',
      position: 'absolute',
      marginTop: hp('16.5%'),
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
  },
    actionButtonContainer: {
      width: wp('100%'),
      height: hp('7%'),
      justifyContent: 'center',
      flexDirection: 'row',
    },
    closeButton: {
      color: 'red',
      fontSize: 60,
  },
  });
  