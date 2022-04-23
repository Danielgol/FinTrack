const mongoose = require('mongoose');

const Grupo = mongoose.model('Grupo',{
	email: String,
	name: String,
	prefix: String,
	maletas: Array,
});

module.exports = Grupo;