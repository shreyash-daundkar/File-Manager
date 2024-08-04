import multer from 'multer';


const storage = multer.memoryStorage();

const upload = multer({ storage: storage});

const multerFileUpload = upload.single('file');


export default multerFileUpload;