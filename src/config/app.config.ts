import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
}));
