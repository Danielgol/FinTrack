const mongoose = require('mongoose');

const Grupo = mongoose.model('Grupo',{
	email: String,
	name: String,
	prefix: String,
	//bags: Array,
});

module.exports = Grupo;