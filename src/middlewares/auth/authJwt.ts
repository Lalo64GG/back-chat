import 'dotenv/config'
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const veryfyToken = (req: Request, res: Response, next: NextFunction) => {
    try {

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: "No autorizado" });
    
    jwt.verify(token, process.env.SECRET || 'cualquiersecreto', (err, decoded) => {
        if (err) return res.status(403).json({ success: false, message: "Token expirado" });
    
    req.body.userId = decoded;
    next();
});
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}

export default veryfyToken;

