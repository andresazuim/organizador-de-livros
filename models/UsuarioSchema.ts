import mongoose, { Schema } from "mongoose"

const usuarioSchema = new Schema({
    nome: { type: String, required: true },
    email:{type: String,required: true},
    senha:{ type: String, required: true },
    endereco: { type: String, required: false },
    ciadade: { type: String, required: false },
    estado: { type: String, required: false },
    dataInclusao:{type: Date, required :true},
    avatar: { type: String, required: false }
})

export const usuarioModel = (mongoose.models.usuarios ||
    mongoose.model("usuarios", usuarioSchema))

    