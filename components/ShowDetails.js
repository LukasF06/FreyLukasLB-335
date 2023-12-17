import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, Feather } from '@expo/vector-icons';

import EditTodo from './EditTodo.js';

function ShowDetails({isVisible, onClose, todo, todoKey}) {
    const [editVisible, setEditVisible] = useState(false);

    const onEditTodo = () => {
        setEditVisible(true);
    }
    
    const onEditTodoClose = () => {
        setEditVisible(false);
    }

    return (
        <Modal supportedOrientations={["portrait", "landscape"]} animationType='fade' transparent={true} visible={isVisible}>
            <View style={styles.popupBackground}>
                <View style={styles.popup}>
                    <View style={styles.popupContainer}>
                        <Text style={styles.popupTitle}>{todo.title}</Text>
                        <Text style={styles.popupText}>{todo.text}</Text>
                    </View>
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity onPress={onEditTodo}><Feather name="edit-2" style={styles.editButton} /></TouchableOpacity>
                        <TouchableOpacity onPress={onClose}><Ionicons name="arrow-back-circle-sharp" style={styles.closeButton} /></TouchableOpacity>
                    </View>
                </View>
                <EditTodo isVisible={editVisible} onClose={() => {onEditTodoClose(); onClose()}} todo={todo} todoKey={todoKey}></EditTodo>
            </View>
        </Modal>
    )
}

export default ShowDetails;

const styles = StyleSheet.create({
    popupBackground: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
      },
    popup: {
        width: '90%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    popupContainer: {
        width: '100%',
        height: '95%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    popupTitle: {
        color: 'black',
        fontSize: 25,
        fontWeight: 'bold',
    },
    popupText: {
        color: 'black',
        fontSize: 18,
        alignSelf: 'flex-start',
        marginTop: '5%',
    },
    actionButtonContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
    },
    closeButton: {
        color: 'red',
        fontSize: 40
    },
    editButton: {
        color: 'orange',
        fontSize: 32,
    }
});