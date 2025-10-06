// js/model.js (updated)

import { auth, db, doc, setDoc, getDoc, collection, getDocs } from './firebase.js';

export const TimeboxModel = {
  formatDate(date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  },

  async save(date, data) {
    const key = this.formatDate(date);
    localStorage.setItem(`dailyTimeboxData_${key}`, JSON.stringify(data));
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'timeboxes', user.uid, 'days', key), data);
      } catch (err) {
        console.error('Firestore save error:', err);
      }
    }
  },

  async load(date) {
    const key = this.formatDate(date);
    const user = auth.currentUser;
    let data = {};
    if (user) {
      try {
        const docRef = doc(db, 'timeboxes', user.uid, 'days', key);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          data = snap.data();
          localStorage.setItem(`dailyTimeboxData_${key}`, JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.warn('Firestore load failed, falling back to local cache');
      }
    }
    return JSON.parse(localStorage.getItem(`dailyTimeboxData_${key}`)) || {};
  },

  async loadAllFirestoreData() {
    const user = auth.currentUser;
    if (!user) return {}; // No user, nothing to load from cloud

    const allData = {};
    try {
      const daysCollectionRef = collection(db, 'timeboxes', user.uid, 'days');
      const querySnapshot = await getDocs(daysCollectionRef);
      
      querySnapshot.forEach(doc => {
        const dateKey = doc.id;
        const dayData = doc.data();
        allData[dateKey] = dayData;
        // Update local storage to keep the cache in sync
        localStorage.setItem(`dailyTimeboxData_${dateKey}`, JSON.stringify(dayData));
      });
      
      return allData;

    } catch (err) {
      console.error("Failed to fetch all data from Firestore:", err);
      // Fallback to local data if firestore fails
      return this.loadAllLocalData(); 
    }
  }
};