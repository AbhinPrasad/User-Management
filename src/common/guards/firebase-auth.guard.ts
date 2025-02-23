import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { msg } from '../constants/message.constants';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(msg.tokenNotFound);
    }
    const token = authHeader.split('Bearer ')[1];

    try {
      const { uid, email } = await admin.auth().verifyIdToken(token);
      request.user = { uid, email };
      return true;
    } catch (error) {
      throw new UnauthorizedException(msg.tokenInvalid);
    }
  }
}
