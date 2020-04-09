var user = require("readline-sync")
var axios = require("axios")
var fs = require("fs")
var tr = require("./treinador")

var treinador = new tr

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
    for (let i = 0; i < tipo.length; i++) {
        treinador.pokebola.tipo[i] = tipo[i].type.name
    }
    return treinador.pokebola.tipo
}

function pegaHabilidade(habilidades) {
    for (let i = 0; i < habilidades.length; i++) {
        treinador.pokebola.habilidades[i] = habilidades[i].ability.name
    }
    return treinador.pokebola.habilidades
}

function pesquisaPokemon() {
    treinador.nome = user.question("Treinador: ")
    
    var id = user.question("Digite o ID ou nome do pokemon para mais informacoes: ")
    
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then(resultado =>{
            console.log(`\nParabens ${treinador.nome}, o pokemon pesquisado foi: `);
        
            treinador.pokebola.nome = resultado.data.name.toUpperCase()

            console.log("\nPokemon: " + treinador.pokebola.nome);
        
            treinador.pokebola.tipo = resultado.data.types
            console.log("\nTipo: " + pegaTipo(treinador.pokebola.tipo).join(', '));

            treinador.pokebola.habilidades = resultado.data.abilities
            console.log("\nHabilidades: " + pegaHabilidade(treinador.pokebola.habilidades).join(', ') + "\n");
            
            perguntaSalvar(treinador)
        })

        .catch(erro =>{
            console.log(erro)
        })
}

function perguntaSalvar(treinador) {
    var r = user.question('Deseja salvar o Pokemon pesquisado em sua pokedex? (S/N)\n==> ')
    if (r.trim().toUpperCase().charAt(0) === 'S'){
        salvar(treinador)
    }else if(r.trim().toUpperCase().charAt(0) === 'N'){
        menu()
    }else{
        console.log("Alternativa invalida, favor selecionar apenas S ou N !!");
        perguntaSalvar()
    }
}

function salvar(treinador) {
    /*var json =   
    if(){

    }*/
    
    var jsonSerializado = JSON.stringify(treinador)
    var path = './pokedex.json'
    fs.writeFileSync(path, jsonSerializado)
    menu()
}