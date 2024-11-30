// export const initializeLikeButton = async (videoId, token, container) => {
//   const likeContainer = document.createElement('div');
//   likeContainer.style.display = 'flex';
//   likeContainer.style.flexDirection = 'column';
//   likeContainer.style.alignItems = 'center';
//   likeContainer.style.marginTop = '20px';
//   const likeBtn = document.createElement('button');
//   likeBtn.id = 'likeBtn';
//   likeBtn.textContent = '좋아요';
//   likeBtn.style = `
//       padding: 10px 20px;
//       background-color: #ff6b6b;
//       color: white;
//       border: none;
//       border-radius: 5px;
//       cursor: pointer;
//     `;

//   const likeCount = document.createElement('span');
//   likeCount.id = 'likeCount';
//   likeCount.textContent = '0';
//   likeCount.style = `
//       margin-top: 10px;
//       font-size: 16px;
//       color: #555;
//     `;

//   likeContainer.appendChild(likeBtn);
//   likeContainer.appendChild(likeCount);
//   container.appendChild(likeContainer);

//   const updateLikeCount = async () => {
//     try {
//       const response = await fetch(`/likes/${videoId}`);
//       if (!response.ok) {
//         throw new Error('좋아요 수를 가져오는 데 실패했습니다.');
//       }

//       const count = await response.json();
//       likeCount.textContent = count;
//     } catch (error) {
//       console.error('좋아요 수 오류:', error);
//     }
//   };

//   likeBtn.addEventListener('click', async () => {
//     try {
//       const response = await fetch(`/likes/${videoId}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('좋아요 상태를 변경하는 데 실패했습니다.');
//       }

//       await updateLikeCount();
//     } catch (error) {
//       alert(`좋아요 오류: ${error.message}`);
//     }
//   });
//   await updateLikeCount();
// };
