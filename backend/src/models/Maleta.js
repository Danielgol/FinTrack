const mongoose = require('mongoose');

const Maleta = mongoose.model('Maleta',{
	email: String,
	name: String,
	value: Number,
	prefix: String,
});

module.exports = Maleta;