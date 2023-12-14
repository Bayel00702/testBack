import userModel from "../models/user.js"

export const getAllUsers = async (req,res) => {
    try {
        const users = await userModel.find({status: req.query.status});

        res.json(users)

    } catch (err) {
        res.status(500).json({
            message: 'Не удалось получить пользователей'
        })
    }
}

export const getOneUser = async (req,res) => {
    try {

        const review = await userModel.findById(req.params.id);

        res.json(review)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить юзера'
        })
    }
};

export const resUser = async (req,res) => {
    try {
        const updateUser =await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {returnDocument: 'after'});

        res.status(200).json({
            message: 'Юзер успешно изменен',
            status: 'success',
            user: updateUser
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось изменить юзера'
        })
    }
}

export const delUser = async (req,res) => {
    try{
        const user = await userModel.findByIdAndDelete(req.params.id)

        res.json({
            message: 'Юзер успешно удален'
        })
    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить юзера'
        })
    }
}