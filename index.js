var user = require("readline-sync")
var axios = require("axios")
var fs = require("fs")

menu()

function menu() {
    var x = user.questionInt("1.Pesquisar Pokemon\n2.Sair\nEscolha uma opcao: ")
    if (x === 1) {
        pesquisaPokemon()
    }else if(x === 2){
        process.exit()
    }
}

function pegaTipo(tipo) {
    var type = []
    for (let i = 0; i < tipo.length; i++) {
        type[i] = tipo[i].type.name
    }
    return type
}

function pegaHabilidade(habilidades) {
    var ab = []
    for (let i = 0; i < habilidades.length; i++) {
        ab[i] = habilidades[i].ability.name
    }
    return ab
}

var pokemon = new Object() 
pokemon = {
    nome: "",
    tipo: [],
    habilidades: []
}


var treinador = new Object()
treinador = {
    nome: "",
    pokebola: [pokemon]
}

function pesquisaPokemon() {
    treinador.nome = user.question("Treinador: ")
    var id = user.question("Digite o ID ou nome do pokemon para mais informacoes: ")
    
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then(resultado =>{
            console.log(`\nParabens ${treinador}, o pokemon pesquisado foi: `);
        
            nome = resultado.data.name.toUpperCase()

            console.log("\nPokemon: " + nome);
        
            tipo = resultado.data.types
            console.log("\nTipo: " + pegaTipo(tipo).join(', '));
        
            habilidades = resultado.data.abilities
            console.log("\nHabilidades: " + pegaHabilidade(habilidades).join(', '));
            
            perguntaSalvar(treinador, nome, tipo, habilidades)
        })

        .catch(erro =>{
            console.log(erro)
        })
}

function perguntaSalvar(treinador) {
    var r = user.question('Deseja salvar o Pokemon pesquisado em sua pokedex? (S/N)\n==> ')
    if (r.trim().toUpperCase().charAt(0) === 'S'){
        salvar(treinador, nome, tipo, habilidades)
    }else if(r.trim().toUpperCase().charAt(0) === 'N'){
        menu()
    }else{
        console.log("Alternativa invalida, favor selecionar apenas S ou N !!");
        perguntaSalvar()
    }
}

function salvar(treinador, nome, tipo, habilidades) {
    //treinador.pokebola[treinador.pokebola.length].pokemon.name.push(nome)
    //treinador.pokebola[treinador.pokebola.length].pokemon.
    treinador = {
        pokebola: {
            nome: nome,
            tipo: pegaTipo(tipo),
            habilidades: pegaHabilidade(habilidades)
        }
    }
    
    var jsonSerializado = JSON.stringify(treinador)
    var path = './treinadores.json'
    fs.writeFileSync(jsonSerializado,path)
}