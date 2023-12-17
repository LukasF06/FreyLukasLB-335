import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import IncorrectEntryMessage from "./IncorrectEntryMessage.js";

//----- Erstellt mithilfe von: https://firebase.google.com/docs/auth/web/start?hl=de -----//
function signInUser(email, password, navigation)
{
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        navigation.navigate("Deine ToDo's");
    })
    .catch((error) => {
        let errorMessage = '';

        if(error.code == 'auth/invalid-email') {
            errorMessage = 'Sie haben eine falsche Email-Adresse eingegeben...';
        } else if(error.code == 'auth/missing-password') {
            errorMessage = 'Sie haben kein Passwort eingegeben...';
        } else if(error.code == 'auth/invalid-credential') {
            errorMessage = 'Sie haben falsche Einmeldedaten eingegeben...';
        }

        IncorrectEntryMessage(errorMessage);
    });
}

export default signInUser