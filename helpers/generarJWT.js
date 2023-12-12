import jwt from 'jsonwebtoken';
const generarJWT = (id) => {
    return jwt.sign({id: id}, process.env.JWT_PALABRA, {
        expiresIn: "30d",
    })
}
export default generarJWT;



