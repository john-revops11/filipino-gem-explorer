
/**
 * IMPORTANT: This file should ONLY be used in a secure server environment, 
 * not in client-side code. For security reasons, do not import this file
 * in your frontend application.
 */

import * as admin from 'firebase-admin';

// Initialize with environment variables or fallback to development credentials
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  : {
      "type": "service_account",
      "project_id": "localstopover-2373a",
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || "YOUR_PRIVATE_KEY_ID",
      "private_key": process.env.FIREBASE_PRIVATE_KEY || "YOUR_PRIVATE_KEY",
      "client_email": "firebase-adminsdk-fbsvc@localstopover-2373a.iam.gserviceaccount.com",
      "client_id": process.env.FIREBASE_CLIENT_ID || "YOUR_CLIENT_ID",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40localstopover-2373a.iam.gserviceaccount.com",
      "universe_domain": "googleapis.com"
    };

// Initialize the app if it hasn't been initialized yet
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://localstopover-2373a-default-rtdb.firebaseio.com"
  });
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export const adminDatabase = admin.database();
export const adminStorage = admin.storage();

// Admin-only operations
export const adminService = {
  // User management
  createUser: async (email: string, password: string, displayName?: string) => {
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName
    });
    return userRecord;
  },
  
  // Set custom claims for user roles
  setUserRole: async (uid: string, role: string) => {
    await adminAuth.setCustomUserClaims(uid, { role });
    return true;
  },
  
  // Delete a user
  deleteUser: async (uid: string) => {
    await adminAuth.deleteUser(uid);
    return true;
  },
  
  // List users (with pagination)
  listUsers: async (limit = 1000, pageToken?: string) => {
    const listUsersResult = await adminAuth.listUsers(limit, pageToken);
    return listUsersResult;
  },
  
  // Structured content management for app-specific entities
  destinations: {
    create: async (data: any) => {
      const ref = adminFirestore.collection('destinations').doc();
      await ref.set({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id: ref.id, ...data };
    },
    
    update: async (id: string, data: any) => {
      await adminFirestore.collection('destinations').doc(id).update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id, ...data };
    },
    
    delete: async (id: string) => {
      await adminFirestore.collection('destinations').doc(id).delete();
      return true;
    },
    
    getAll: async () => {
      const snapshot = await adminFirestore.collection('destinations').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    
    getById: async (id: string) => {
      const doc = await adminFirestore.collection('destinations').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    }
  },
  
  places: {
    // Similar CRUD operations for places
    create: async (data: any) => {
      const ref = adminFirestore.collection('places').doc();
      await ref.set({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id: ref.id, ...data };
    },
    
    // Additional methods following the same pattern...
  },
  
  tours: {
    // CRUD operations for tours
    create: async (data: any) => {
      const ref = adminFirestore.collection('tours').doc();
      await ref.set({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id: ref.id, ...data };
    },
    
    // Additional methods...
  },
  
  hiddenGems: {
    // CRUD operations for hidden gems
    create: async (data: any) => {
      const ref = adminFirestore.collection('hiddenGems').doc();
      await ref.set({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id: ref.id, ...data };
    },
    
    // Additional methods...
  }
};

// Data relationship helpers
export const dataRelationships = {
  // Get all places within a destination
  getPlacesByDestination: async (destinationId: string) => {
    const snapshot = await adminFirestore.collection('places')
      .where('destination_id', '==', destinationId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // Get all tours within a destination
  getToursByDestination: async (destinationId: string) => {
    const snapshot = await adminFirestore.collection('tours')
      .where('destination_id', '==', destinationId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // Additional relationship queries...
}
