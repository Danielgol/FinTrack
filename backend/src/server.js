const express = require('express');
const cors = require('cors')
const app = express();

const routes = require('./routes');  // Since the file is index.js we don't need to specify

/* https://celke.com.br/artigo/como-permitir-acesso-a-api-com-cors-parte-7
app.use((req, res, next) => {
    //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,POST,OPTIONS');
    app.use(cors());
    next();
});
*/

app.use((req, res, next) => {
    //console.log("Accessed Middleware!");
    next();
});

app.use(cors());
app.use(express.json());
app.use(routes);  // All routes defined on the routes/index.js file will be added to the app here

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
