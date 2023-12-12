import express from 'express';
import conectarDB from './config/db.js'
import dotenv from "dotenv";
import veterinarioRouter from './routes/veterinarioRoutes.js';
import pacienteRouter from './routes/pacienteRoutes.js';
import cors from 'cors';

const app = express();
app.use(express.json());
dotenv.config();
conectarDB();

// Dominios en lista blanca
const dominiosPermitidos = [process.env.FRONTEND_URL];

// Opciones de la dependencia CORS
const corsOptions = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('URL no en la lista blanca'));
        }
    }
}

// Middleware que se ejecuta con toda petición ya que no se especifica URL
app.use(cors(corsOptions))


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

app.use('/api/veterinarios', veterinarioRouter);
app.use('/api/pacientes', pacienteRouter);


