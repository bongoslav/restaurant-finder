import multer, { FileFilterCallback } from "multer"
import path from "path";
import fs from "fs"

const MAX_PHOTO_SIZE = Number(process.env.MAX_PHOTO_SIZE);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../uploads");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir)

  },
  filename: function (req, file, cb) {
    // ? sanitize?
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const fileFilter = (req, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: MAX_PHOTO_SIZE },
}).single('restaurantPhoto');

export default upload