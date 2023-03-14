import { NextApiRequest, NextApiResponse } from "next";
import { NormalizeError } from "next/dist/shared/lib/utils";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { livroModel } from "../../models/LivroSchema";
import { cadastroReq } from "../../types/cadastroReq";


const endponintLivros = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req.method === 'POST') {

        const { nome, autor } = req.body as cadastroReq

        const livrosEncontrados = await livroModel.find({ nome: nome, autor: autor })
        if (livrosEncontrados && livrosEncontrados.length > 0) {
            const livroEncontrado = livrosEncontrados[0]

            return res.status(200).json({
                nome: livroEncontrado.nome,
                autor: livroEncontrado.autor,
                edicao: livroEncontrado.edicao,
                categoria: livroEncontrado.categoria,
                //avatar: 
            })
        }
        return res.status(405).json({ erro: 'Dados nao encontrados ' })
    }
    return res.status(405).json({ erro: 'Metodo informado nao e valido' })
}

export default conectarMongoDB(endponintLivros)