// const User = require('../models/user.model');
import User from '../models/user.model'
const { hashPassword, comparePassword } = require('../helpers/auth.helper');
// import { hashPassword, comparePassword } from '../helpers/auth.helper';
const jwt = require('jsonwebtoken');

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

export const login = async(req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;
        // Check if our db user with that email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send("Cet email n'existe pas.")
        // Check Password
        const match = await comparePassword(password, user.password);
        if (!match) return res.status(400).send('Mot de passe incorrect');
        // Create a signed token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        user.password = undefined;
        user.secret = undefined;
        res.json({
            token,
            user
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send('Erreur. Veuillez réessayer');
    }
}