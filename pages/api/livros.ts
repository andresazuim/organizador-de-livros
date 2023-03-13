import { NextApiRequest,NextApiResponse } from "next";
import { cadastroReq } from "../../types/cadastroReq";
export default(
    req: NextApiRequest,
    res: NextApiResponse
) =>{
    if(req.method === 'POST'){
        const{nome, autor, edicao, categoria} = req.body as cadastroReq
    
        if(nome === "Jantar Secreto" &&
            autor === "Rafael Montes" &&
            edicao === 2016 && 
            categoria === "Suspense"){
               
                return res.status(200).json({msg: 'Livro encontrado com sucesso'})
            }
            return res.status(405).json({erro: 'Dados nao encontrados '})
    }
    return res.status(405).json({erro: 'Metodo informado nao e valido'})
}