import multer from "multer";

const {
    CHAVE_GRAVACAO_LIVROS,
    BUCKET_LIVROS
} = process.env

const Cosmic = require('cosmicjs')

const bucketLivros = Cosmic().bucket({
    slug: BUCKET_LIVROS,
    write_key: CHAVE_GRAVACAO_LIVROS
})

const storange = multer.memoryStorage()

const upload = multer({ storage: storange })

const uploadCapaLivro = async (req: any) => {
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

        if(req.url && req.url.includes){
            return await bucketLivros.addMedia({ media: objeto_media });
        }
    }
}    

export { upload, uploadCapaLivro }