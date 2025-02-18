export interface ReqInfo {
  ip: string;
  userAgent: string;
  timestamp: Date;
  method: string;
  path: string;
  user: Record<string, any> | null;
}

export type ApiResponse = Promise<{
  message: string;
  [key: string]: any;
}>;
