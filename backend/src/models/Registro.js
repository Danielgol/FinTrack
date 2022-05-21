const mongoose = require('mongoose');

const Registro = mongoose.model('Registro',{
	email: String,
	id_maleta: String,
	descricao: String,
	prefix: String,
	value: Number,
});

module.exports = Registro;