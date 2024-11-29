import 'express-session';

declare module 'express-session' {
  interface SessionData {
    code: string; // 저장할 데이터의 타입 정의
  }
}
