
/**
 * IMPORTANT: This file should ONLY be used in a secure server environment, 
 * not in client-side code. For security reasons, do not import this file
 * in your frontend application.
 */

import * as admin from 'firebase-admin';

// For production use, you should use environment variables
// instead of hardcoding the credentials
const serviceAccount = {
  "type": "service_account",
  "project_id": "localstopover-2373a",
  "private_key_id": "YOUR_PRIVATE_KEY_ID", // Replace with actual private key ID
  "private_key": "YOUR_PRIVATE_KEY", // Replace with actual private key
  "client_email": "firebase-adminsdk-fbsvc@localstopover-2373a.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID", // Replace with actual client ID
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
    databaseURL: "https://localstopover-2373a-default-rtdb.firebaseio.com"
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
  }
};
