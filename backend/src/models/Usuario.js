const mongoose = require('mongoose');

const Usuario = mongoose.model('Usuario',{
	email: String,
	name: String,
	hash_password: String,
});

module.exports = Usuario;