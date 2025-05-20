"use strict";
const multer = require('multer');

const MIME_TYPE_MAP: any = {
    "application/pdf": "pdf"
};

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        console.log("multer", req.file)
       let error;
        if (!isValid) {
            error = new Error("Invalid mime type");
            console.log("multer1")
        }
        cb(error, "./uploads/resumes" );
        console.log("multer1324")
    },
    filename: (req: any, file: any, cb: any) => {
        console.log("multer2", req.file)
        const name = file.originalname.toLowerCase().split(' ').join('_');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});
module.exports = multer({ storage: storage }).single('uploadcontactfile');