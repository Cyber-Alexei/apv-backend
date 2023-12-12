const generarId = () => {
    const valorUnico = Math.random().toString(32).substring(2);
    
    return valorUnico;
}

export default generarId;


