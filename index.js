var user = require("readline-sync")
var axios = require("axios")
var fs = require("fs")
var tr = require("./treinador")
var poke = require("./pokemon")


menu()

function menu() {
    var x = user.questionInt("1.Procurar Pokemon\n2.Pesquisar Pokedex\n3.Sair\nEscolha uma opcao: ")
    if (x === 1) {
        procuraPokemon()
    }else if(x == 2){
        consultaPokedex()
    }else if(x === 3){
        process.exit()
    }
}

function procuraPokemon() {
    var treinador = new tr
    var pokemon = new poke
    
    treinador.pokebola.push(pokemon)

    treinador.nome = user.question("Treinador: ")

    var id = user.question("Digite o ID ou nome do pokemon para mais informacoes: ")
    
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then(resultado =>{
            console.log(`\nParabens ${treinador.nome}, o pokemon pesquisado foi: `);
            console.log(resultado);
            pokemon.nome = resultado.data.name.toUpperCase()

            console.log("\nPokemon: " + pokemon.nome);
            
            var tipo = resultado.data.types

            for (let i = 0; i < tipo.length; i++) {
                pokemon.tipo[i] = tipo[i].type.name
            }
            
            console.log("\nTipo: " + pokemon.tipo.join(', ') + "\n");

            var habilidades = resultado.data.abilities
            
            for (let i = 0; i < habilidades.length; i++) {
                pokemon.habilidades[i] = habilidades[i].ability.name
            }

            console.log("\nHabilidades: " + pokemon.habilidades.join(', ') + "\n");
            
            perguntaSalvar(treinador)
        })

        .catch(erro =>{
            console.log(erro)
        })
}

function perguntaSalvar(treinador) {
    var r = user.question('Deseja salvar o Pokemon pesquisado em sua pokedex? (S/N)\n==> ')
    if (r.trim().toUpperCase().charAt(0) === 'S'){
        arr.push(treinador)
        salvar(arr)
    }else if(r.trim().toUpperCase().charAt(0) === 'N'){
        menu()
    }else{
        console.log("Alternativa invalida, favor selecionar apenas S ou N !!");
        perguntaSalvar()
    }
}

function consultaPokedex() {
    var cons = user.question('Treinador: ')

    var jsonSerializado = fs.readFileSync('./pokedex.json')
    var treinador = JSON.parse(jsonSerializado)
    
    var i = 0
    
    treinador.forEach(element => {
        if (element.nome === cons) {
            element.pokebola.forEach(element => {
                i++
                console.log("\nPokemon: "+ element.nome)
            
                var tip = []
                element.tipo.forEach(element => {
                    tip.push(element)
                })
                console.log("Tipo: " + tip.join(', '))

                var hab = []
                element.habilidades.forEach(element => {
                    hab.push(element)
                })
                console.log("Habilidades: " + hab.join(', ') + "\n")
            })
        }
    })
    
    if (i == 0) {
        console.log("\nO treinador procurado nao possui uma Pokedex\n")
    }

    menu()
}

var arr = []

function salvar(arr) {    
    var jsonSerializado = JSON.stringify(arr)
    var path = './pokedex.json'
    fs.writeFileSync(path, jsonSerializado)
    menu()
}