import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination : function(req,res,next) {
        cb(null, "./public/temp");
    },
    filename : function(req,file,cb){
        const uniqueFilename = Date.now() + '-' + file.originalname ;
        cb(null, uniqueFilename);
    }
})

export const upload = multer({storage});