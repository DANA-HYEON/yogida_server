import Joi from 'joi';
import multer from 'multer';
import path from 'path';
import CustomError from './errorHandler.js';

const formDataSchema = Joi.object({
  nickname: Joi.string().min(2).optional(),
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/images/');
  },
  filename: function (req, file, cb) {
    // 기본적으로 body 유효성 검사.
    const validateResult = formDataSchema.validate(req.body);

    if (validateResult.error) {
      cb(new CustomError('Multer Error', '유효한 데이터 형식이 아닙니다.', { statusCode: 400 }));
      return;
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + uniqueSuffix + ext);
  },
});

const limits = {
  fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
  filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
  fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
  fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
  files: 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
};

const upload = multer({ storage: storage, limits });

export default upload;