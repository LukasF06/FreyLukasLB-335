import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';

import signInUser from './SignIn.js';

function Authentication({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = () => {
        signInUser(email, password, navigation);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.signinContainer}>
                    <Text style={styles.titleText}>Anmelden:</Text>
                    <TextInput style={styles.userInput} placeholder='Geben Sie ihre E-Mail ein...' onChangeText={(emailInput) => setEmail(emailInput)} value={email}></TextInput>
                    <TextInput style={styles.userInput} placeholder='Geben Sie ihr Passwort ein...' secureTextEntry={true} onChangeText={(passwordInput) => setPassword(passwordInput)} value={password}></TextInput>
                    <TouchableOpacity style={styles.authenticateButton} onPress={() => signIn()}><Text style={styles.buttonText}>Anmelden</Text></TouchableOpacity>
                    <TouchableOpacity style={{marginTop: 25}} onPress={() => navigation.navigate('Registrieren')}><Text style={styles.registerButton}>Registrieren</Text></TouchableOpacity>
                </View>
            <StatusBar style="auto" />
            </View>
        </TouchableWithoutFeedback>
        
      );
};

export default Authentication;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    signinContainer: {
      alignItems: 'center',
      //backgroundColor: 'gray',
      width: '90%',
      height: '50%',
      marginTop: 70
    },
    titleText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'black'
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    userInput: {
        backgroundColor: 'white',
        borderBottomWidth: 2,
        width: '100%',
        height: 25,
        color: 'black',
        fontSize: 17,
        marginTop: 56,
        padding: 3
    },
    authenticateButton: {
        width: '50%',
        height: '15%',
        borderRadius: 10,
        marginTop: 46,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButton: {
        color: 'black',
        fontSize: 15,
        textDecorationLine: 'underline'
    }
});