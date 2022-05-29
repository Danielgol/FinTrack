const https = require('https');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

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

const SERVER_HASHCODE = process.env.SERVER_HASHCODE;



module.exports = {


    // GET
    auth(req, res){
        return res.status(HTTP_OK).send();
    },


    // POST
    async login(req, res) {
        const { email, password } = req.body;

        if(!(email && password)) {
            return res.status(HTTP_UNAUTHORIZED).send(
                {message: "Digite um email e senha válidos!"}
            );
        }

        try{
            const usuario = await Usuario.findOne({email: email});
            const result = await bcrypt.compare(password, usuario.hash_password);
            if(result){
                console.log("Login Success: "+email);
                const token = generateToken({email, password});
                return res.status(HTTP_OK).json({'email': email ,'token': token});
            }
            return res.status(HTTP_UNAUTHORIZED).send(
                {message: "Senha incorreta!"}
            );
        }catch(error){
            return res.status(HTTP_UNAUTHORIZED).send(
                {message: "Este email não está cadastrado!"}
            );
        }

        return res.status(HTTP_UNAUTHORIZED).send(
            {message: "Ocorreu um erro durante a autenticação!"}
        );
    },


    // POST
    async register(req, res) {
        const { name, email, password } = req.body;

        try{
            const usuario = await Usuario.findOne({email: email});
            console.log(usuario.email+" já está sendo utilizado!")
            return res.status(HTTP_INTERNAL_ERROR).send(
                {message: "Esse email já está sendo utilizado!"}
            );
        }catch(error){}

        const hash_password = await encryptPassword(password);
        
        if (!(name && email && password)) {
            console.log("Erro no registro do usuário!");
            return res.status(HTTP_INTERNAL_ERROR).send(
                {message: "Preencha todos os campos!"}
            );
        }

        if (/\d/.test(name)) {
            console.log("Erro no registro do nome!");
            return res.status(HTTP_INTERNAL_ERROR).send(
                {message: "Nome inválido!"}
            );
        }

        if(!(email.includes("@") && (email.endsWith(".com") || email.endsWith(".br"))) ){
            return res.status(HTTP_INTERNAL_ERROR).send(
                {message: "Erro no email fornecido!"}
            );
        }

        if(password.length < 6){
            console.log("Senha com menos de 6 caracteres!");
            return res.status(HTTP_INTERNAL_ERROR).send(
                {message: "Sua senha precisa ter pelo menos 6 caracteres!"}
            );
            
        }

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
        return res.status(HTTP_INTERNAL_ERROR).send({message: "Ocorreu um erro no registro"});
        
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
            if(maleta == null){
                return res.status(HTTP_INTERNAL_ERROR).send(
                    {message: "Não existe uma maleta com o nome "+name+"!"}
                );
            }
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        return res.status(HTTP_OK).json(maleta);
    },


    // GET
    async getMaletasByGrupo(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { name } = req.params

        try{
            var data = [];
            var grupo = await Grupo.findOne({email: email, name: name})
            for(var i = 0; i < grupo.maletas.length; i++){
                const maleta = await Maleta.findOne({_id: grupo.maletas[i], email: email});
                data.push(maleta);
            }
            return res.status(HTTP_OK).json(data);
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }
        
    },


    // POST
    async createMaleta(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { name, value, prefix } = req.body;

        if (!(name && value && prefix)) {
            console.log("Erro na criação da maleta!");
            return res.status(HTTP_INTERNAL_ERROR).send(
                {message: "Todos os campos devem ser preenchidos!"}
            );
        }

        try{
            const maleta = await Maleta.exists({email: email, name: name})
            if(maleta){
                console.log("Já existe uma maleta com esse nome!");
                return res.status(HTTP_INTERNAL_ERROR).send();
            }
        }catch(error){ }

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


    // DELETE
    async removeMaletaByName(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { name } = req.params
        
        var maleta;
        var id_maleta;

        try{
            maleta = await Maleta.findOne({email: email, name: name})
            id_maleta = maleta._id;
            var grupos = await Grupo.find({email: email})
            for(var i=0; i<grupos.length; i++){
                const index = grupos[i].maletas.indexOf(maleta._id);
                if(index >= 0){
                    grupos[i].maletas.splice(index, 1)
                    await grupos[i].save()
                }
            }
            await maleta.remove();
        }catch(error){
            console.log("Ocorreu um erro durante a remoção da maleta!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        try{
            var registros = await Registro.find({email: email, id_maleta: id_maleta})
            for(var i=0; i<registros.length; i++){
                await registros[i].remove();
            }
        }catch(error){
            console.log("Ocorreu um erro durante a remoção da maleta!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

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


    // PUT
    async removeMaletaFromGrupo(req, res){

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email    

        const { name, id } = req.params;

        try{
            var grupo = await Grupo.findOne({email: email, name: name});
            for(var i=0; i<grupo.maletas.length; i++){
                if(grupo.maletas[i] === id){
                    grupo.maletas.splice(i, 1)
                    break;
                }
            }
            await grupo.save()
            return res.status(HTTP_OK).send(grupo)
        }catch(error){
            console.log("Ocorreu um erro durante a remoção da maleta!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }
    },


    // GET
    async getRegistros(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { id } = req.params

        try{
            const registros = await Registro.find({id_maleta: id, email: email});
            const data = registros;
            return res.status(HTTP_OK).json(data);
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

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

        try{
            var maleta = await Maleta.findOne({email: email, _id: id_maleta});
            maleta.value += value
            await maleta.save();
            await Registro.create(registro);
            console.log("Historico Criado: "+registro.value);
            return res.status(HTTP_CREATED).send();
        }catch(error){
            console.log("Erro na criação do Registro!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

    },


    // DELETE
    async removeRegistro(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { id } = req.params
        
        var registro;

        try{
            registro = await Registro.findOne({email: email, _id: id})
            await registro.remove();
            return res.status(HTTP_OK).send();
        }catch(error){
            console.log("Ocorreu um erro durante a remoção do Registro!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

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


    // GET
    async getGrupoByName(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { name } = req.params
        
        var grupo;

        try{
            grupo = await Grupo.findOne({email: email, name: name})
            if(grupo == null){
                return res.status(HTTP_INTERNAL_ERROR).send(
                    {message: "Não existe um grupo com o nome "+name+"!"}
                );
            }
        }catch(error){
            console.log("Ocorreu um erro durante a solicitação!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

        return res.status(HTTP_OK).json(grupo);
    },


    // POST
    async createGrupo(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { name, prefix, maletas } = req.body;

        if (!(name && prefix && maletas)) {
            //console.log("Erro na criação do grupo!");
            return res.status(HTTP_INTERNAL_ERROR).send(
                {message: "Todos os campos devem ser preenchidos!"}
            );
        }

        if(maletas.length == 0){
            return res.status(HTTP_INTERNAL_ERROR).send(
                {message: "Adicione pelo menos 1 Maleta!"}
            );
        }

        try{
            const grupo = await Grupo.exists({email: email, name: name})
            if(grupo){
                return res.status(HTTP_INTERNAL_ERROR).send(
                    {message: "Já existe um Grupo com esse nome!"}
                );
            }
        }catch(error){ }

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
        return res.status(HTTP_INTERNAL_ERROR).send(
            {message: "Houve um erro na criação do Grupo!"}
        );
    },


    // DELETE
    async removeGrupo(req, res) {

        const token = req.headers["authorization"].replace("Bearer ","");
        const decoded = jwt.verify(token, SERVER_HASHCODE);
        const email = decoded.email

        const { id } = req.params
        
        var grupo;

        try{
            grupo = await Grupo.findOne({email: email, _id: id})
            await grupo.remove();
        }catch(error){
            console.log("Ocorreu um erro durante a remoção do Grupo!");
            return res.status(HTTP_INTERNAL_ERROR).send();
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


    // GET
    getCurrencyPrice(req, res) {

        const { currency, prefix } = req.params;

        const point = "https://economia.awesomeapi.com.br/json/last/"
        const url = point + currency + "-" + prefix;

        try{
            https.get(url, (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    data = JSON.parse(data);
                    res.send({value: data[currency+""+prefix].low});
                });
            });
        }catch(error){
            console.log("Ocorreu um erro durante a comunicação com a API de preços!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }
        
    },


    // GET
    getCriptoPrice(req, res) {

        const { cripto, prefix } = req.params;

        const site = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=";
        const settings = "&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=";
        const price_change_percentage = "7d";
        const url = site + prefix + settings + price_change_percentage;

        try{
            https.get(url, (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    var value = 0
                    data = JSON.parse(data);

                    if(cripto === "BTC"){
                        value = data[0].current_price;
                    }else{
                        value = data[1].current_price;
                    }

                    res.send({value: value});
                });
            });
        }catch(error){
            console.log("Ocorreu um erro durante a comunicação com a API de preços!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }

    },


    // GET
    getCriptoHistory(req, res) {

        const site = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=";
        const currency = "brl";
        const settings = "&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=";
        const price_change_percentage = "7d";
        const url = site + currency + settings + price_change_percentage;

        try{
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
        }catch(error){
            console.log("Ocorreu um erro durante a comunicação com a API de preços!");
            return res.status(HTTP_INTERNAL_ERROR).send();
        }
        
    }

}

function generateToken(obj) {
    return jwt.sign(obj, SERVER_HASHCODE , {expiresIn: "10m"});
}

async function encryptPassword(password) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
}
