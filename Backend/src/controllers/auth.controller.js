const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description Register a new user
 * @access Public
 */
async function registerUserController(req, res) {

    try {

        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        const trimmedUsername = username.trim()
        const trimmedEmail = email.trim().toLowerCase()
        const trimmedPassword = password.trim()

        if (trimmedUsername.length < 3 || trimmedUsername.length > 24) {
            return res.status(400).json({
                message: "Username must be between 3 and 24 characters"
            })
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            })
        }

        if (trimmedPassword.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username: trimmedUsername }, { email: trimmedEmail }]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            })
        }

        const hash = await bcrypt.hash(trimmedPassword, 10)

        const user = await userModel.create({
            username: trimmedUsername,
            email: trimmedEmail,
            password: hash
        })

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/"
        })

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}


/**
 * @name loginUserController
 * @description Login user
 * @access Public
 */
async function loginUserController(req, res) {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            })
        }

        const trimmedEmail = email.trim().toLowerCase()
        const trimmedPassword = password.trim()

        const user = await userModel.findOne({ email: trimmedEmail })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(
            trimmedPassword,
            user.password
        )

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/"
        })

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}


/**
 * @name logoutUserController
 * @description Logout user
 * @access Private
 */
async function logoutUserController(req, res) {

    try {

        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.findOneAndUpdate(
                { token },
                { token },
                { upsert: true, new: true }
            )
        }

        res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" })

        res.status(200).json({
            message: "User logged out successfully"
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}


/**
 * @name getMeController
 * @description Get current logged in user
 * @access Private
 */
async function getMeController(req, res) {

    try {

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }

        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}