<div align="center">
    <a href="https://www.loopfiy.com" target="_blank">
      <img src="https://github.com/user-attachments/assets/0deb6a42-0d74-4183-8464-f02852f7273c" width="90%" />
    </a>
  <h3></h3>
</div>
<div align="center">
  <p align=center>
    <a href="https://teamsparta.notion.site/Chained-Togeth-83da828a1a2e46fd9f9b81c3e8ccad9a"> Notion </a> &nbsp; ｜ &nbsp; 
    <a href=""> Figma </a> &nbsp; ｜ &nbsp;
    <a href=""> Wiki </a> &nbsp; ｜ &nbsp;
  </p>
</div>

<br/>

> ### 목차
>
> [1. 💻 데모 및 배포 링크](#-데모-및-배포-링크) <br> > [2. 🎯 기획 배경](#-기획-배경) <br> > [3. 📺 핵심 기능](#-핵심-기능) <br> > [4. ⚙️ 서비스 아키텍처](#%EF%B8%8F-서비스-아키텍처) <br> > &nbsp;&nbsp;&nbsp;&nbsp;[4.1. 업로드 과정](#-) <br> > &nbsp;&nbsp;&nbsp;&nbsp;[4.2. 배포](#-배포) <br> > [5. 📝 핵심 기술 정리](#-핵심-기술-정리) <br> > &nbsp;&nbsp;&nbsp;&nbsp;[5.1. 핵심 기술](#핵심기술) <br> > &nbsp;&nbsp;&nbsp;&nbsp;[5.2. 추후 기술적 도전](#추후-기술적-도전) <br> > [6. 🛠️ 기술 스택](#%EF%B8%8F-기술-스택) <br> > [7. 👊 팀 소개](#team-정권지르기-) <br>

<br/>

# 💻 데모 및 배포 링크

- **서비스 링크**: [https://www.loopfiy.com/](https://www.loopfiy.com/)

<br/>

# 🎯 기획 배경

**현재의 shortform콘텐츠는 shortform 이라는 이름에 걸맞지 않게 점점 길어지고 있습니다.**

**이러한 흐름 속에서 저희는 진정으로 '짧고 강렬한' 콘텐츠를 제공할 플랫폼을 만들고자 했습니다.**

**저희의 shortform플랫폼은 8초에서 최대 10초라는 짧은 시간 안에, 시청자가 온전히 집중할 수 있는 콘텐츠를 제공합니다.**

**이는 단순히 짧은 영상이 아니라, 사람들의 평균적인 집중 시간에 최적화된 콘텐츠로,**

**시청자에게 강렬하고 효과적인 경험을 전달하는 것을 목표로 프로젝트를 진행하게 되었습니다.**

<br/>

# 📺 핵심 기능

![메인화면 기능](https://github.com/user-attachments/assets/1d512ce8-81b2-43ce-9872-34565b9b7bd9)
![알림 기능](https://github.com/user-attachments/assets/30a9a88c-59a0-450b-aeb7-79ebf5888b99)
![유저 채널 기능](https://github.com/user-attachments/assets/b8f98000-9bec-4234-bffc-494e6179b5df)
![비디오 업로드 기능 (2)](https://github.com/user-attachments/assets/753a7c69-a7a4-40d5-9b90-032fa8b350ba)
![직접 촬영 기능](https://github.com/user-attachments/assets/abe2a94b-3e7f-47ac-bbb0-c629aa5222dc)
![검색 기능](https://github.com/user-attachments/assets/80e721b7-ac97-461b-88e1-0da66c997f6c)

<br/>

# ⚙️ 서비스 아키텍처

![ServerArchitecture](https://github.com/user-attachments/assets/a97966eb-d27e-4640-b87a-89b8feef6f8c)

### 🎥 업로드 과정

| **단계**                       | **설명**                                                                                                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. 영상 업로드**             | 사용자가 비디오를 업로드 합니다.                                                                                                                                     |
| **2-1. S3 영상 저장**          | API 서버는 presignURL을 생성해 클라이언트에 반환하고 생성된 **presignUrl**을 통해 영상을 S3에 전송합니다.                                                            |
| **2-2. 메타데이터 RDS 저장**   | S3에 영상을 전송 후 영상의 메타데이터를 **PostgreSQL RDS**에 저장합니다.                                                                                             |
| **3. 영상을 hls로 트랜스코딩** | S3에 영상이 저장되면 AWS LAMDA 함수가 트리거되어 **AWS MediaConvert**를 호출합니다. MediaConvert는 영상을 **HLS로 트랜스코딩하여 m3u8 파일을 다시 S3에 저장**합니다. |
| **4. RDS에 CDN URL로 저장**    | 저장된 m3u8 파일의 key 값을 이용해 **CDN URL**을 생성 후 RDS에 저장합니다.                                                                                           |
| **5. 영상 시청**               | 클라이언트가 재생 요청을 하면 RDS에 저장된 비디오 URL 정보를 통해 **CloudFront**로부터 **HLS 세그먼트**를 제공받아 실시간으로 영상을 시청할 수 있습니다.             |

<br />

<br />

### 🚀 배포

| **구성**      | **설명**                                                                               |
| ------------- | -------------------------------------------------------------------------------------- |
| **배포 도구** | **프론트엔드**와 **백엔드**는 , **Docker**, **AWS Beanstalk**를를 활용하여 배포됩니다. |

<br/>

# 📝 핵심 기술 정리

프로젝트를 진행하면서 겪은 다양한 경험과 학습 내용을 꾸준히 문서화하며 지식을 공유하고, 깊이 있는 기술적 도전을 이어나가고자 합니다.

## 핵심 기술

### [⚡ SSE를 통한 실시간 알림](https://teamsparta.notion.site/f2ee7c2e758c4c4aaa4c9a1991b0af16)

- 실시간 단방향 소통을 위해 채택
- 댓글 작성 시, 좋아요/취소 시 실시간 알림 수신 가능

### [📺 HLS 전송을 통한 영상 스트리밍](https://teamsparta.notion.site/1512dc3ef5148185ab0ec062bcd3e4b0?p=ec20cccdefb345c5b70d00e11e18c23c&pm=s)

- 적응형 비트레이트를 활용하여 네트워크 품질에 따라 자동으로 비디오 품질 조정
- 이후 라이브 기능 구현 및 영상 시간 조정(10초 이상) 시 확장성을 위해 구현

## 추후 기술적 도전

### [☕️ Nginx-Rtmp를 통한 라이브 기능 구현](https://teamsparta.notion.site/NGINX-RTMP-8711f0f116044100806fbe1ad2b1c991)

- Nginx-Rtmp와 OBS를 활용한 라이브 방송을 구현할 예정
- 방송용 서비스 컨테이너를 분리하여 구현할 예정

### [🏛️ 라이브방송 내 실시간 채팅 구현 ](https://teamsparta.notion.site/Redis-Pub-Sub-c48d3ed1255d419fb507932641cb0736)

- REIDS PUB/SUB, socket.io를 이용해 실시간 채팅창 구현 예정
- 채팅 서버 확장성 고려

### [🐬atillery를 활용한 성능 분석 및 개선 ](https://gominzip.notion.site/docker-swarm-80b228b59cf54d0e9221fc6c150e07bf?pvs=4)

#### [👉 더 많은 기술정리 보러 가기 👈](https://teamsparta.notion.site/Chained-Togeth-83da828a1a2e46fd9f9b81c3e8ccad9a)

<br/>

# 🛠️ 기술 스택

| Part              | Stack                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| VCS/패키지 매니저 | ![rounded-in-photoretrica](https://github.com/user-attachments/assets/97662e86-10d1-4386-b840-d33b0db4b8df)     |
| 백엔드            | ![rounded-in-photoretrica (2)](https://github.com/user-attachments/assets/2512b288-3cf5-4ffd-801a-5f1929ef0417) |
| 인프라/도구       | ![rounded-in-photoretrica (3)](https://github.com/user-attachments/assets/a47d1a4f-7992-4b84-8c35-18466cc506d4) |

<br/>

# TEAM Chained Together⛓️

|                                    최강현                                     |                                    송강필                                    |                                    김성록                                     |                                    문승호                                    |                                   양양소린                                    |                                    신민재                                     |
| :---------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | :---------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | :---------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
| <img width="150" src="https://avatars.githubusercontent.com/u/127270767?v=4"> | <img width="150" src="https://avatars.githubusercontent.com/u/92740959?v=4"> | <img width="150" src="https://avatars.githubusercontent.com/u/174415370?v=4"> | <img width="150" src="https://avatars.githubusercontent.com/u/53264081?v=4"> | <img width="150" src="https://avatars.githubusercontent.com/u/177493080?v=4"> | <img width="150" src="https://avatars.githubusercontent.com/u/114797773?v=4"> |
|                                    **BE**                                     |                                    **BE**                                    |                                    **BE**                                     |                                    **BE**                                    |                                    **BE**                                     |                                    **BE**                                     |
|                   [@NterChoi](https://github.com/NterChoi)                    |                 [@strongfeel](https://github.com/strongfeel)                 |                [@SungRok1231](https://github.com/SungRok1231)                 |                 [@Jacob-moon](https://github.com/Jacob-moon)                 |                 [@surinnnnnn](https://github.com/surinnnnnn)                  |                   [@New-mean](https://github.com/New-mean)                    |
