import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, "uploads/");
    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            file.originalname;

        cb(null, uniqueName);
    }

});

const fileFilter = (req, file, cb) => {

    const allowed = [
        ".java",
        ".py",
        ".js",
        ".cpp",
        ".c"
    ];

    const extension = path.extname(file.originalname);

    if (allowed.includes(extension)) {

        cb(null, true);

    } else {

        cb(new Error("Only source code files are allowed."));

    }

};

const upload = multer({

    storage,
    fileFilter

});

export default upload;