import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

const serviceAccount: ServiceAccount = {
  projectId: config.get<string>('FIREBASE_PROJECT_ID'),
  clientEmail: config.get<string>('FIREBASE_CLIENT_EMAIL'),
  privateKey: config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
};

export const initializeFirebaseAdmin = async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};
