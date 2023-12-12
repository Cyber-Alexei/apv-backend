import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarid.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailRecuperarPassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const {email, nombre} = req.body;
    // Prevenir usuarios registrados
    const existeUsuario = await Veterinario.findOne({email: email});

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
    //Guardar un nuevo veterinario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    // Envar E-mail de confirmación
    emailRegistro({
        email,
        nombre,
        token: veterinarioGuardado.token,
    });

    res.json({ veterinarioGuardado });

    } catch (error) {
        console.log(`Este es un error al registrar a un veterinario: ${error}`);
        process.exit(1);
    }
}

const perfil = (req, res) => {
    const {veterinario} = req;
    res.json(veterinario)
}

const confirmar = async (req, res) => {
    const {token} = req.params;
    const usuarioEncontrado = await Veterinario.findOne({token: token});

    if (!usuarioEncontrado) {
        const error = new Error('Token no encontrado');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioEncontrado.token = null;
        usuarioEncontrado.confirmado = true;
        await usuarioEncontrado.save();
        res.json({msg: "Usuario confirmado correctamente"});
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {
    const {email, password} = req.body;
    // Comprobar que el usuario exista
    const usuario = await Veterinario.findOne({email});
    if (!usuario) {
        const error = new Error('El usuario no existe, comprueba el email');
        return res.status(401).json({msg: error.message});
    }
    // Comprobar si el usuario está confirmado o no
    if (!usuario.confirmado) {
        const error = new Error('Confirma el email que te enviamos');
        return res.status(401).json({msg: error.message});
    }
    // Revisar el password
    if (await usuario.comprobarPassword(password)) {

        // Autenticar
        res.json({token: generarJWT(usuario.id)});
        
    } else {
        const error = new Error('Password incorrecto');
        return res.status(401).json({msg: error.message});
    }

}

const recuperarPassword = async (req, res) => {
    const {email} = req.body;
    const veterinarioActualizar = await Veterinario.findOne({email: email});
    if (!veterinarioActualizar) {
        const error = new Error('Correo electrónico no registrado');
        return res.status(404).json({msg: error.message});
    }
    try {
        veterinarioActualizar.token = generarId();
        await veterinarioActualizar.save();
        //Enviar E-mail con instrucciones
        emailRecuperarPassword({
            email,
            nombre: veterinarioActualizar.nombre,
            token: veterinarioActualizar.token
        });

        res.json({msg: 'Hemos enviado un email de restablecimiento'})
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;
    const usuario = await Veterinario.findOne({token: token})
    if (usuario) {
        res.json({msg: 'Token válido, el usuario existe', usuario})
    } else {
        const error = new Error('Parece que hubo un error, intentalo de nuevo');
        return res.status(404).json({msg: error.message});
    }
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    const usuario = await Veterinario.findOne({token});
    if (!usuario) {
        const error = new Error('Parece que hubo un error, intentalo de nuevo');
        return res.status(404).json({msg: error.message});
    } 
    try {
        usuario.token = null;
        usuario.password = password;
        await usuario.save();
        res.json({msg: 'Password modificado correctamente, inicia sesión'});
    } catch(error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    const id = req.params.id;
    const {nombre, email, telefono, web} = req.body;

    const veterinario = await Veterinario.findOne({_id: id});

    if (!veterinario) {
        const error = new Error('No se logró encontrar al veterinario en la base de datos');
        return res.status(400).json({msg: error.message});
    }

    if (email !== veterinario.email) {
        const existeEmail = await Veterinario.findOne({email});
        if (existeEmail) {
            const error = new Error("Ese email ya está en uso");
            return res.status(400).json({msg: error.message});
        }
    }

    try {

        veterinario.nombre = nombre;
        veterinario.email = email;
        veterinario.telefono = telefono;
        veterinario.web = web;

        const veterinarioActualizado = await veterinario.save();
        return res.json(veterinarioActualizado);

    } catch (error) {
        return res.json({msg: error.message});
    }
}

const actualizarPassword = async (req, res) => {
    // Leer datos
    const veterinario = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;

    // Comprobar al veterinario
    try {
        const veterinarioExiste = await Veterinario.findOne({_id: veterinario._id});
        const passwordCorrecto = await veterinarioExiste.comprobarPassword(pwd_actual);

        // Comprobar password actual
        if (passwordCorrecto) {

            // Borrar password Actual, almacenar nuevo password
            veterinarioExiste.password = '';
            veterinarioExiste.password = pwd_nuevo;
            await veterinarioExiste.save();

            return res.json({msg: `El password se ha actualizado correctamente a: ${pwd_nuevo}`, error: false});
        } else {
            const errorIns = new Error('Contraseña incorrecta');
            return res.status(400).json({msg: errorIns.message, error: true});
        }
    } catch (error) {
        console.log(error);
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    recuperarPassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}
