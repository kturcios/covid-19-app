import firebase from 'firebase/app';
import 'firebase/firestore';
import { decode, encode } from 'base-64';

import firebaseConfig from './firebase-config';

// We need to set up base-64 because of current defect on Firebase JS SDK
// https://stackoverflow.com/questions/60361519/cant-find-a-variable-atob
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

// Initialize Firebase app
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

export {
  app,
  db,
};
