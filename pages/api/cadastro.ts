import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { livroModel } from "../../models/LivroSchema";
import { upload, uploadCapaLivro } from "../../services/uploadCapaLivro";
import { cadastroReq } from "../../types/cadastroReq";


const handler = nextConnect()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const livro = req.body as cadastroReq

            if (!livro.nome || livro.nome.length < 2) {
                return res.status(400).json({ erro: 'Nome do livro invalido' })
            }
            if (!livro.autor || livro.autor.length < 2) {
                return res.status(400).json({ erro: 'Autor do livro invalido' })
            }
            if (!livro.edicao || livro.edicao.length < 2) {
                return res.status(400).json({ erro: 'Edicao do livro invalida' })
            }
            if (!livro.categoria || livro.categoria.length < 2) {
                return res.status(400).json({ erro: 'Categoria do livro invalida' })
            }

            const livroComMesmoNome = await livroModel.find({ nome: livro.nome })
            if (livroComMesmoNome && livroComMesmoNome.length > 0) {
                return res.status(400).json({ erro: 'Ja existe um livro com o nome informado' })
            }

            const image = await uploadCapaLivro(req)

            const livroASerSalvo = {
                nome: livro.nome,
                autor: livro.autor,
                edicao: livro.edicao,
                categoria: livro.categoria,
                capa: image?.media?.url
            }

            await livroModel.create(livroASerSalvo)
            return res.status(200).json({ msg: 'Livro criado com sucesso!' })

        } catch (e: any) {
            console.log(e);
            return res.status(400).json({ erro: e.toString() });
        }
    })


export const config = {
    api: {
        bodyParser: false
    }
}

export default conectarMongoDB(handler)