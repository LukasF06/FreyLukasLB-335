import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import GetData from './GetData.js';

function FilterPopup({ isVisible, onClose, filterTodos}) {
    const [savedCategories, setSavedCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const getDataLink = '/categories';

    useFocusEffect(
        useCallback(() => {
          getCategories();
        }, [])
    );
    
    const getCategories = () =>
    {
        GetData(getDataLink, setSavedCategories);
    };

    return (
        <Modal supportedOrientations={["portrait", "landscape"]} animationType='fade' transparent={true} visible={isVisible} >
            <View style={styles.popupBackground}>
                <View style={styles.popup}> 
                    <Text style={styles.popupTitle}>Nach welcher Kategorie möchten Sie filtern:</Text>
                    <Picker selectedValue={selectedCategory} onValueChange={(categoryInput) => {setSelectedCategory(categoryInput)}} style={styles.categoryPicker}>
                            {
                                savedCategories ? Object.keys(savedCategories).map((key) => {
                                const category = savedCategories[key];
                                return (
                                    <Picker.Item key={key} label={category.title} value={category.color} />
                                );
                                }) : <Picker.Item label='' value='' />
                            }
                    </Picker>
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity onPress={onClose}><Ionicons name="arrow-back-circle-sharp" style={styles.closeButton} /></TouchableOpacity>
                        <TouchableOpacity onPress={() => filterTodos(selectedCategory)}><Feather name="check-circle" style={styles.submitButton} /></TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default FilterPopup;

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
        height: hp('35%'),
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 35,
    },
    popupTitle: {
        color: 'black',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    categoryPicker: {
        width: '90%',
        height: '10%',
        position: 'absolute',
        marginTop: '10%'
    },
    actionButtonContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: hp('22%'),
        width: '100%'
    },
    closeButton: {
        color: 'red',
        fontSize: 40
    },
    submitButton: {
        color: 'green',
        fontSize: 32,
    }
});