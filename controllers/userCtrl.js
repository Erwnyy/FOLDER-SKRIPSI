const Users = require('../models/userModel')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


function modInverse(a, m) {
    for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) {
            return i;
        }
    }
    return -1; // If the inverse doesn't exist
}

// Function to encrypt a message using the affine cipher
function encryptPassword(password, a, b) {
    const m = 26; // Assuming a standard 26-letter alphabet
    let result = '';

    for (let i = 0; i < password.length; i++) {
        const char = password[i];

        if (char.match(/[a-zA-Z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const x = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
            const encrypted = (a * x + b) % m;
            const encryptedChar = String.fromCharCode(encrypted + 'a'.charCodeAt(0));

            result += isUpperCase ? encryptedChar.toUpperCase() : encryptedChar;
        } else {
            result += char;
        }
    }

    return result;
}

// Function to decrypt a message using the affine cipher
function decrypt(text, a, b) {
    const m = 26;
    const aInverse = modInverse(a, m);

    if (aInverse === -1) {
        throw new Error('Invalid key: a and m must be coprime.');
    }

    const result = [];

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char.match(/[a-zA-Z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const x = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
            const decrypted = (aInverse * (x - b + m)) % m;
            const decryptedChar = String.fromCharCode(decrypted + 'a'.charCodeAt(0));

            result.push(isUpperCase ? decryptedChar.toUpperCase() : decryptedChar);
        } else {
            result.push(char);
        }
    }

    return result.join('');
}

// Example usage
const plaintext = 'HelloWorld';
const a = 5;
const b = 8;


const userCtrl = {
    register: async (req, res) =>{
        try {
            const {name, email, password, tanggal_lahir, alamat, program_studi} = req.body;

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "The email already exists."})

            if(password.length < 6) 
                return res.status(400).json({msg: "Password is at least 6 characters long."})

            const a = 5;
            const b = 8;
            const passwordHash = encryptPassword(password, a, b)
            // const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordHash, tanggal_lahir, alamat, program_studi
            })

            // Save mongodb
            await newUser.save()

            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7ddd
            })

            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) =>{
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect password."})

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) =>{
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    refreshToken: (req, res) =>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
                if(err) return res.status(400).json({msg: "Please Login or Register"})

                const accesstoken = createAccessToken({id: user.id})

                res.json({accesstoken})
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        
    },
    getUser: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "User does not exist."})

            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addCart: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "User does not exist."})

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })

            return res.json({msg: "Added to cart"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    history: async(req, res) =>{
        try {
            const history = await Payments.find({user_id: req.user.id})

            res.json(history)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
 }


const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'})
}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = userCtrl

