async function playVideo(videoId) {
  const token = localStorage.getItem('token') || null;
  const video = document.getElementById('videoPlayer');
  const thumbnailsContainer = document.getElementById('thumbnailsContainer');
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
  console.log('videoData', videoData);

  // DOM 요소 가져오기
  const titleElement = document.querySelector('.title-box h3');
  const contentElement = document.querySelector('.title-box span');
  const hashtagElement = document.querySelector('.tag-box');
  const backgroundImg = document.getElementById('background-img');

  backgroundImg.src = videoData.foundVideo.thumbnailUrl;

  // 데이터에서 제목과 설명 추출
  const { foundVideo } = videoData;

  // 제목과 내용 업데이트
  if (titleElement && foundVideo.title) {
    titleElement.textContent = foundVideo.title;
  } else {
    console.error('Title element or video title is missing');
  }

  if (contentElement && foundVideo.description) {
    contentElement.textContent = foundVideo.description;
  } else {
    console.error('Content element or video description is missing');
  }

  if (hashtagElement && foundVideo.hashtags) {
    hashtagElement.innerHTML = '';
    foundVideo.hashtags.forEach((hashtag) => {
      const span = document.createElement('span');
      span.textContent = `#${hashtag}`;
      span.style.marginRight = '8px';
      hashtagElement.appendChild(span);
    });
  } else {
    console.error('Hashtag element or hashtags array is missing');
  }

  // HLS.js를 사용해 비디오 재생
  const hlsUrl = videoData?.videoUrl;
  if (!hlsUrl) {
    throw new Error('비디오 URL이 없습니다.');
  }

  if (Hls.isSupported()) {
    // HLS.js 사용
    const hls = new Hls();
    hls.loadSource(hlsUrl);
    hls.attachMedia(video); // 기존 video 요소에 연결
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play(); // 비디오가 준비되면 자동 재생
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
    video.autoplay = true; // autoplay 속성 추가
    video.controls = true; // 사용자 컨트롤 제공
    video.addEventListener('loadedmetadata', () => {
      video.play(); // 비디오가 준비되면 자동 재생
    });
  } else {
    console.error('HLS.js는 이 브라우저에서 지원되지 않습니다.');
    const errorMsg = document.createElement('div');
    errorMsg.textContent = 'HLS.js는 이 브라우저에서 지원되지 않습니다.';
    errorMsg.style.color = 'red';
    thumbnailsContainer.appendChild(errorMsg);
  }

  //채널 정보 가져오기
  const profileImageElement = document.getElementById('profileBtn');
  const channelResponse = await fetch(`/channel/video/${foundVideo.id}`, {
    method: 'GET',
  });

  

  if (!channelResponse.ok) {
    throw new Error('채널 정보를 로드하지 못했습니다.');
  }

  const channelData = await channelResponse.json();
  profileImageElement.src = channelData.profileImage || '/path/to/default-profile.png';

  const profileBtn = document.getElementById('profileBtn');
  profileBtn.addEventListener('click', async () => {
    window.location.href = `/getChannel/${channelData.id}`;
  });
  document.getElementById('channel-name').innerHTML = channelData.name
}

// 좋아요 버튼과 카운트 표시 영역 가져오기
const likeBtn = document.getElementById('detail-like-btn');
const likeCount = document.getElementById('like-count');

// URL에서 videoId 추출
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('videoId');

playVideo(videoId);

// 초기 좋아요 수를 가져와 업데이트
const updateLikeCount = async () => {
  try {
    const response = await fetch(`/likes/${videoId}`);
    if (!response.ok) throw new Error('좋아요 수를 가져오는 데 실패했습니다.');

    const data = await response.json();
    likeCount.textContent = data; // 서버 응답에 맞게 좋아요 수 업데이트
  } catch (error) {
    console.error('좋아요 수 오류:', error);
    likeCount.textContent = '오류';
  }
};

// 좋아요 상태 변경
const toggleLike = async () => {
  try {
    // 로컬스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token');
    if (!token) throw new Error('토큰이 존재하지 않습니다.');

    const response = await fetch(`/likes/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // 토큰 추가
      },
    });

    if (!response.ok) throw new Error('좋아요 상태를 변경하는 데 실패했습니다.');

    // 좋아요 상태 변경 후 다시 좋아요 수를 업데이트
    await updateLikeCount();
  } catch (error) {
    alert(`좋아요 오류: ${error.message}`);
  }
};

// 좋아요 버튼 클릭 이벤트
likeBtn.addEventListener('click', toggleLike);

// 초기화: 좋아요 수 업데이트
if (videoId) {
  updateLikeCount();
} else {
  console.error('URL에 videoId 파라미터가 없습니다.');
}

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const videoId = new URLSearchParams(window.location.search).get('videoId');
  const commentBox = document.querySelector('.comment-box');
  const commentInput = document.querySelector('.comment-input');
  const commentSubmit = document.querySelector('.comment-submit');
  const commentsList = document.querySelector('.comments-list');

  // 댓글 로드
  async function loadComments() {
    try {
      const response = await fetch(`/videos/${videoId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('댓글을 불러오는데 실패했습니다.');

      const { data: comments } = await response.json();
      console.log('로드된 댓글:', comments);

      commentsList.innerHTML = '';
      comments.forEach((comment) => {
        const commentElement = renderComment(comment);
        commentsList.appendChild(commentElement);
      });
    } catch (error) {
      console.error('댓글 로드 실패:', error);
    }
  }

  // 댓글 작성
  async function createComment(content) {
    try {
      const response = await fetch(`/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다.');
      }

      // 댓글 작성 후 즉시 댓글 목록 새로고침
      await loadComments();
      commentInput.value = '';
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  }

  // 답글 작성
  async function createReply(commentId, content) {
    try {
      console.log(`/videos/${videoId}/comments/${commentId}`);
      const response = await fetch(`/videos/${videoId}/comments/${commentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error('답글 작성에 실패');
      }

      const result = await response.json();
      await loadComments();
    } catch (error) {
      console.error('답글 작성 실패:', error);
      alert('답글 작성에 실패했습니다.');
    }
  }

  // 댓글 렌더링
  function renderComment(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment-item';

    // 현재 로그인한 사용자의 ID 가져오기
    const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    commentElement.innerHTML = `
    <div class="comment-header">
      <span class="comment-author">${comment.nickname || '사용자'}</span>
      <span class="comment-date">${new Date(comment.createdAt).toLocaleString()}</span>
    </div>
    <div class="comment-content" id="content-${comment.id}">${comment.content}</div>
    <div class="comment-actions">
      <button class="action-button reply-btn">답글</button>
      ${
        currentUserId === comment.userId
          ? `
        <button class="action-button edit-btn" data-comment-id="${comment.id}">수정</button>
        <button class="action-button delete-btn" data-comment-id="${comment.id}">삭제</button>
      `
          : ''
      }
    </div>
    <div class="edit-form" style="display: none;">
      <textarea class="edit-input">${comment.content}</textarea>
      <button class="edit-submit">수정하기</button>
      <button class="edit-cancel">취소</button>
    </div>
    <div class="reply-form" style="display: none;">
      <textarea class="reply-input comment-input" placeholder="답글을 입력하세요..."></textarea>
      <button class="reply-submit comment-submit">답글 작성</button>
    </div>
    <div class="replies-container"></div>
  `;

    // 수정 버튼 이벤트
    const editBtn = commentElement.querySelector('.edit-btn');
    const editForm = commentElement.querySelector('.edit-form');
    const editInput = commentElement.querySelector('.edit-input');
    const editSubmit = commentElement.querySelector('.edit-submit');
    const editCancel = commentElement.querySelector('.edit-cancel');
    const contentDiv = commentElement.querySelector(`#content-${comment.id}`);

    editBtn?.addEventListener('click', () => {
      editForm.style.display = 'block';
      contentDiv.style.display = 'none';
    });

    editCancel?.addEventListener('click', () => {
      editForm.style.display = 'none';
      contentDiv.style.display = 'block';
    });

    editSubmit?.addEventListener('click', async () => {
      const newContent = editInput.value.trim();
      if (newContent) {
        try {
          const response = await fetch(`/videos/${videoId}/comments/${comment.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: newContent }),
          });

          if (!response.ok) {
            throw new Error('댓글 수정에 실패했습니다.');
          }

          await loadComments(); // 댓글 목록 새로고침
        } catch (error) {
          console.error('댓글 수정 실패:', error);
          alert('댓글 수정에 실패했습니다.');
        }
      }
    });

    // 삭제 버튼 이벤트
    const deleteBtn = commentElement.querySelector('.delete-btn');
    deleteBtn?.addEventListener('click', async () => {
      if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
        try {
          const response = await fetch(`/videos/${videoId}/comments/${comment.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('댓글 삭제에 실패했습니다.');
          }

          await loadComments(); // 댓글 목록 새로고침
        } catch (error) {
          console.error('댓글 삭제 실패:', error);
          alert('댓글 삭제에 실패했습니다.');
        }
      }
    });

    const repliesContainer = commentElement.querySelector('.replies-container');
    const replyBtn = commentElement.querySelector('.reply-btn');
    const replyForm = commentElement.querySelector('.reply-form');
    const replyInput = replyForm.querySelector('.reply-input');
    const replySubmit = replyForm.querySelector('.reply-submit');

    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach((reply) => {
        const replyElement = document.createElement('div');
        replyElement.className = 'reply-item';
        replyElement.innerHTML = `
        <div id="reply-content" style="display: none;">
          <div class="reply-header">
            <span class="reply-author">${reply.nickname || '사용자'}</span>
            <span class="reply-date">${new Date(reply.createdAt).toLocaleString()}</span>
          </div>
          <div class="reply-content" id="reply-content-${reply.id}">${reply.content}</div>
        ${
          currentUserId === reply.userId
            ? `
          <div class="reply-actions">
            <button class="reply-edit-btn" data-reply-id="${reply.id}">수정</button>
            <button class="reply-delete-btn" data-reply-id="${reply.id}">삭제</button>
          </div>
          <div class="reply-edit-form" style="display: none;">
            <textarea class="reply-edit-input">${reply.content}</textarea>
            <button class="reply-edit-submit">수정하기</button>
            <button class="reply-edit-cancel">취소</button>
          </div>
        </div>
      `
            : ''
        }
    `;

        const editButton = replyElement.querySelector('.reply-edit-btn');
        const editForm = replyElement.querySelector('.reply-edit-form');
        const editInput = replyElement.querySelector('.reply-edit-input');
        const editSubmit = replyElement.querySelector('.reply-edit-submit');
        const editCancel = replyElement.querySelector('.reply-edit-cancel');
        const replyContent = replyElement.querySelector(`#reply-content-${reply.id}`);

        // 수정 버튼 클릭 시 폼 표시
        editButton?.addEventListener('click', () => {
          editForm.style.display = 'block';
          replyContent.style.display = 'none';
        });

        // 취소 버튼 클릭 시 폼 숨기기
        editCancel?.addEventListener('click', () => {
          editForm.style.display = 'none';
          replyContent.style.display = 'block';
        });

        // 수정 완료 버튼 클릭 이벤트
        editSubmit?.addEventListener('click', async () => {
          const newContent = editInput.value.trim();
          if (newContent) {
            try {
              const response = await fetch(`/videos/${videoId}/comments/${reply.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newContent }),
              });

              if (!response.ok) {
                throw new Error('답글 수정에 실패했습니다.');
              }

              // 수정된 내용을 화면에 반영
              replyContent.textContent = newContent;
              editForm.style.display = 'none';
              replyContent.style.display = 'block';
              alert('답글이 수정되었습니다.');
            } catch (error) {
              console.error('답글 수정 실패:', error);
              alert('답글 수정에 실패했습니다.');
            }
          }
        });

        const deleteButton = replyElement.querySelector('.reply-delete-btn');
        if (deleteButton) {
          deleteButton.addEventListener('click', async () => {
            const confirmDelete = confirm('정말로 이 답글을 삭제하시겠습니까?');
            if (confirmDelete) {
              try {
                const response = await fetch(`/videos/${videoId}/comments/${reply.id}`, {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (!response.ok) {
                  throw new Error('답글 삭제에 실패했습니다.');
                }

                // 성공 시 답글 DOM에서 제거
                replyElement.remove();
                alert('답글이 삭제되었습니다.');
              } catch (error) {
                console.error('답글 삭제 실패:', error);
                alert('답글 삭제에 실패했습니다.');
              }
            }
          });
        }

        // 답글 컨테이너에 추가
        repliesContainer.appendChild(replyElement);
      });
    }

    // 답글 폼 토글 버튼 이벤트
    replyBtn?.addEventListener('click', () => {
      replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
      if (replyForm.style.display === 'block') {
        replyInput.focus();
      }

      // 답글 내용 표시/숨기기 기능 추가
      const replyContents = document.querySelectorAll('#reply-content'); // 모든 답글 컨텐츠 선택
      replyContents.forEach((replyContent) => {
        replyContent.style.display = replyContent.style.display === 'none' ? 'block' : 'none';
      });
    });

    // 답글 제출
    replySubmit?.addEventListener('click', async () => {
      const content = replyInput.value.trim();
      if (content) {
        await createReply(comment.id, content);
        replyInput.value = '';
        replyForm.style.display = 'none';
      }
    });

    return commentElement;
  }

  // 댓글 작성 버튼 이벤트
  commentSubmit?.addEventListener('click', async () => {
    const content = commentInput.value.trim();
    if (content) {
      await createComment(content);
    }
  });

  // 댓글 입력창 엔터키 이벤트
  commentInput?.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const content = commentInput.value.trim();
      if (content) {
        await createComment(content);
      }
    }
  });

  // 초기 댓글 로드
  await loadComments();
});

{
  /* <button class="btn" id="shared-btn">
<img src="\public\images\icons8-share-100.png" alt="" />
</button> */
}

document.addEventListener('DOMContentLoaded', () => {
  const shareButton = document.getElementById('shared-btn');
  const copyMessage = document.getElementById('copy-message');
  const backButton = document.getElementById('cancel-btn');

  shareButton.addEventListener('click', async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      console.log('URL 복사됨:', currentUrl);
      alert(`URL 복사됨: ${currentUrl}`);
    } catch (error) {
      console.error('URL 복사 실패:', error);
      alert('URL 복사에 실패했습니다. 브라우저를 확인해주세요.');
    }
  });

  backButton.addEventListener('click', (event) => {
    event.preventDefault();
    history.back();
  });
});
