import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
}

export class FirebaseService {

    static initalized = false;

    constructor() {
        if (!FirebaseService.initialized) {
            firebase.initializeApp(config);
            FirebaseService.initialized = true;
        }
    }

    async getMenu(venue) {
        const snapshot = await firebase.firestore().collection(`/venues/${venue}/products`).get();
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    }

    getOrdersSnapshot(venue, callback) {
        return firebase.firestore().collection(`/venues/${venue}/orders`)
            .where('status', '==', 'new')
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot =>
                callback(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
            );
    }

    async getTables(venue) {
        const snapshot = await firebase.firestore().collection(`/venues/${venue}/tables`).get();
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    }

    async placeOrder(venue, table, orderItems) {
        const db = firebase.firestore();
        const order = [];
        Object.keys(orderItems).forEach(p => {
            order.push({
                product: db.doc(`venues/${venue}/products/${p}`),
                quantity: orderItems[p]
            })
        })
        return db.collection(`venues/${venue}/orders`).add({
            status: 'new',
            table: db.doc(`venues/${venue}/tables/${table}`),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            order
        });
    }

    async fillOrder(venue, order) {
        const db = firebase.firestore();
        return db.doc(`venues/${venue}/orders/${order}`).update({ status: "filled" })
    }
}