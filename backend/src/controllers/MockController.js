const jwt = require('jsonwebtoken')

const {
    HTTP_OK,
    HTTP_NOT_FOUND,
    HTTP_CREATED,
    HTTP_UNAUTHORIZED
} = require('../utils/Constants')

const accounts = [
    {email: 'daniel', name: 'daniel carneiro', password: '123'},
    {email: 'diego', name: 'diego soares', password: '321'},
    {email: 'joao', name: 'joao cavalcanti', password: '111'},
];

const simpleDatabase = [
    {email: 'daniel', sobrenome: 'Rosa', saldo: 850},
    {email: 'diego', sobrenome: 'Pires', saldo: -1000},
    {email: 'joao', sobrenome: 'Cavalcanti', saldo: 1200},
];

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



// ID = EMAIL (MUDAR)



var tokens = [];

module.exports = {

    login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        if(userExists(email, password)){

            //const token = jwt.sign(user, 'mudarparaoutracoisa' , {expiresIn: 360})
            const token = 'eu sou um token';
            const objToken = {email: email, token: token, expiresIn: 360};
            tokens.push(objToken);

            console.log("Login Success: "+email)
            return res.status(HTTP_OK).json(objToken);
        }

        console.log("Login Failed: "+email);
        return res.status(HTTP_UNAUTHORIZED).send()
    },



    register(req, res) {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if(userExists(email, password)){
            console.log(email+" Arealdy exists!")
            return res.json({message: 'EMAIL ALREADY EXISTS'});
        }

        const user = {email: email, name: name, password: password};
        accounts.push(user);

        console.log("Register: "+name);
        return res.status(HTTP_OK).send();
    },



    getInfo(req, res) {
        if(!isRequestValid(req)){
            console.log("INVALID REQUEST!");
            return res.status(HTTP_UNAUTHORIZED).send();
        }

        const email = req.body.email;

        var info = [];
        for(var i=0; i<maletas.length; i++){
            if(maletas[i].email === email){
                info.push(maletas[i]);
            }
        }

        console.log(email+": "+info.length+" items");
        return res.status(HTTP_OK).json(info);
    },
    
}


function isRequestValid(req) {
    const id = req.body.id;
    const token = req.body.token;
    for(var i=0; i<tokens.length; i++){
        if(tokens[i].id === id){
            if(tokens[i].token === token){
                return true;
            }
            return false;
        }
    }
}

function userExists(email, password) {
    for(var i=0; i<accounts.length; i++){
        if(accounts[i].email === email){
            if(accounts[i].password === password){
                return true;
            }
            return false;
        }
    }
    return false;
}
