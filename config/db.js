import mongoose from "mongoose";
const conectarDB = async () => {
    try {
    // Conectar al servidor de MongoDB Atlas, DB en Compass.
    const db = await mongoose.connect(process.env.MONGO_URI);
    // Extraemos los datos de la conexión en una variable y los imprimimos 
    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);

    } catch (error) {
        console.log(`Error al conectar DB: ${error.message}`);
        process.exit(1);
    }
}
export default conectarDB;


