import bcrypt from "bcryptjs"

const ComparePassword =  async (recivedPassword: string, password: string): Promise<boolean> => {
    try {

        if(!password || !recivedPassword){
            throw new Error('Asegurate de mandar los datos requeridos');
        }
        
        return await bcrypt.compare(recivedPassword, password);

    } catch (error) {
        console.error('error:', error);
        throw new Error('Hubo un error al compara la contraseña');
    }
}

export default ComparePassword;