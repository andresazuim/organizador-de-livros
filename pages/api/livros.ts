import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { requestToBodyStream } from "next/dist/server/body-streams";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { livroModel } from "../../models/LivroSchema";
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { cadastroReq } from "../../types/cadastroReq";


const handler = nextConnect()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            //requerimento dos dados 
            const livro = req.body as cadastroReq
            //validacao dos dados
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
            
            //confirmar se tem o mesmo livro com o mesmo nome
            const livroComMesmoNome = await livroModel.find({ nome: livro.nome })
            
            if (livroComMesmoNome && livroComMesmoNome.length > 0) {
                return res.status(400).json({ erro: 'Ja existe um livro com o nome informado' })
            }
            
            //upload da imagem 
            const image = await uploadImagemCosmic(req)
            
            //livro salvo
            const livroASerSalvo = {
                nome: livro.nome,
                autor: livro.autor,
                edicao: livro.edicao,
                categoria: livro.categoria,
                capa: image?.media?.url,
                dataInclusao: new Date().toISOString()
            }
            
            //integracao com o banco de dados
            await livroModel.create(livroASerSalvo)
            
            return res.status(201).json({ msg: 'Livro criado com sucesso!' })
        
        } catch (e: any) {
            console.log(e);
            return res.status(500).json({ erro: e.toString() });
        }
    })

    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        //traz uma lista com todos os livros cadastrados
        const livros = await livroModel.find()

        return res.status(400).json({ data: livros })
    })
    .delete(async (req: NextApiRequest, res: NextApiResponse) => {
        
        const idLivro = req?.query
       
        await livroModel.findById(idLivro)
        
        const livroEncontrado = idLivro
                       
        if(!livroEncontrado){
            return res.status(404).json({erro : "Livro nao encontrado"})
        }
                    
        await livroModel.findByIdAndDelete(livroEncontrado)
        return res.status(204).json({msg: "Livro deletado com sucesso"})
        
      
        
    })
    .put(async (req: NextApiRequest, res: NextApiResponse) => {
        
        const idLivro = req?.query
        
        const livroAlterado = req.body as cadastroReq
        
        await livroModel.findById(idLivro)
        const livrosEncontrado = idLivro
       
        if(!livrosEncontrado){
            return res.status(404).json({erro : "Livro nao encontrado"})
        }
        
        const image = await uploadImagemCosmic(req)
        
        livrosEncontrado.nome= livroAlterado.nome
        livrosEncontrado.autor = livroAlterado.autor
        livrosEncontrado.edicao = livroAlterado.edicao
        livrosEncontrado.categoria = livroAlterado.categoria
        livrosEncontrado.capa = image?.media?.url
        livrosEncontrado.dataInclusao = new Date().toISOString()
        console.log(livrosEncontrado,'3')
        await livroModel.findByIdAndUpdate(idLivro,livrosEncontrado)
        
        return res.status(201).json({msg: "Livro alterado com sucesso"})
        
    })
    export const config = {
        api: {
            bodyParser: false
        }


}


export default conectarMongoDB(handler)