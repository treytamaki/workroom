import * as firebase from 'firebase'

import {FirebaseConfig} from '../config/keys';
firebase.initializeApp(FirebaseConfig)

const storage = firebase.storage();
const databaseRef = firebase.database().ref();

export {
    storage, databaseRef,
}