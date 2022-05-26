const dotenv = require('dotenv')
dotenv.config({path: "./src/vars/.env"})

const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const routes = require('./routes');

const { HTTP_UNAUTHORIZED } = require('./utils/Constants');

/* https://celke.com.br/artigo/como-permitir-acesso-a-api-com-cors-parte-7
app.use((req, res, next) => {
    //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,POST,OPTIONS');
    app.use(cors());
    next();
});

app.use((req, res, next) => {
    //console.log("Accessed Middleware!");
    next();
});
*/

app.use((req, res, next) => {
    if(req.method === "OPTIONS"){
        next();
    }else{
        //console.log("POP: "+req.method+" --- "+req.originalUrl+" --- "+req.headers["authorization"]);
        if(req.originalUrl === "/login" || req.originalUrl === "/register"){
            next();
        }else{
            if(req.headers["authorization"]){
                const token = req.headers["authorization"].replace("Bearer ","");
                if(verifyToken(token)) {
                    next();
                }else{
                    return res.status(HTTP_UNAUTHORIZED).send()
                }
            }else{
                console.log("Sem Token!");
                return res.status(403).json({ error: 'No credentials sent!' });
            }
        }
    }
});




function verifyToken(token){
    try{
        const decoded = jwt.verify(token, 'hash_unica_do_servidor'); // process.env.SERVER_HASHCODE
        return true;
    }catch(error){
        console.log("Token Inválido!");
        return false;
    }
}




app.use(cors());
app.use(express.json());
app.use(routes);

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.twtrr.mongodb.net/fintrack?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 3000;

mongoose.connect(DB_CONNECTION,).then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}).catch((err) =>
    console.log('Não foi possível conectar ao banco!')
);