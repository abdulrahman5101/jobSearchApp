import multer, { diskStorage } from "multer";
export const fileValidation = {
  images: ["image/jpeg", "image/png"],
  files: ["application/pdf"],
  videos: ["video/mp4"],
  audios: [],
};
export const cloudUpload = (allowedFiles) => {
  const storage = diskStorage({});
  //file filter layer 
  const fileFilter = (req, file, cb) => {
    if (!allowedFiles.includes(file.mimetype)) {
      return cb(new Error("invaild file format", false));
    }
    cb(null, true);
  };
  return multer({ storage, fileFilter });
};
