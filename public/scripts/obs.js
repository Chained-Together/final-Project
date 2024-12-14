// import { OBSWebSocket } from 'obs-websocket-js';
// const obs = new OBSWebSocket();
// obs
//   .connect({
//     address: '192.168.219.107:3000',
//     password: 'sardwzLYbmX4OY2S',
//   })
//   .then(() => {
//     console.log(`Success! We're connected & authenticated.`);

//     return obs.send('GetSceneList');
//   })
//   .then((data) => {
//     console.log(`${data.scenes.length} Available Scenes!`);

//     data.scenes.forEach((scene) => {
//       if (scene.name !== data.currentScene) {
//         console.log(`Found a different scene! Switching to Scene: ${scene.name}`);

//         obs.send('SetCurrentScene', {
//           'scene-name': scene.name,
//         });
//       }
//     });
//   })
//   .catch((err) => {
//     // Promise convention dicates you have a catch on every chain.
//     console.log(err);
//   });

// obs.on('SwitchScenes', (data) => {
//   console.log(`New Active Scene: ${data.sceneName}`);
// });

// // You must add this handler to avoid uncaught exceptions.
// obs.on('error', (err) => {
//   console.error('socket error:', err);
// });
// const OBSWebSocket = require('obs-websocket-js');
// const obs = new OBSWebSocket();

// async function connectOBS() {
//   try {
//     // WebSocket 연결 시도
//     await obs.connect({
//       address: 'ws://localhost:4460', // OBS WebSocket 주소
//       password: 'xcbXDnj2L69k8J13', // OBS WebSocket 비밀번호
//     });

//     console.log('Connected to OBS WebSocket.');

//     // 추가 이벤트 핸들링
//     obs.on('ConnectionClosed', () => {
//       console.warn('Connection closed. Retrying in 5 seconds...');
//       setTimeout(connectOBS, 5000); // 5초 후 재연결 시도
//     });
//   } catch (err) {
//     // 연결 실패 에러 처리
//     console.error('Failed to connect to OBS WebSocket:', err);

//     if (err.code === 1006) {
//       console.log('WebSocket connection unexpectedly closed. Retrying in 5 seconds...');
//       setTimeout(connectOBS, 5000); // 5초 후 재연결 시도
//     } else {
//       console.log('Please check OBS WebSocket settings or server status.');
//     }
//   }
// }

// // OBS WebSocket 연결 시작
// connectOBS();
