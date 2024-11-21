import { diskStorage, memoryStorage } from 'multer';

export const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, //30MB 제한
};
