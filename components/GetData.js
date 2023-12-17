import { database } from '../firebaseConfig.js';
import { ref, onValue } from 'firebase/database';

//----- Erstellt mithilfe von: https://firebase.google.com/docs/database/web/read-and-write?hl=de -----//
function GetData(link, setData) {
    const databaseRef = ref(database, link);
    const unsubscribe = onValue(databaseRef, (snapshot) => {
      const fetchData = snapshot.val();
      setData(fetchData);
    }, {
      onlyOnce: false
    });

    return () => unsubscribe();
}

export default GetData