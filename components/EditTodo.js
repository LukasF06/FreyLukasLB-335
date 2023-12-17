import { StyleSheet, Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ref, getDatabase, update } from 'firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import GetData from './GetData.js';
import IncorrectEntryMessage from './IncorrectEntryMessage.js';

function EditTodo({isVisible, onClose, todo, todoKey}) {
    const [changedTitle, setChangedTitle] = useState(todo.title);
    const [changedText, setChangedText] = useState(todo.text);
    const [changedDate, setChangedDate] = useState(new Date(todo.date));
    const [savedCategories, setSavedCategories] = useState([]);
    const [changedCategory, setChangedCategory] = useState('');
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    const getDataLink = '/categories';

    useFocusEffect(
        useCallback(() => {
          getCategories();
        }, [])
    );
    
    const getCategories = () =>
    {
        GetData(getDataLink, setSavedCategories)
    }

    //----- Edit-Funktion erstellt mithilfe von: https://firebase.google.com/docs/database/web/read-and-write?hl=de -----//
    const editTodo = () => {
        if(changedTitle == '') {
            IncorrectEntryMessage('Sie haben keinen Titel eingegeben');
          } else if(changedText == '') {
            IncorrectEntryMessage('Sie haben keinen Text eingegeben');
          } else if(changedCategory == '') {
            IncorrectEntryMessage('Sie haben keine Kategorie ausgewählt');
          } else {
            const db = getDatabase();
            const todoRef = ref(db, 'todos/' + todoKey);
    
            const day = changedDate.getDate().toString().padStart(2, '0');
            const month = (changedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = changedDate.getFullYear().toString().padStart(-2);
    
            const newChangedDate = `${day}.${month}.${year}`;
    
            const changedTodo =
            {
                title: changedTitle,
                text: changedText,
                textDate: newChangedDate,
                date: `${changedDate}`,
                selectedCategory: changedCategory,
                isFinished: false
            };
    
            update(todoRef, changedTodo)
                .then(() => {
                onClose();
            })          
        }
    }

    const togglePickerVisibility = () => {
        setIsPickerVisible(!isPickerVisible);
    };

    return (
        <Modal supportedOrientations={["portrait", "landscape"]} transparent={true} visible={isVisible}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.popupBackground}>
                    <View style={styles.popup}>
                        <TextInput style={styles.titleInput} value={changedTitle} maxLength={21} onChangeText={(titleInput) => setChangedTitle(titleInput)}></TextInput>
                        <TextInput style={styles.textInput} value={changedText} onChangeText={(textInput) => setChangedText(textInput)} multiline></TextInput>
                        <View style={styles.buttonContainer}>
                            <DateTimePicker mode='date' display='default' minimumDate={new Date()} onChange={(event, selectedDate) => { const currentDate = selectedDate || changedDate; setChangedDate(currentDate)}} value={changedDate}></DateTimePicker>
                            <TouchableOpacity style={styles.categoryButton} onPress={() => {togglePickerVisibility()}}><Text style={{fontSize: 17}}>Kategorien</Text></TouchableOpacity>
                        </View>
                        <View style={styles.actionButtonContainer}>
                            <TouchableOpacity onPress={onClose}><Ionicons name="arrow-back-circle-sharp" style={styles.closeButton} /></TouchableOpacity>
                            <TouchableOpacity onPress={() => editTodo()}><Feather name="check-circle" style={styles.submitButton} /></TouchableOpacity>
                        </View>
                        {
                            isPickerVisible && (
                                <View style={styles.categoryPopup}>
                                    <Picker selectedValue={changedCategory} onValueChange={(categoryInput) => {setChangedCategory(categoryInput)}} style={styles.categoryPicker}>
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
                            )
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>  
        </Modal>
    )
}

export default EditTodo;

const styles = StyleSheet.create({
    popupBackground: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
      },
    popup: {
        width: '90%',
        height: '80%',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    titleInput: {
        backgroundColor: 'white',
        borderBottomWidth: 3,
        width: '95%',
        height: hp('5%'),
        color: 'black',
        fontSize: 15,
        padding: 3,
        fontWeight: 'bold',
        fontSize: 25
    },
    textInput: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        width: '95%',
        height: '50%',
        color: 'black',
        fontSize: 18,
        marginTop: hp('2%'),
        padding: 5
    },
    buttonContainer: {
        height: hp('3.9%'),
        width: '95%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: hp('1%')
    },
    categoryPicker: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    actionButtonContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        marginTop: hp('2%')
    },
    closeButton: {
        color: 'red',
        fontSize: 40
    },
    submitButton: {
        color: 'green',
        fontSize: 32,
    },
    categoryPopup: {
        width: '80%',
        height: '37%',
        borderRadius: 15,
        backgroundColor: '#f2f2f2',
        position: 'absolute',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    categoryButton: {
        backgroundColor: '#ededed',
        width: '37%',
        height: '100%',
        borderRadius: 10,
        shadowColor: 'black',
        marginRight: '2.5%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});