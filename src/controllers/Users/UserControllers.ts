import 'dotenv/config'
import { Request, Response } from "express";
import { User } from "../../Models/UserSchema";
import IRequestUser from "../../Interfaces/DTOS/Users/RequestUsers";
import extractPhoneComponent from '../../utils/ExtractPhoneComponents';
import encriptPassword from '../../utils/encrypPassword';

export const addUser = async (req: Request, res:Response) => { 
    try {
        const { email, name, surnameP, surnameM, birthDate, gender, password}: IRequestUser = req.body;
        const phoneEnv = process.env['TWILIO_PHONE_NUMBER']; 

        if (!phoneEnv) {
            return res.status(500).json({
                success: false,
                message: 'Hubo un error en el servidor, no se pudieron cargar las variables de entorno'
            })
        }
        const {countryCode, phone} = extractPhoneComponent(phoneEnv);
        const encryptedPassword = await encriptPassword(password);

        const newUser = await User.create({
            email,
            name,
            surnameP,
            surnameM,
            birthDate,
            gender,
            password: encryptedPassword,
            countryCode,
            phone
        })

        newUser.save();


       return res.status(201).json({
            success: true,
            message: "se ah creado correctamente"
       })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Hubo un error en el servidor', error
        })
    }

}


export const getUserId = async(req: Request, res:Response) => {
    try {
        const { id } = req.params;
        const userFound = await User.findById(id);

        if (!userFound) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            })
        }

        userFound.password =""

        return res.status(200).json({
            success: true,
            data: userFound
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Hubo un error en el servidor', error
        })
    }
}
