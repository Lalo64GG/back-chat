import { Request, Response } from "express"
import { User } from "../../Models/UserSchema"
import ComparePassword from "../../utils/ComparePassword"
import IResponseUser from '../../Interfaces/DTOS/Users/ResponseUser'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import veryfyToken from "../../middlewares/auth/authJwt"
import sendEmail from "../../config/email/PasswordReset"

class AuthController {

    static async access(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const userFound = await User.findOne({ email });

            if (!userFound) {
                return res.status(404).json({
                    success: true,
                    message: 'Usuario no encontrado'
                });
            }

            const matchPassword = await ComparePassword(password, userFound.password);

            if (!matchPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales incorrectas: usuario no encontrado'
                })
            }

            const SECRETE = process.env['SECRETE'];
            if (!SECRETE){
                return res.status(500).json({
                    success: false,
                    message: 'Error en el servidor, no se pudo cargar los datos'
                })
            }

            const token = jwt.sign({ id: userFound._id }, SECRETE, { expiresIn: '1hr' });

            const sendData: IResponseUser = {
                email: userFound.email,
                name: userFound.name,
                id: userFound.id
            }

            return res
                .cookie('access_token', token, {
                    httpOnly: true, // Esta propiedad permite que la cookie no sea accesible por el cliente
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    sameSite: 'strict', // Esta propiedad ayuda a proteger la cookie contra ataques CSRF
                    maxAge: 100 * 60 * 60, // 1hr
                })
                .status(200).json({
                    success: true,
                    data: sendData
                })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Hubo un error al procesar los datos"
            })
        }
    }

    static refresh(req: Request, res: Response) {
        try {
            const token = req.cookies['access_token'];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No se encontró el token de acceso'
                });
            }

            const SECRETE = process.env['SECRETE'];
            if (!SECRETE) {
                return res.status(500).json({
                    success: false,
                    message: 'Error en el servidor, no se pudo cargar los datos'
                });
            }

            jwt.verify(token, SECRETE, async (err: any, decoded: any) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: 'Token inválido o expirado'
                    });
                }

                const userFound = await User.findById(decoded.id);
                if (!userFound) {
                    return res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                }

                const newToken = jwt.sign({ id: userFound._id }, SECRETE, { expiresIn: '1hr' });

                return res
                    .cookie('refresh_token', newToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production' ? true : false,
                        sameSite: 'strict',
                        maxAge: 7 * 60 * 60 * 1000, // 7 hours
                    })
                    .status(200).json({
                        success: true,
                        message: 'Token renovado exitosamente'
                    });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Hubo un error al procesar los datos"
            });
        }
    }

    static logout(_req: Request, res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.json({
            success: true,
            message: 'Sesión cerrada'
        });
    }

    static async requestPasswordReset(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }

            const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET!, { expiresIn: '15m' });

            await sendEmail(user.email, token, user.name);

            return res.status(200).json({
                success: true,
                message: "Correo de restablecimiento enviado con éxito"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error al procesar la solicitud"
            });
        }
    }

    // Restablecer la contraseña
    static async resetPassword(req: Request, res: Response) {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;

            console.log(token+ newPassword+ " resetPassword");

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: "Token no proporcionado"
                });
            }

            console.log("paso 1");
            let payload: string | jwt.JwtPayload;
            console.log(process.env.RESET_PASSWORD_SECRET! + " requestPasswordReset222");
            try {
                payload =  jwt.verify(token, process.env.RESET_PASSWORD_SECRET!);
                console.log("paso 2" + payload);
            } catch (error) {
                console.log("paso 3" + error);
                return res.status(400).json({
                    success: false,
                    message: "Verificacion fallida intenta generar un nuevo link"
                });
            }  
            console.log("paso 4");
            if (typeof payload === 'object' && 'id' in payload) {
                const user = await User.findById(payload.id);
                console.log("paso 5" + user);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "Usuario no encontrado"
                    });
                }

                // Actualizar la contraseña del usuario en la base de datos
                await User.updateOne({ _id: payload.id }, { password: await bcrypt.hash(newPassword, 10) });
                console.log("paso 6");
                return res.status(200).json({
                    success: true,
                    message: "Contraseña actualizada correctamente"
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error al actualizar la contraseña"
            });
        }
    }
}

export default AuthController;
