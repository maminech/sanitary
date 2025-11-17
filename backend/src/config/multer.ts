import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const UPLOAD_DIR = 'uploads';

const createUploadDirs = () => {
  const dirs = [
    path.join(UPLOAD_DIR, 'plans'),
    path.join(UPLOAD_DIR, 'products'),
    path.join(UPLOAD_DIR, 'assets'),
    path.join(UPLOAD_DIR, 'temp'),
  ];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const uploadType = req.body.uploadType || 'temp';
    const destPath = path.join(UPLOAD_DIR, uploadType);
    cb(null, destPath);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = [
    '.dwg', '.dxf', '.obj', '.fbx', '.stl', '.ifc',
    '.gltf', '.glb', '.dae',
    '.jpg', '.jpeg', '.png', '.gif',
    '.csv', '.xlsx'
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${ext}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export const uploadPresets = {
  plan: upload.single('plan'),
  product: upload.single('product'),
  asset: upload.single('asset'),
  multiple: upload.array('files', 10),
};

export { upload };
