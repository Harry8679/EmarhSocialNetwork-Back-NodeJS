// const User = require('../models/user.model');
import User from '../models/user.model'
const { hashPassword, comparePassword } = require('../helpers/auth.helper');
// import { hashPassword, comparePassword } from '../helpers/auth.helper';

export const register = async(req, res) => {
    const { name, email, password, secret } = req.body;
    // Validation 
    if (!name) return res.status(400).send('Le nom est obligatoire');
    if (!password || password.length < 6) {
        return res
            .status(400)
            .send('Le mot de passe est obligatoire et doit avoir au moins 6 caractères')
    }
    if (!secret) return res.status(400).send('La réponse est obligatoire');
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).send('Cet email existe déjà !');
    // Hash password
    const hashedPassword = await hashPassword(password);

    const user = new User({ name, email, password: hashedPassword, secret });
    try {
        await user.save();
        console.log('UTILISATEUR ENREGISTRE => ', user);
        return res.json({
            ok: true
        });
    } catch (err) {
        console.log("L'INSCRIPTION A ECHOUE => ", err);
        return res.status(400).send('Erreur. Veuillez réessayé');
    }
}