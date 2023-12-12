import mongoose from "mongoose";
import generarId from "../helpers/generarid.js";
import bcrypt from "bcrypt";

// Definir el esquema / estructura del documento DB 
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
        trim: true
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

// Middlewares del Schema con Mongoose
veterinarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Crear métodos personalizados en el schema para las instancias del modelo
veterinarioSchema.methods.comprobarPassword = async function(passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
}

// Registrar Eschema en Mongoose
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;

