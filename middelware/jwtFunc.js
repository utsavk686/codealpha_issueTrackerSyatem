import jwt from "jsonwebtoken"

export const jwtCheck = (token) =>{
    try {
        
        const payload = jwt.verify(token.value, process.env.JWT_SECRET)
        return payload

    } catch (error) {
        console.log(error)
        return false;
    }
}

export const jwtCreate = (payload) =>{
    return jwt.sign(payload, process.env.JWT_SECRET)
}