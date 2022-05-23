const https = require('https');
const jwt = require('jsonwebtoken')

const Grupo = require('../models/Grupo');
const Maleta = require('../models/Maleta');
const Usuario = require('../models/Usuario');
const Registro = require('../models/Registro');

// https://www.youtube.com/watch?v=K5QaTfE5ylk&t=1727s&ab_channel=MatheusBattisti-HoradeCodar
// https://www.youtube.com/watch?v=RaweREhpBX8&ab_channel=Rocketseat

const {
    HTTP_OK,
    HTTP_NOT_FOUND,
    HTTP_CREATED,
    HTTP_UNAUTHORIZED,
    HTTP_INTERNAL_ERROR
} = require('../utils/Constants');

const SERVER_HASHCODE = 'hash_unica_do_servidor';



module.exports = {


    // GET
    auth(req, res){
        return res.status(HTTP_OK).send();
    },


    // POST
    async login(req, res) {
        const { email, password } = req.body;

        try{
            const usuario = await Usuario.findOne({email: email});
            const hash_password = encryptPassword(password);

            if(usuario.hash_password === hash_password){
                console.log("Login Success: "+email);
                const token = generateToken({email, password});
                return res.status(HTTP_OK).json({'email': email ,'token': token});
            }
        }catch(error){
            console.log(email+" não autenticado!");
            return res.status(HTTP_UNAUTHORIZED).send();
        }

        console.log(email+" não autenticado!");
        return res.status(HTTP_UNAUTHORIZED).send();
    },


    // POST
    async register(req, res) {
        const { name, email, password } = req.body;

        try{
            const usuario = await Usuario.findOne({email: email});
            console.log(usuario.email+" já está sendo utilizado!")
            return res.status(HTTP_INTERNAL_ERROR).send();
        }catch(error){}

        const hash_password = encryptPassword(password);

        const usuario = {
            name,
            email,
            hash_password,
        }

        try{
            await Usuario.create(usuario);
            console.log("Register: "+usuario.email);
            return res.status(HTTP_CREATED).send();
        }catch(error){}

        console.log("Erro na criação do usuário!");
        return res.status(HTTP_INTERNAL_ERROR).send();
    },


    // GET
    async getUserInfo(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email
        
        var name = "";

        try{
            const usuario = await Usuario.findOne({email: email});
            name = usuario.name;
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        return res.status(HTTP_OK).json({'name': name});
    },


    // GET
    async getMaletas(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email    
        
        var data = [];

        try{
            const maletas = await Maleta.find({email: email});
            data = maletas;
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        return res.status(HTTP_OK).json(data);
    },


    // GET
    async getMaletaByName(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { name } = req.params
        
        var maleta;

        try{
            maleta = await Maleta.findOne({email: email, name: name})
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        return res.status(HTTP_OK).json(maleta);
    },


    // GET
    async getRegistros(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { id } = req.params
        
        var data = [];

        try{
            const registros = await Registro.find({id_maleta: id, email: email});
            data = registros;
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        return res.status(HTTP_OK).json(data);
    },


    // POST
    async createRegistro(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email    
        
        const { id_maleta, descricao, prefix, value } = req.body;

        const registro = {
            email,
            id_maleta,
            descricao,
            prefix,
            value,
        }

        var maleta = {};

        try{
            maleta = await Maleta.findOne({email: email, _id: id_maleta});
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        try{
            maleta.value += value
            await maleta.save();
            await Registro.create(registro);
            console.log("Historico Criado: "+registro.value);
            return res.status(HTTP_CREATED).send();
        }catch(error){}

        console.log("Erro na criação do Registro!");
        return res.status(HTTP_INTERNAL_ERROR).send();
    },


    // POST
    async createMaleta(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { name, value, prefix } = req.body;

        console.log(email, name, value, prefix)

        const maleta = {
            email,
            name,
            value,
            prefix,
        }

        try{
            await Maleta.create(maleta);
            console.log("Maleta Criada: "+maleta.name);
            return res.status(HTTP_CREATED).send();
        }catch(error){}

        console.log("Erro na criação da maleta!");
        return res.status(HTTP_INTERNAL_ERROR).send();
    },


    // GET
    async getGrupos(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        var data = [];

        try{
            const grupos = await Grupo.find({email: email});
            data = grupos;
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        return res.status(HTTP_OK).json(data);
    },


    // POST
    async createGrupo(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { name, prefix, maletas } = req.body;

        if (!(name && prefix && maletas)) {
            console.log("Erro na criação do grupo!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        if(maletas.length == 0){
            console.log("Erro na criação do grupo!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        const grupo = {
            email,
            name,
            prefix,
            maletas
        }

        try{
            await Grupo.create(grupo);
            console.log("Grupo Criado: "+grupo.name);
            return res.status(HTTP_CREATED).send();
        }catch(error){}

        console.log("Erro na criação do grupo!");
        return res.status(HTTP_INTERNAL_ERROR).send();
    },


    // GET
    getCriptoPrice(req, res) {

        const { id } = req.params

        const apiUrl = 'https://api.coindesk.com/v1/bpi/currentprice.json';

        https.get(apiUrl, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                data = JSON.parse(data);
                var btc_value = parseFloat(data.bpi.USD.rate.replace(',',''));
                console.log(btc_value);
                res.send(btc_value+'');
            });
        });
    },


    // GET
    getCriptoHistory(req, res) {

        const site = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=";
        const currency = "brl";
        const settings = "&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=";
        const price_change_percentage = "7d";
        const url = site + currency + settings + price_change_percentage;

        https.get(url, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                data = JSON.parse(data);
                res.send(data);
            });
        });

    }

    
}

function generateToken(obj){
    return jwt.sign(obj, SERVER_HASHCODE , {expiresIn: "10m"});
}

function encryptPassword(password){
    return password;
}