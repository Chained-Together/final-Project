// const fs = require('fs');
// const path = require('path');

// module.exports = {
//   prepareFileContent: async function (context, events) {
//     const fileName = context.vars['fileName'] || 'SampleVideo_640x360_1mb.mp4';
//     const filePath = path.resolve('C:\\Users\\StrongFeel\\Downloads', fileName);

//     return new Promise((resolve, reject) => {
//       try {
//         if (!fs.existsSync(filePath)) {
//           throw new Error(`File not found: ${filePath}`);
//         }

//         const fileContent = fs.readFileSync(filePath);
//         context.vars['fileContent'] = fileContent; // 파일 내용을 변수에 저장
//         console.log(`File content prepared for: ${fileName}`);
//         resolve(); // 작업 완료
//       } catch (error) {
//         console.error('Error preparing file content:', error.message);
//         reject(error); // 에러 발생 시 reject
//       }
//     });
//   },
// };

const fs = require('fs');
const path = require('path');

module.exports = {
  prepareFileContent: async function (context, events) {
    const fileName = context.vars['fileName'] || 'SampleVideo_640x360_1mb.mp4';
    const filePath = path.resolve('C:\\Users\\StrongFeel\\Downloads', fileName);

    return new Promise((resolve, reject) => {
      try {
        // 파일 존재 확인
        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }

        // 파일 내용 읽기
        const fileContent = fs.readFileSync(filePath);

        // Artillery 컨텍스트에 파일 내용 저장
        context.vars['fileContent'] = fileContent;
        console.log(`[File Content Prepared] File Name: ${fileName}, Path: ${filePath}`);
        resolve(); // 작업 완료
      } catch (error) {
        console.error('[File Preparation Error]', error.message);
        reject(error);
      }
    });
  },
};
