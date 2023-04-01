import multer from "multer";

const {
    CHAVE_GRAVACAO_LIVROS,
    BUCKET_LIVROS,
    CHAVE_GRAVACAO_AVATAR,
    BUCKET_AVATAR
} = process.env

const Cosmic = require("cosmicjs")

const bucketLivros = Cosmic().bucket({
    slug: BUCKET_LIVROS,
    write_key: CHAVE_GRAVACAO_LIVROS
})

const bucketAvatar = Cosmic().bucket({
    slug: CHAVE_GRAVACAO_AVATAR,
    write_key: BUCKET_AVATAR
})

const storange = multer.memoryStorage()

const upload = multer({ storage: storange })

const uploadImagemCosmic = async (req: any) => {
    if (req?.file?.originalname) {

        if (!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') &&
            !req.file.originalname.includes('.jpeg')) {
            throw new Error('Extensao da imagem invalida');
        }

        const objeto_media = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        }
        
        if (req.url && req.url.includes('avatar')) {
            return await bucketAvatar.addMedia({ media: objeto_media });
        } else {
            return await bucketLivros.addMedia({ media: objeto_media});
        }
        
    }
   
   
}    

export { upload, uploadImagemCosmic}