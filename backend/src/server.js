const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const routes = require('./routes');

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

app.use(cors());
app.use(express.json());
app.use(routes);


const DB_USER = 'dcrosa';
const DB_PASSWORD = encodeURIComponent('202N81dVA0TOzVaI');
const PORT = process.env.PORT || 3000;

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.twtrr.mongodb.net/fintrack?retryWrites=true&w=majority`,
    ).then(() => {

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    }).catch((err) => console.log('Não foi possível conectar ao banco!'))