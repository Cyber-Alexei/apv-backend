import express from 'express';
import { 
    registrar, 
    perfil, 
    confirmar, 
    autenticar, 
    recuperarPassword, 
    comprobarToken, 
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/veterinarioController.js';
import middlewareAutenticar from '../middlewares/autenticacion.js';

const router = express.Router();
// Rutas públicas
router.post('/', registrar)
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/recuperar-contrasena', recuperarPassword)
router.route('/recuperar-contrasena/:token').get(comprobarToken) 
.post(nuevoPassword);

// Rutas privadas
router.get('/perfil', middlewareAutenticar, perfil)
router.put('/perfil/:id', middlewareAutenticar, actualizarPerfil)
router.put('/actualizar-password', middlewareAutenticar, actualizarPassword)
export default router; 


