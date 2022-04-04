const jwt = require('jsonwebtoken')

const {
    HTTP_OK,
    HTTP_NOT_FOUND,
    HTTP_CREATED,
    HTTP_UNAUTHORIZED
} = require('../utils/Constants')

const simpleDatabase = [
    {id: 1, sobrenome: 'Rosa', saldo: 850},
    {id: 2, sobrenome: 'Pires', saldo: -1000},
    {id: 3, sobrenome: 'Cavalcanti', saldo: 1200},
];




var tokens = [];

module.exports = {

    login(req, res) {

        const email = req.body.email;
        const password = req.body.password;

        console.log("Login: "+email)

        if(userExists(email, password)){

            //const token = jwt.sign(user, 'mudarparaoutracoisa' , {expiresIn: 360})
            const token = 'eu sou um token';
            const objToken = {id: 1, token: token, expiresIn: 360};
            tokens.push(objToken);

            return res.status(HTTP_OK).json(objToken);
        }
        return res.status(HTTP_UNAUTHORIZED).send()
    },



    register(req, res) {
        const name = req.body.name;
        const password = req.body.password;
        console.log("Register: "+name);
        res.json({resp: 'FUNCIONA'});
    },



    getInfo(req, res){
        const id = req.body.id
        const token = req.body.token;
        console.log("GetInfo: "+id)
        if(isTokenValid(token)){
            var info = {}
            for(var i=0; i<simpleDatabase.length; i++){
                if(simpleDatabase[i].id == id){
                    info = simpleDatabase[i];
                    break;
                }
            }
            return res.status(HTTP_OK).json(info);
        }
        return res.status(HTTP_UNAUTHORIZED).send()
    },
    
}



function isTokenValid(token){
    for(var i=0; i<tokens.length; i++){
        if(tokens[i].token === token){
            return true;
        }
    }
    return false;
}

function userExists(email, password){
    if(email === "daniel" && password === "123"){
        return true;
    }
    return false;
}
