import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import IncorrectEntryMessage from "./IncorrectEntryMessage.js";


//----- Erstellt mithilfe von: https://firebase.google.com/docs/auth/web/start?hl=de -----//
function CreateUser(email, password, navigation) {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
        navigation.navigate('Anmeldung');
    })
    .catch((error) => {
        let errorMessage = '';

        if(error.code == 'auth/invalid-email') {
            errorMessage = 'Sie haben eine ungültige Email-Adresse eingegeben...';
        } else if(error.code == 'auth/missing-password') {
            errorMessage = 'Sie haben kein Passwort eingegeben...';
        } else if(error.code == 'auth/weak-password') {
            errorMessage = 'Das Passwort ist zu schwach...';
        } else if(error.code == 'auth/missing-email') {
            errorMessage = 'Sie haben keine Email-Adresse eingegeben...';
        }
            
        IncorrectEntryMessage(errorMessage);
    });
}

export default CreateUser