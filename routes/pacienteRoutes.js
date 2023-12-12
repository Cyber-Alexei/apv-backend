import express from 'express';
import { 
    agregarPaciente, 
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
} from '../controllers/pacienteController.js';
import middlewareAutenticar from '../middlewares/autenticacion.js';

const pacienteRouter = express.Router();

pacienteRouter.route('/')
    .post(middlewareAutenticar, agregarPaciente)
    .get(middlewareAutenticar, obtenerPacientes)

pacienteRouter.route('/:id')
    .get(middlewareAutenticar, obtenerPaciente)
    .put(middlewareAutenticar, actualizarPaciente)
    .delete(middlewareAutenticar, eliminarPaciente)

export default pacienteRouter;



