import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    try {
        const pacienteGuardado = await paciente.save();
        res.json(pacienteGuardado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente
    .find({veterinario: req.veterinario._id});
    res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {
    const _id = req.params.id;
    const veterinario = req.veterinario._id;
    const paciente = await Paciente.findOne({_id, veterinario});
    if(paciente) {
        res.json({paciente});
    } else {
        console.log('Error al acceder al paciente')
        const error = new Error('Paciente y veterinario no coinciden');
        res.status(401).json(error.message);
    }
}

const actualizarPaciente = async (req, res) => {
    const {nombre, propietario, email, sintomas} = req.body;
    const _id = req.params.id;
    const veterinario = req.veterinario._id;
    try {
        const paciente = await Paciente.findOne({_id, veterinario});
        if(nombre) {
            paciente.nombre = nombre;
        }
        if (propietario) {
            paciente.propietario = propietario;
        }
        if (email) {
            paciente.email = email;
        }
        if (sintomas) {
            paciente.sintomas = sintomas;
        }
        const pacienteGuardado = await paciente.save();
        res.json({
            msg: "Paciente guardado con exito",
            pacienteGuardado
        });
    } catch (error) {
        console.log('Error al buscar al paciente', error)
        const instErr = new Error('Paciente no encontrado');
        return res.status(404).json(instErr.message);
    } 
}

const eliminarPaciente = async (req, res) => {
    const _id = req.params.id;
    const veterinario = req.veterinario._id;
    try {
        const paciente = await Paciente.findOne({_id, veterinario});
        await paciente.deleteOne();
        res.json({msg: "Paciente eliminado correctamente"})
    } catch (error) {
        console.log('Error al buscar al paciente', error)
        const instErr = new Error('Paciente no encontrado');
        return res.status(404).json(instErr.message);
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}

