import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  import { msg } from '../constants/message.constants';
  
  @Catch()
  export class ErrorFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
    catch(exception: unknown, host: ArgumentsHost): void {
      const { httpAdapter } = this.httpAdapterHost;
      const ctx = host.switchToHttp();
  
      let statusCode: number;
      let message: string;
  
      if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
        const response = exception.getResponse();
  
        if (typeof response === 'string') {
          message = response;
        } else {
          const responseMessage = (response as any).message;
          message = Array.isArray(responseMessage)
            ? responseMessage[0]
            : responseMessage || msg.somethingWentWrong;
        }
      } else if (exception instanceof Error) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = exception.message;
      } else {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = msg.somethingWentWrong;
      }
  
      const responseBody = {
        success: false,
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
  
      httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
    }
  }
  