import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { msg } from '../constants/message.constants';

export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers && req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(msg.tokenNotFound);
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      const { uid: firebaseId, email, userId, role } = decoded;
      req.user = { firebaseId, email, userId, role };
      return true;
    } catch (error) {
      throw new UnauthorizedException(msg.tokenInvalid);
    }
  }
}
