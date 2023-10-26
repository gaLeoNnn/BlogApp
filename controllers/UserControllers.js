const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const UserModel = require("../models/User");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const password = req.body.password;
    const passwordHashed = await bcrypt.hash(password, 7);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: passwordHashed,
      avatarUrl: req.body.avatarUrl,
    });
    const user = await doc.save();

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" });

    res.json({ ...user._doc, token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "не удалость зарегестрироваться" });
  }
};

const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "пользователь не найден",
      });
    }

    // проверяет пользователя который найден в базе с его введенным паролем
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(404).json({
        message: "неверный пароль",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" });

    res.json({ ...user._doc, token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "не удалось зарегестрироваться" });
  }
};

const checkMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "пользователь не найден",
      });
    }

    res.json(user._doc);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "нет доступа" });
  }
};

module.exports = { register, login, checkMe };
