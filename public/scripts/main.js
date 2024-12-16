document.addEventListener('DOMContentLoaded', async () => {
  // const urlParams = new URLSearchParams(window.location.search);
  const token = localStorage.getItem('token')
  const profileImageElements = document.querySelectorAll('.profileImage');
console.log('token',token)

  const setImageSrc = (src) => {
    profileImageElements.forEach((img) => {
      img.src = src;
    });
  };

  // if (urlParams.get('token') && !localStorage.getItem('token')) {
  // localStorage.setItem('token', urlParams.get('token'));
  //  console.log('token12341234',token)

  //   console.log('URL에서 토큰을 로컬 스토리지에 저장 완료:', urlParams.get('token'));
  // }

  if (!token) {
    setImageSrc('/path/to/default-profile.png');

    return;
  }

  try {
    const response = await fetch('/channel', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('프로필 정보를 가져오지 못했습니다.');
    }

    const profileData = await response.json();
    const profileImageUrl = profileData.profileImage || '/path/to/default-profile.png';
    setImageSrc(profileImageUrl);
  } catch (error) {
    console.error('오류:', error);
    setImageSrc('/path/to/default-profile.png');
  }
  
});

let isFetching = false; // 중복 요청 방지 플래그
let lastVideoId = null; // 마지막 데이터의 id

// 서버에서 비디오 데이터 가져오기
async function fetchVideos(lastId) {
  const url = lastId ? `video/many/${lastId}/6` : 'video/many/1/12';
  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error('데이터를 가져오지 못했습니다.');
  }

  return response.json();
}

// 비디오 데이터를 템플릿으로 생성
function createVideoElement(video) {
  if (!video || (!video.thumbnailUrl && !video.title)) {
    console.warn('유효하지 않은 비디오 데이터:', video);
    return null;
  }

  const shortFormItem = document.createElement('div');
  shortFormItem.className = 'video-card';
  console.log(shortFormItem);

  shortFormItem.addEventListener('click', () => {
    window.location.href = `/detail?videoId=${video.id}`;
  });

  if (video.thumbnailUrl) {
    const placeholderVideo = document.createElement('div');
    placeholderVideo.className = 'video-card';
    placeholderVideo.style.backgroundImage = `url('${video.thumbnailUrl}')`;
    shortFormItem.appendChild(placeholderVideo);
  }

  if (video.title) {
    const placeholderTitle = document.createElement('p');
    placeholderTitle.className = 'placeholder-title';
    placeholderTitle.textContent = video.title;
    shortFormItem.appendChild(placeholderTitle);
  }

  return shortFormItem;
}

// 비디오 데이터를 추가 렌더링
function appendVideos(container, videos) {
  videos.forEach((video) => {
    const videoElement = createVideoElement(video);
    if (videoElement) {
      $('.container').append(videoElement);
    }
  });
}

// 초기 로드 및 스크롤 처리
async function initialize() {
  const shortFormGrid = document.getElementById('videoBox');

  try {
    // 초기 데이터 로드
    const initialVideos = await fetchVideos();
    appendVideos(shortFormGrid, initialVideos);

    // 마지막 비디오 ID 저장
    if (initialVideos.length > 0) {
      lastVideoId = initialVideos[initialVideos.length - 1].id;
    }

    // 스크롤 이벤트 추가
    $(window).on('scroll', async () => {
      const scroll = $(window).scrollTop();
      const clientsScroll = $(window).height();
      const height = $(document).height();

      if (scroll + clientsScroll >= height - 10 && !isFetching) {
        isFetching = true;

        try {
          const newVideos = await fetchVideos(lastVideoId);
          if (newVideos.length > 0) {
            appendVideos(shortFormGrid, newVideos);

            // 마지막 비디오 ID 업데이트
            lastVideoId = newVideos[newVideos.length - 1].id;
          } else {
            console.log('더 이상 불러올 데이터가 없습니다.');
            $(window).off('scroll'); // 더 이상 이벤트 감지 중단
          }
        } catch (error) {
          console.error('추가 데이터를 가져오는 중 오류 발생:', error);
        } finally {
          isFetching = false;
        }
      }
    });
  } catch (error) {
    console.error('초기 데이터 로드 중 오류 발생:', error);
  }
}

// 초기 실행
initialize();

// const createNotificationButton = () => {
//   const notificationButton = document.createElement('button');
//   notificationButton.textContent = '알림';
//   notificationButton.id = 'notificationBtn';
//   notificationButton.style = `
//       position: absolute;
//       top: 70px;
//       right: 90px;
//       background-color: #fff;
//       color: #000;
//       border: none;
//       padding: 10px 20px;
//       border-radius: 5px;
//       cursor: pointer;
//       z-index: 1000;
//     `;

//   notificationButton.addEventListener('click', openNotificationPopup);

//   return notificationButton;
// };

// accountBtn.addEventListener('click', () => {
//   const token = localStorage.getItem('token');

//   if (token) {
//     let logoutBtn = document.getElementById('logoutBtn');
//     let notificationButton = document.getElementById('notificationButton');

//     if (!logoutBtn) {
//       logoutBtn = createLogoutButton();
//       logoutBtn.id = 'logoutBtn';
//       document.body.appendChild(logoutBtn);
//     }

//     if (!notificationButton) {
//       notificationButton = createNotificationButton();
//       notificationButton.id = 'notificationButton';
//       document.body.appendChild(notificationButton);
//     } else {
//       notificationButton.remove();
//       logoutBtn.remove();
//     }
//   } else {
//     window.location.href = '/';
//   }
// });
