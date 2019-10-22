const express = require('express');
const auth = require('../app/middleware/auth');
const UserController = require('../app/controllers/userController');
const multer = require('multer');
const uploadConfig = require('../config/upload');

const users = new express.Router();
const upload = multer(uploadConfig);

// Register user
users.post('/register-user', upload.single('image'), UserController.create);

// Login
users.post('/validate-user', UserController.validate);

users.get('/meu/perfil', auth, UserController.myProfile);

//logout
users.get('/logout', auth, UserController.logout);

module.exports = users;
