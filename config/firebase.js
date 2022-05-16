import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
// import { collection, getDocs } from 'firebase/firestore/lite';
// Firebase config
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
  databaseURL: "https://academy2-876ce-default-rtdb.europe-west1.firebasedatabase.app/"
};



// initialize firebase
initializeApp(firebaseConfig);

export const auth = getAuth();
export const database = getFirestore();