FROM node:22-alpine
# 작업 디렉토리 설정
WORKDIR /

# 필요한 패키지 설치
RUN apk add --no-cache bash

# 소스 코드 복사
COPY . .

# 컨테이너 실행 명령어 설정
CMD ["npm", "start"]