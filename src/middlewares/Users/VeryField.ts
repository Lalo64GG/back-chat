import { Request, Response, NextFunction } from "express";
import IRequestUser from "../../Interfaces/DTOS/Users/RequestUsers";
import { getPositionOfLineAndCharacter } from "typescript";

export const addUser = (req: Request, res:Response, next:NextFunction) => {
    const {name, surnameP, surnameM, birthDate, gender, email, password}: IRequestUser = req.body;

    if(!name || !surnameP || !surnameM || !birthDate || !getPositionOfLineAndCharacter || !email || !password){
        return res.status(400).json({
            success: false,
            message: "Faltan campos obligatorios o algunos campos están vacíos Por favor, verifica y envía toda la información requerida."
        })
    }

    next();
    
}