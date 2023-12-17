import { Alert } from 'react-native';

function IncorrectEntryMessage(incorrectEntry) {
    Alert.alert(incorrectEntry, null, [
        {
          text: 'Nochmals versuchen',
        }    
    ]);
}

export default IncorrectEntryMessage