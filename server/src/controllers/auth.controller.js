const {registerSchema, loginSchema} = require('../validators/auth.validator.js')
const User = require('../models/user.model.js')

const registerUser = async (req, res) => {
    try {
        
        const validate = registerSchema.safeParse(req.body)

        if (!validate.success) {
            return res.status(400).json({ errors: validate.error.errors });
        }

        const isExistingUser = await User.findOne({ email: req.body.email });

        if (isExistingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUser = new User(req.body);

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Register Server error." });
    }
}

const loginUser = async (req, res) => {
    try {

        const validate = loginSchema.safeParse(req.body)

        if (!validate.success) {
            return res.status(400).json({ errors: validate.error.errors });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "No user found with this email" });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return res.status(200).json({
            message: "User logged in successfully.",
            user: {
                name : user.name,
                email : user.email,
                phoneNumber: user.phoneNumber,
                gender : user.gender
            }, token});

    } catch (error) {
        return res.status(500).json({ message: "Login Server error." });
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Server error." });
    }
}


module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
}