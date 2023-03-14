import mongoose, { Schema } from "mongoose"

const livroSchema = new Schema({
    nome: { type: String, required: true },
    autor: { type: String, required: true },
    edicao: { type: String, required: false },
    categoria: { type: String, required: false },
    capa: { type: String, required: false }
})

export const livroModel = (mongoose.models.livros ||
    mongoose.model("livros", livroSchema))