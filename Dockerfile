FROM node:22-alpine
# 작업 디렉토리 설정
WORKDIR /

WORKDIR /

COPY . .

# 컨테이너 실행 명령어 설정
CMD ["npm", "start"]