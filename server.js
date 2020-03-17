// Configurando o Servidor
const express = require("express")
const server = express()

// Configurar o Servidor para apresentar arquivos estatico
server.use(express.static('public'))

// Habilitar o Body do Formulário
server.use(express.urlencoded({ extended: true }))

// Configurar a conexão com o banco de dados
const Pool = require('pg').Pool

const db = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'doe',
})


// Configurando a Template Engine
const nunjunks = require("nunjucks")
nunjunks.configure("./", {
    express: server,
    noCache: true, //boolean ou booleano aceita 2 valores, verdadeiro ou false
})

// configurar a apresentação da página
server.get("/", function (req, res) {

    db.query("SELECT * FROM donors", function (err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })

})

server.post("/", function (req, res) {
    // pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // Coloco valores dentro do Banco de dados
    const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function (err) {
        // fluxo de erro
        if (err) {
            console.log(err)
            return res.send("erro no banco de dados.")

        }

        // fluxo ideal
        return res.redirect("/")
    })

})

server.delete("/", function (req, res) {

    
    
    const query = `
    DELETE FROM donors 
    WHERE id = { id } 
    `
    db.query()
})

server.put("/", function(req, res){

    


})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("Iniciei o Servidor")
}) 
