import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { connectToDatabase } from './mongodb';

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'uploads',
      filename: `${Date.now()}-${file.originalname}`
    };
  }
});

export const upload = multer({ storage });
