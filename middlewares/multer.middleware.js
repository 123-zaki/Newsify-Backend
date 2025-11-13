// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve(process.cwd(), "public", "images"));
//   },
//   filename: function (req, file, cb) {
//     // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname + "-" + uniqueSuffix);
//   },
// });

// const fileFilter = function (req, file, cb) {
//   if (file.mimetype && file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(
//       new multer.MulterError(
//         "LIMIT_UNEXPECTED_FILE",
//         "Only image files are allowed"
//       ),
//       false
//     );
//   }
// };

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },   // 5 MB
// });


// multer.js
import multer from "multer";

// Memory storage (no disk writes)
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
