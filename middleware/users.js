const users = require('../models/user');
const bcrypt = require("bcryptjs");
const findAllUsers = async (req, res, next) => {
  req.usersArray = await users.find({}, {password: 0});
  next();
};
const createUser = async (req, res, next) => {
  console.log("POST /users");
  try {
    console.log(req.body);
    req.user = await users.create(req.body);
    next();
  } catch (error) {
    res.status(400).send({ message: "Ошибка создания пользователя" });
  }
};
const findUserById = async (req, res, next) => {
  console.log("GET /api/users/:id");
  try {
    req.user = await users.findById(req.params.id, { password: 0 });
    next();
  } catch (error) {
    res.status(404).send("User not found");
  }
};
const updateUser = async (req, res, next)=>{
  try{
    req.user = await users.findByIdAndUpdate(req.params.id, req.body);
    next()
  }catch(err){
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message: "Ошибка обновления пользователя"}))
  }
};
const deleteUser = async(req, res, next)=>{
  try{
    req.user = await users.findByIdAndDelete(req.params.id);
    next();
  }catch(err){
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message: "Ошибка удаления пользователя"}));
  }
};
const checkEmptyNameAndEmailAndPassword = async(req, res, next)=>{
  if (!req.body.username || !req.body.email || !req.body.password){
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message: "Заполните все поля"}))
  }else{
    next()
  }
};
const checkEmptyNameAndEmail = async(req, res, next)=>{
  if (!req.body.username || !req.body.email){
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message: "Заполните все поля"}))
  }else{
    next()
  }
};
const checkIsUserExist = async (req, res, next)=>{
  const isExist = req.usersArray.find((user)=>{return req.body.email === user.email});
  if (isExist){
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message: "Пользователь с такой почтой уже существует"}))
  }else{
    next()
  }
};
const hashPassword = async(req, res, next)=>{
  try{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt)
    req.body.password = hash;
    next();
  }catch(err){
    res.status(400).send({message: "Ошибка хеширования пароля"});
  }
}
module.exports = {findAllUsers, createUser, findUserById, updateUser, deleteUser, checkEmptyNameAndEmailAndPassword, checkEmptyNameAndEmail, checkIsUserExist, hashPassword};