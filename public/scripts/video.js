// let globalVideoData = null;
// document.addEventListener('DOMContentLoaded', async () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const videoId = urlParams.get('id');
//   const token = localStorage.getItem('token') || null;
//   const thumbnailsContainer = document.getElementById('thumbnailsContainer'); // 컨테이너 선택

//   if (!videoId) {
//     console.error('비디오 ID가 없습니다.');
//     return;
//   }

//   try {
//     const videoResponse = await fetch(`/video/${videoId}`, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!videoResponse.ok) {
//       throw new Error('비디오를 로드하지 못했습니다.');
//     }

//     const videoData = await videoResponse.json();
//     if (videoData?.message) {
//       throw new Error(videoData.message);
//     }

//     globalVideoData = videoData;

//     // 비디오와 버튼 렌더링
//     thumbnailsContainer.innerHTML = ''; // 기존 컨텐츠 초기화

//     // 비디오 요소 생성
//     const videoElement = document.createElement('video');
//     videoElement.setAttribute('controls', true);
//     videoElement.setAttribute('autoplay', true);
//     videoElement.setAttribute('width', '800');
//     videoElement.style.borderRadius = '10px';
//     videoElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
//     videoElement.style.margin = '20px';

//     const highResolutionUrl = videoData?.resolution?.high || '/path/to/default-video.mp4';
//     const sourceElement = document.createElement('source');
//     sourceElement.setAttribute('src', highResolutionUrl);
//     sourceElement.setAttribute('type', 'video/mp4');

//     videoElement.appendChild(sourceElement);
//     console.log('비디오 소스 URL:', highResolutionUrl);

//     // 제목 생성
//     const titleElement = document.createElement('h3');
//     titleElement.textContent = videoData?.title || '제목 없음';
//     titleElement.style.textAlign = 'center';
//     titleElement.style.marginTop = '10px';

//     // 설명 생성
//     const descriptionElement = document.createElement('p');
//     descriptionElement.textContent = videoData?.description || '설명이 없습니다.';
//     descriptionElement.style.textAlign = 'center';
//     descriptionElement.style.color = '#555';

//     // 비디오 및 텍스트 추가
//     thumbnailsContainer.style.display = 'flex';
//     thumbnailsContainer.style.flexDirection = 'column';
//     thumbnailsContainer.style.alignItems = 'center';
//     thumbnailsContainer.style.padding = '20px';

//     thumbnailsContainer.appendChild(videoElement);
//     thumbnailsContainer.appendChild(titleElement);
//     thumbnailsContainer.appendChild(descriptionElement);

//     // 댓글 초기화 함수
//     const initializeComments = async () => {
//       const commentsContainer = document.createElement('div');
//       commentsContainer.id = 'commentsContainer';
//       commentsContainer.style = `
//         margin-top: 20px;
//         width: 80%;
//         padding: 20px;
//         border-radius: 10px;
//         background-color: #f9f9f9;
//         display: none; /* 초기에는 숨김 */
//       `;

//       const commentsTitle = document.createElement('h3');
//       commentsTitle.textContent = '댓글';
//       commentsTitle.style = `margin-bottom: 20px; font-size: 24px; color: #333;`;
//       commentsContainer.appendChild(commentsTitle);

//       const commentInput = document.createElement('textarea');
//       commentInput.placeholder = '댓글을 입력하세요...';
//       commentInput.style = `
//         width: 100%;
//         height: 60px;
//         margin-bottom: 10px;
//         border: 1px solid #ddd;
//         border-radius: 5px;
//         padding: 10px;
//       `;
//       commentsContainer.appendChild(commentInput);

//       const commentSubmitBtn = document.createElement('button');
//       commentSubmitBtn.textContent = '댓글 작성';
//       commentSubmitBtn.style = `
//         padding: 10px 20px;
//         background-color: #007bff;
//         color: white;
//         border: none;
//         border-radius: 5px;
//       `;
//       commentsContainer.appendChild(commentSubmitBtn);

//       const commentsList = document.createElement('div');
//       commentsList.id = 'commentsList';
//       commentsList.style = `margin-top: 20px; display: flex; flex-direction: column; gap: 10px;`;
//       commentsContainer.appendChild(commentsList);

//       thumbnailsContainer.appendChild(commentsContainer);

//       let currentPage = 1;

//       // 댓글 접기/펼치기 버튼 추가
//       const toggleCommentsButton = document.createElement('button');

//       toggleCommentsButton.style = toggleCommentsButton.innerHTML = `
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="50" height="50"> <!-- 크기 수정 -->
//     <path d="M12 2C6.48 2 2 5.58 2 10c0 2.58 1.52 4.88 4.01 6.5-.21 1.35-.91 3.01-1.7 4.07-.33.44.01 1.06.56.93 1.9-.45 4.42-1.24 6.13-2.26.99.2 2.03.26 3 .26 5.52 0 10-3.58 10-8s-4.48-8-10-8zm0 14c-.86 0-1.69-.11-2.5-.32l-.61-.16-.53.31c-1.18.69-2.68 1.24-4.11 1.61.28-.42.54-.9.74-1.37l.38-.9-.84-.54C3.91 13.6 3 11.84 3 10c0-3.72 4.03-7 9-7s9 3.28 9 7-4.03 7-9 7z"></path>
//   </svg>
// `;
//       toggleCommentsButton.style = `
// display: flex;
// align-items: center;
// justify-content: center;
// padding: 10px;
// background-color: #333; /* 버튼 배경 */
// border: none;
// border-radius: 50%; /* 원형 버튼 */
// width: 75px; /* 버튼 크기 */
// height: 75px; /* 버튼 크기 */
// cursor: pointer;
// position: relative;
// `;
//       toggleCommentsButton.addEventListener('click', () => {
//         if (commentsContainer.style.display === 'none') {
//           commentsContainer.style.display = 'block';
//         } else {
//           commentsContainer.style.display = 'none';
//         }
//       });

//       thumbnailsContainer.appendChild(toggleCommentsButton);

//       const loadComments = async (page = 1) => {
//         try {
//           const response = await fetch(`/videos/${videoId}/comments?page=${page}`, {
//             method: 'GET',
//           });

//           if (!response.ok) {
//             throw new Error('댓글을 불러오는 데 실패했습니다.');
//           }

//           const { data: comments } = await response.json();
//           if (page === 1) commentsList.innerHTML = ''; // 첫 페이지 로드 시 초기화
//           comments.forEach((comment) => renderComment(comment));
//         } catch (error) {
//           console.error('댓글 로드 오류:', error);
//         }
//       };

//       const renderComment = (comment) => {
//         const commentElement = document.createElement('div');
//         commentElement.style = `
//         padding: 10px;
//         background-color: #333; /* 어두운 배경 */
//         color: #fff; /* 글씨는 하얀색 */
//         border: 1px solid #ddd;
//         border-radius: 5px;
//         margin-bottom: 10px;
//         `;
//         commentElement.innerHTML = `
//           <p><strong>${comment.userId}</strong></p>
//           <p>${comment.content}</p>
//           <small>${new Date(comment.createdAt).toLocaleString()}</small>
//         `;

//         // 수정 버튼
//         // 수정 버튼
//         const editBtn = document.createElement('button');
//         editBtn.textContent = '수정';
//         editBtn.style = `margin-left: 10px;`;
//         editBtn.addEventListener('click', async () => {
//           const newContent = prompt('댓글을 수정하세요:', comment.content);
//           if (newContent) {
//             try {
//               const response = await fetch(`/videos/${videoId}/comments/${comment.id}`, {
//                 method: 'PUT',
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ content: newContent }),
//               });

//               if (!response.ok) {
//                 if (response.status === 403 || response.status === 404) {
//                   alert('권한이 없거나 댓글이 존재하지 않습니다.');
//                 } else {
//                   throw new Error('댓글 수정 실패');
//                 }
//               } else {
//                 alert('댓글이 성공적으로 수정되었습니다.');
//                 await loadComments();
//               }
//             } catch (error) {
//               console.error('댓글 수정 오류:', error);
//               alert('댓글 수정 중 오류가 발생했습니다.');
//             }
//           }
//         });

//         // 삭제 버튼
//         const deleteBtn = document.createElement('button');
//         deleteBtn.textContent = '삭제';
//         deleteBtn.style = `margin-left: 10px;`;
//         deleteBtn.addEventListener('click', async () => {
//           if (confirm('댓글을 삭제하시겠습니까?')) {
//             try {
//               const response = await fetch(`/videos/${videoId}/comments/${comment.id}`, {
//                 method: 'DELETE',
//                 headers: { Authorization: `Bearer ${token}` },
//               });

//               if (!response.ok) {
//                 if (response.status === 403 || response.status === 404) {
//                   alert('권한이 없거나 댓글이 존재하지 않습니다.');
//                 } else {
//                   throw new Error('댓글 삭제 실패');
//                 }
//               } else {
//                 alert('댓글이 성공적으로 삭제되었습니다.');
//                 await loadComments();
//               }
//             } catch (error) {
//               console.error('댓글 삭제 오류:', error);
//               alert('댓글 삭제 중 오류가 발생했습니다.');
//             }
//           }
//         });

//         commentElement.appendChild(editBtn);
//         commentElement.appendChild(deleteBtn);

//         // 대댓글 추가 필드
//         const replyInput = document.createElement('textarea');
//         replyInput.placeholder = '답글을 입력하세요...';
//         replyInput.style = `
//           width: 90%;
//           height: 40px;
//           margin-top: 10px;
//           padding: 10px;
//           border: 1px solid #ddd;
//           border-radius: 5px;
//         `;
//         commentElement.appendChild(replyInput);

//         const replySubmitBtn = document.createElement('button');
//         replySubmitBtn.textContent = '답글 작성';
//         replySubmitBtn.style = `margin-top: 5px;`;
//         replySubmitBtn.addEventListener('click', async () => {
//           const replyContent = replyInput.value.trim();
//           if (!replyContent) {
//             alert('답글을 입력하세요.');
//             return;
//           }

//           try {
//             await fetch(`/videos/${videoId}/comments/${comment.id}`, {
//               method: 'POST',
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ content: replyContent }),
//             });

//             replyInput.value = ''; // 입력 초기화
//             await loadComments();
//           } catch (error) {
//             console.error('답글 작성 오류:', error);
//           }
//         });

//         commentElement.appendChild(replySubmitBtn);

//         // 대댓글 보기/숨기기
//         const repliesContainer = document.createElement('div');
//         repliesContainer.style = `
//          margin-left: 20px;
//          margin-top: 10px;
//          display: none; /* 초기에는 숨김 */
//          padding: 10px; /* 내부 여백 */
//          background-color: #444; /* 어두운 배경 */
//          border: 1px solid #555; /* 테두리 */
//          border-radius: 5px; /* 둥근 모서리 */
//          color: #fff; /* 텍스트 색상 */
//          `;

//         const viewRepliesButton = document.createElement('button');
//         viewRepliesButton.textContent = '대댓글 보기';
//         viewRepliesButton.style = `margin-top: 5px;`;
//         viewRepliesButton.addEventListener('click', async () => {
//           if (repliesContainer.style.display === 'none') {
//             try {
//               const response = await fetch(`/videos/${videoId}/comments/${comment.id}`);
//               const replies = await response.json();
//               repliesContainer.innerHTML = ''; // 초기화
//               replies.forEach((reply) => renderReply(reply, repliesContainer));
//               repliesContainer.style.display = 'block';
//               viewRepliesButton.textContent = '대댓글 숨기기';
//             } catch (error) {
//               console.error('대댓글 로드 오류:', error);
//             }
//           } else {
//             repliesContainer.style.display = 'none';
//             viewRepliesButton.textContent = '대댓글 보기';
//           }
//         });

//         commentElement.appendChild(viewRepliesButton);
//         commentElement.appendChild(repliesContainer);

//         commentsList.appendChild(commentElement);
//       };

//       const renderReply = (reply, container) => {
//         const replyElement = document.createElement('div');
//         replyElement.style = `
//     padding: 10px;
//     margin-bottom: 5px;
//     background-color: #555; /* 대댓글 배경 */
//     border: 1px solid #666; /* 대댓글 테두리 */
//     border-radius: 5px; /* 둥근 모서리 */
//     color: #fff; /* 글씨 색상 */
//     font-size: 14px;
//   `;

//         replyElement.innerHTML = `
//     <p style="margin: 0;"><strong>${reply.userId}</strong></p>
//     <p style="margin: 5px 0;">${reply.content}</p>
//     <small style="color: #aaa;">${new Date(reply.createdAt).toLocaleString()}</small>
//   `;

//         // 대댓글 수정 버튼
//         const editReplyBtn = document.createElement('button');
//         editReplyBtn.textContent = '수정';
//         editReplyBtn.style = `margin-left: 10px;`;
//         editReplyBtn.addEventListener('click', async () => {
//           const newContent = prompt('대댓글을 수정하세요:', reply.content);
//           if (newContent) {
//             try {
//               const response = await fetch(`/videos/${videoId}/comments/${reply.id}`, {
//                 method: 'PUT',
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ content: newContent }),
//               });

//               if (!response.ok) {
//                 if (response.status === 403 || response.status === 404) {
//                   alert('권한이 없거나 대댓글이 존재하지 않습니다.');
//                 } else {
//                   throw new Error('대댓글 수정 실패');
//                 }
//               } else {
//                 alert('대댓글이 성공적으로 수정되었습니다.');
//                 await loadComments();
//               }
//             } catch (error) {
//               console.error('대댓글 수정 오류:', error);
//               alert('대댓글 수정 중 오류가 발생했습니다.');
//             }
//           }
//         });

//         // 대댓글 삭제 버튼
//         const deleteReplyBtn = document.createElement('button');
//         deleteReplyBtn.textContent = '삭제';
//         deleteReplyBtn.style = `margin-left: 10px;`;
//         deleteReplyBtn.addEventListener('click', async () => {
//           if (confirm('대댓글을 삭제하시겠습니까?')) {
//             try {
//               const response = await fetch(`/videos/${videoId}/comments/${reply.id}`, {
//                 method: 'DELETE',
//                 headers: { Authorization: `Bearer ${token}` },
//               });

//               if (!response.ok) {
//                 if (response.status === 403 || response.status === 404) {
//                   alert('권한이 없거나 대댓글이 존재하지 않습니다.');
//                 } else {
//                   throw new Error('대댓글 삭제 실패');
//                 }
//               } else {
//                 alert('대댓글이 성공적으로 삭제되었습니다.');
//                 await loadComments();
//               }
//             } catch (error) {
//               console.error('대댓글 삭제 오류:', error);
//               alert('대댓글 삭제 중 오류가 발생했습니다.');
//             }
//           }
//         });

//         replyElement.appendChild(editReplyBtn);
//         replyElement.appendChild(deleteReplyBtn);

//         container.appendChild(replyElement);
//       };

//       commentSubmitBtn.addEventListener('click', async () => {
//         const content = commentInput.value.trim();
//         if (!content) return alert('댓글을 입력하세요.');

//         try {
//           await fetch(`/videos/${videoId}/comments`, {
//             method: 'POST',
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ content }),
//           });
//           commentInput.value = ''; // 입력 초기화
//           await loadComments();
//         } catch (error) {
//           console.error('댓글 작성 오류:', error);
//         }
//       });

//       await loadComments(currentPage);
//     };

//     await initializeComments();
//     // 좋아요 버튼 생성
//     const likeContainer = document.createElement('div');
//     likeContainer.style.display = 'flex';
//     likeContainer.style.flexDirection = 'column';
//     likeContainer.style.alignItems = 'center';
//     likeContainer.style.marginTop = '20px';

//     likeContainer.style = `
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 10px; /* 번개와 숫자 사이 간격 */
//   border: 2px solid blue; /* 전체 테두리 */
//   border-radius: 10px; /* 모서리 둥글게 */
//   padding: 10px; /* 내부 여백 */
//   background-color: white; /* 테두리 배경 */
// `;

//     // 번개 버튼 생성
//     const likeBtn = document.createElement('button');
//     likeBtn.id = 'likeBtn';
//     likeBtn.innerHTML = `
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="yellow" width="50" height="50">
//     <path
//       d="M13 2L3 14h6v8l8-12h-6l4-8z"
//       stroke="blue"
//       stroke-width="1" /* 테두리를 얇게 설정 */
//       fill="yellow"
//     />
//   </svg>
// `;
//     likeBtn.style = `
//   background: none; /* 배경 제거 */
//   border: none; /* 테두리 제거 */
//   cursor: pointer;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 0;
// `;

//     // 좋아요 수 표시
//     const likeCount = document.createElement('span');
//     likeCount.id = 'likeCount';
//     likeCount.textContent = '0'; // 초기 좋아요 수
//     likeCount.style = `
//   font-size: 24px; /* 숫자 폰트 크기 */
//   font-weight: bold;
//   color: black; /* 숫자 색상 */
// `;

//     likeContainer.appendChild(likeBtn);
//     likeContainer.appendChild(likeCount);
//     thumbnailsContainer.appendChild(likeContainer);

//     // 좋아요 수 업데이트 함수
//     const updateLikeCount = async () => {
//       try {
//         const response = await fetch(`/likes/${videoId}`);
//         if (!response.ok) {
//           throw new Error('좋아요 수를 가져오는 데 실패했습니다.');
//         }

//         const count = await response.json();
//         likeCount.textContent = count;
//       } catch (error) {
//         console.error('좋아요 수 오류:', error);
//       }
//     };

//     // 좋아요 버튼 클릭 이벤트
//     likeBtn.addEventListener('click', async () => {
//       try {
//         const response = await fetch(`/likes/${videoId}`, {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('좋아요 상태를 변경하는 데 실패했습니다.');
//         }

//         await updateLikeCount();
//       } catch (error) {
//         alert(`좋아요 오류: ${error.message}`);
//       }
//     });

//     // 초기 좋아요 수 업데이트
//     await updateLikeCount();

//     // 링크 공유 버튼 생성 조건
//     if (videoData?.visibility !== 'private') {
//       let linkBtn = document.getElementById('linkBtn');
//       if (!linkBtn) {
//         linkBtn = document.createElement('button');
//         linkBtn.id = 'linkBtn';
//         linkBtn.textContent = '링크 공유';
//         linkBtn.style = `
//           padding: 10px 20px;
//           background-color: #007bff;
//           color: white;
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//         `;

//         // 버튼 클릭 이벤트
//         linkBtn.addEventListener('click', async () => {
//           try {
//             const response = await fetch(`/video/link/${videoId}`, {
//               method: 'GET',
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             });

//             if (!response.ok) {
//               throw new Error('링크를 가져오는데 실패했습니다.');
//             }

//             const { url } = await response.json();
//             await navigator.clipboard.writeText(url);
//             alert('링크가 클립보드에 복사되었습니다!');
//           } catch (error) {
//             alert(`오류 발생: ${error.message}`);
//           }
//         });

//         // 버튼 추가
//         thumbnailsContainer.appendChild(linkBtn);
//       }
//     }
//   } catch (error) {
//     console.error('오류:', error);
//     thumbnailsContainer.innerHTML = `<p>${error.message}</p>`;
//   }
// });
let globalVideoData = null;

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('id');
  const token = localStorage.getItem('token') || null;
  const thumbnailsContainer = document.getElementById('thumbnailsContainer');
  const video = document.getElementById('videoPlayer');

  if (!videoId) {
    console.error('비디오 ID가 없습니다.');
    thumbnailsContainer.innerHTML = `<p>비디오 ID가 없습니다.</p>`;
    return;
  }

  try {
    // 비디오 데이터 가져오기
    const response = await fetch(`/video/${videoId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('비디오를 로드하지 못했습니다.');
    }

    const videoData = await response.json();
    if (videoData?.message) {
      throw new Error(videoData.message);
    }

    globalVideoData = videoData;

    // HLS.js를 사용해 비디오 재생
    const hlsUrl = videoData?.resolution.videoUrl;
    console.log('HLS URL:', hlsUrl);

    if (Hls.isSupported()) {
      // HLS.js 사용
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video); // 기존 video 요소에 연결
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded. Starting playback...');
        video.play();
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js Error:', data);
        const errorMsg = document.createElement('div');
        errorMsg.textContent = `HLS.js Error: ${data.details}`;
        errorMsg.style.color = 'red';
        thumbnailsContainer.appendChild(errorMsg);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari와 같은 네이티브 HLS 지원 브라우저에서 바로 재생
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        console.log('Native HLS support detected. Starting playback...');
        video.play();
      });
    } else {
      console.error('HLS.js는 이 브라우저에서 지원되지 않습니다.');
      const errorMsg = document.createElement('div');
      errorMsg.textContent = 'HLS.js는 이 브라우저에서 지원되지 않습니다.';
      errorMsg.style.color = 'red';
      thumbnailsContainer.appendChild(errorMsg);
    }

    // 제목과 설명 표시
    const titleElement = document.createElement('h3');
    titleElement.textContent = videoData?.title || '제목 없음';
    titleElement.style.textAlign = 'center';
    titleElement.style.marginTop = '10px';

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = videoData?.description || '설명이 없습니다.';
    descriptionElement.style.textAlign = 'center';
    descriptionElement.style.color = '#555';

    thumbnailsContainer.style.display = 'flex';
    thumbnailsContainer.style.flexDirection = 'column';
    thumbnailsContainer.style.alignItems = 'center';
    thumbnailsContainer.style.padding = '20px';

    thumbnailsContainer.innerHTML = ''; // 기존 콘텐츠 초기화
    thumbnailsContainer.appendChild(titleElement);
    thumbnailsContainer.appendChild(descriptionElement);

    // 좋아요 버튼 생성
    const likeContainer = document.createElement('div');
    likeContainer.style = `
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 2px solid blue;
          border-radius: 10px;
          padding: 10px;
          background-color: white;
        `;

    const likeBtn = document.createElement('button');
    likeBtn.id = 'likeBtn';
    likeBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="yellow" width="50" height="50">
            <path d="M13 2L3 14h6v8l8-12h-6l4-8z" stroke="blue" stroke-width="1" fill="yellow"/>
          </svg>
        `;
    likeBtn.style = `
          background: none;
          border: none;
          cursor: pointer;
        `;

    const likeCount = document.createElement('span');
    likeCount.id = 'likeCount';
    likeCount.textContent = '0';
    likeCount.style = `
          font-size: 24px;
          font-weight: bold;
          color: black;
        `;

    likeContainer.appendChild(likeBtn);
    likeContainer.appendChild(likeCount);
    thumbnailsContainer.appendChild(likeContainer);

    const updateLikeCount = async () => {
      try {
        const response = await fetch(`/likes/${videoId}`);
        if (!response.ok) throw new Error('좋아요 수를 가져오는 데 실패했습니다.');
        const count = await response.json();
        likeCount.textContent = count;
      } catch (error) {
        console.error('좋아요 수 오류:', error);
      }
    };

    likeBtn.addEventListener('click', async () => {
      try {
        const response = await fetch(`/likes/${videoId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('좋아요 상태를 변경하는 데 실패했습니다.');
        await updateLikeCount();
      } catch (error) {
        alert(`좋아요 오류: ${error.message}`);
      }
    });

    await updateLikeCount();

    // 댓글 섹션 초기화
    const initializeComments = async () => {
      const commentsContainer = document.createElement('div');
      commentsContainer.id = 'commentsContainer';
      commentsContainer.style = `
            margin-top: 20px;
            width: 80%;
            padding: 20px;
            border-radius: 10px;
            background-color: #f9f9f9;
          `;
      thumbnailsContainer.appendChild(commentsContainer);

      const loadComments = async (page = 1) => {
        try {
          const response = await fetch(`/videos/${videoId}/comments?page=${page}`);
          if (!response.ok) throw new Error('댓글을 불러오는 데 실패했습니다.');
          const { data: comments } = await response.json();
          commentsContainer.innerHTML = '';
          comments.forEach((comment) => {
            const commentElement = document.createElement('div');
            commentElement.textContent = `${comment.userId}: ${comment.content}`;
            commentsContainer.appendChild(commentElement);
          });
        } catch (error) {
          console.error('댓글 로드 오류:', error);
        }
      };

      await loadComments();
    };

    await initializeComments();
  } catch (error) {
    console.error('오류:', error);
    thumbnailsContainer.innerHTML = `<p>${error.message}</p>`;
  }
});
