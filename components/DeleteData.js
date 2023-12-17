import { ref, remove, getDatabase } from 'firebase/database';

//----- Erstellt mithilfe von: https://firebase.google.com/docs/database/web/read-and-write?hl=de -----//
function DeleteData(link, dataToDelete, reload) {
    const db = getDatabase();
    const dataRef = ref(db, link + dataToDelete);

    remove(dataRef)
    .then(() => {
      reload();
    })
}

export default DeleteData