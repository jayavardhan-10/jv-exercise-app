import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

class LocalStorageDB {
  constructor() {
    this.storage = window.localStorage;
    this.collections = {};
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = {
        async add(data) {
          const id = Date.now().toString();
          const collection = JSON.parse(localStorage.getItem(name) || '[]');
          const newDoc = { id, ...data };
          collection.push(newDoc);
          localStorage.setItem(name, JSON.stringify(collection));
          return { id };
        },
        async get() {
          const collection = JSON.parse(localStorage.getItem(name) || '[]');
          return {
            docs: collection.map(doc => ({
              id: doc.id,
              data: () => ({ ...doc })
            }))
          };
        },
        where() {
          return this;
        },
        async delete(id) {
          const collection = JSON.parse(localStorage.getItem(name) || '[]');
          const filtered = collection.filter(doc => doc.id !== id);
          localStorage.setItem(name, JSON.stringify(filtered));
        }
      };
    }
    return this.collections[name];
  }
}

let app, auth, db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Using localStorage fallback for development');
  db = new LocalStorageDB();
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      const user = JSON.parse(localStorage.getItem('auth_user') || 'null');
      callback(user);
      return () => {};
    }
  };
}

export { auth, db };
export default app; 