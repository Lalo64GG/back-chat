import bcrypt from "bcryptjs"
import 'dotenv/config'

const encriptPassword = async (password: string): Promise<string> => {
    try {
        const saltRounds = parseInt(process.env['SALT'] || '10', 10);

        if (isNaN(saltRounds) || saltRounds <= 0) {
            throw new Error('Invalid salt rounds');
        }
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.error('Error encrypting password:', error);
        throw new Error('Error encrypting password');
    }
};

export default encriptPassword;


