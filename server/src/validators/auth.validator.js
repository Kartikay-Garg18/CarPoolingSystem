const { z } = require('zod');

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message : "Password must be of minimum length 8"}),
})

const registerSchema = z.object({
    name: z.string().min(3, {message : "Name must be of minimum length 3"}),
    email: z.string().email(),
    password: z.string().min(8, {message : "Password must be of minimum length 8"}),
    phoneNumber: z.string().min(10, {message : "Phone number must be of minimum length 10"}),
    gender: z.enum(['M', 'F', 'O'], {message: "Gender must be M, F, or O"})
})

module.exports = {
    loginSchema,
    registerSchema
}