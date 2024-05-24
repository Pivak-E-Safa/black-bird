import * as firebase from 'firebase';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEzExqLXRmCKDlqjQyK_aDUrusqb2L-xo",
  authDomain: "love-bites---backend.firebaseapp.com",
  projectId: "love-bites---backend",
  storageBucket: "love-bites---backend.appspot.com",
  messagingSenderId: "813067525412",
  appId: "1:813067525412:web:cc13dcafee95e7979027b1",
  measurementId: "G-BWNKRKGQW4"
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth(app);
const firestore = firebase.firestore(app);

export { auth, firestore };
