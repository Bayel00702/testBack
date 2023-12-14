import userModel from "../models/user.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
    try {
        const { password, ...user } = req.body;

        const idx = await userModel.findOne({email: req.body.email});

        if (idx) {
            res.status(400).json({
                message: 'Такой аккаунт уже существует'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new userModel({
            ...user,
            passwordHash: hash
        });

        const userCreate = await doc.save();

        const token = jwt.sign(
            {
                _id: userCreate._id
            },
            'secret123',
            { expiresIn: '30d' }
        );

        const { passwordHash, ...userData } = userCreate._doc;

        res.json({
            user: userData,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }
};

export const login = async (req, res) => {
    try {

        const user = await userModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Такого аккаунта не существует'
            })
        }

        const inValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!inValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль '
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secret123' , {expiresIn: '30d'});

        const { passwordHash, ...userData} = user._doc;

        res.json({
            user: userData,
            token
        })


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось войти в аккаунт'
        })
    }
};


export const resPassword = async (req, res) => {
    try {

        const user = await userModel.findOne({email: req.body.email});

        const inValidPass = await bcrypt.compare(req.body.oldPassword, user._doc.passwordHash);

        if (!inValidPass) {
            return res.status(404).json({
                message: 'Неверный старый пароль'
            })
        }

        if (req.body.oldPassword === req.body.newPassword) {
            return res.status(404).json({
                message: 'Старый пароль не должен совпадать с новым'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.newPassword, salt);

        await userModel.updateOne({email: req.body.email}, {
            passwordHash: hash
        }, {returnDocument: 'after'});

        res.json({
            message: 'Пароль изменен',
            status: 'success'
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось поменять пароль'
        })
    }
};