const jwt = require('jsonwebtoken')

const Grupo = require('../models/Grupo');
const Maleta = require('../models/Maleta');
const Usuario = require('../models/Usuario');

// https://www.youtube.com/watch?v=K5QaTfE5ylk&t=1727s&ab_channel=MatheusBattisti-HoradeCodar
// https://www.youtube.com/watch?v=RaweREhpBX8&ab_channel=Rocketseat

const {
    HTTP_OK,
    HTTP_NOT_FOUND,
    HTTP_CREATED,
    HTTP_UNAUTHORIZED,
    HTTP_INTERNAL_ERROR
} = require('../utils/Constants')

/*
const maletas = [
    {email: 'daniel', name: 'B-BRA', value: 1000.00, prefix: 'BRL', key: '1'},
    {email: 'daniel', name: 'ITAU', value: 900.00, prefix: 'BRL', key: '2'},
    {email: 'daniel', name: 'CAIXA', value: 800.00, prefix: 'BRL', key: '3'},
    {email: 'daniel', name: 'NUBANK', value: 700.00,  prefix: 'BRL', key: '4'},
    {email: 'daniel', name: 'CASA', value: 600.00,  prefix: 'USD', key: '5'},
    {email: 'daniel', name: 'BTC', value: 0.00555555, prefix: 'BTC', key: '6'},
    {email: 'daniel', name: 'CONTA-ALT', value: 0.00222222, prefix: 'BTC', key: '7'},
    {email: 'daniel', name: 'ETHERBANK', value: 0.00333333, prefix: 'ETH', key: '8'},
    {email: 'diego', name: 'B-BRA', value: 2000.00, prefix: 'BRL', key: '1'},
    {email: 'diego', name: 'SANTANDER', value: 900.00, prefix: 'BRL', key: '2'},
    {email: 'diego', name: 'CAIXA', value: 800.00, prefix: 'BRL', key: '3'},
    {email: 'diego', name: 'NUBANK', value: 3000.00,  prefix: 'BRL', key: '4'},
    {email: 'diego', name: 'BTC', value: 0.00027, prefix: 'BTC', key: '5'},
    {email: 'joao', name: 'B-BRA', value: 5000.00, prefix: 'BRL', key: '1'},
    {email: 'joao', name: 'CAIXA', value: 350.00, prefix: 'BRL', key: '3'},
    {email: 'joao', name: 'NUBANK', value: 130.00,  prefix: 'BRL', key: '4'},
];

const grupos = [
    {email: 'daniel', name: 'Total', prefix: 'BRL', bags: ['1', '2', '3', '4']},
    {email: 'daniel', name: 'Bitcoin', prefix: 'BTC', bags: ['6', '7']},
    {email: 'daniel', name: 'Etherium', prefix: 'ETH', bags: ['8']},
    {email: 'joao', name: 'Dinheiro', prefix: 'BRL', bags: ['1', '3', '4']},
    {email: 'joao', name: 'Outro', prefix: 'BRL', bags: ['1', '3']},
];
*/


/*
Ainda falta fazer a verificação de cada campo dos formulários:
Variaveis nulas, nomes inválidos, etc.
*/


module.exports = {



    auth(req, res){
        const {email, token} = req.body;

        if(!verifyToken(email, token)){
            console.log("Token Inválido!");
            return res.status(HTTP_UNAUTHORIZED).send();
        }

        return res.status(HTTP_OK).send();
    },



    async login(req, res) {
        const {email, password} = req.body;

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



    async register(req, res) {
        const {name, email, password} = req.body;

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



    async getInfo(req, res) {

        const {email, token} = req.body;

        if(!verifyToken(email, token)){
            console.log("Token Inválido!");
            return res.status(HTTP_UNAUTHORIZED).send();
        }        
        
        var data = [];

        try{
            const maletas = await Maleta.find({email: email});
            data = maletas;
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        console.log(email+": "+data.length+" items");
        return res.status(HTTP_OK).json(data);
    },



    async createMaleta(req, res) {

        const {email, token, name, value, prefix} = req.body;

        if(!verifyToken(email, token)){
            console.log("Token Inválido!");
            return res.status(HTTP_UNAUTHORIZED).send();
        }

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



    async createGrupo(req, res) {

        const {email, token, name, prefix, maletas} = req.body;

        if(!verifyToken(email, token)){
            console.log("Token Inválido!");
            return res.status(HTTP_UNAUTHORIZED).send();
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



    async getGrupos(req, res) {

        const {email, token} = req.body;

        if(!verifyToken(email, token)){
            console.log("Token Inválido!");
            return res.status(HTTP_UNAUTHORIZED).send();
        }

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
    
}


function verifyToken(email, token){
    var decoded = {};

    try{
        decoded = jwt.verify(token, 'hash_unica_do_servidor');
    }catch(error){
        console.log("Token Inválido!");
        return false;
    }

    try{
        if(email !== decoded.email){
            console.log("Token Inválido!");
            return false;
        }
    }catch(error){
        console.log("Tipo de requisição inválida!");
        return false;
    }

    return true;
}

function generateToken(obj){
    return jwt.sign(obj, 'hash_unica_do_servidor' , {expiresIn: "10s"});
}

function encryptPassword(password){
    return password;
}