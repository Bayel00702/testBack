import express from 'express'
import mongoose from 'mongoose'
import {
    login,
    register,
    resPassword
} from "./controlers/auth.js";
import {getAllUsers, getOneUser, resUser} from "./controlers/user.js";

const api = express()
api.use(express.json())

const PORT = process.env.PORT || 6666;


mongoose.connect(`mongodb+srv://konurbaevbajel90:qwerty1234@test.ntb1u87.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Mongo DB успешно запущен'))
    .catch((err) => console.log('Ошибка при запуске Mongo DB', err));

// auth

api.post('/register', register)
api.post('/login', login)
api.post('/resPass', resPassword)

// user

api.get('/users', getAllUsers)
api.get('/user/:id', getOneUser)
api.post('/resUser/:id', resUser)


api.listen(PORT,()=>{
    console.log(`Сервер запущен на порту http://localhost:${PORT}`)
});
