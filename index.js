var user = require("readline-sync")
var axios = require("axios")

var treinador = user.question("Treinador: ")
var id = user.question("Digite o ID ou nome do pokemon para mais informacoes: ")

axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then(resultado =>{
        console.log(`Parabens ${treinador}, o pokemon pesquisado foi: `);
        console.log(resultado.data.name);
        console.log(resultado.data.types);
        console.log(resultado.data.abilities);
    })

    .catch(erro =>{
        console.log(erro)
    })