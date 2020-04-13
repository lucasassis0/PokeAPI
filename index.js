var user = require("readline-sync")
var axios = require("axios")
var fs = require("fs")
var tr = require("./treinador")
var poke = require("./pokemon")


menu()

function menu() {
    var x = user.questionInt("1.Procurar Pokemon\n2.Pesquisar Pokedex\n3.Pesquisar passiva\n4.Mostrar tipo\n5.Mostrar pokemons do mesmo tipo\n6.Sair\nEscolha uma opcao: ")
    if (x === 1) {
        procuraPokemon()
    }else if(x == 2){
        consultaPokedex()
    }else if(x === 3){
        pegaPassiva()
    }else if(x === 4){
        mostraTipo()
    }else if(x === 5){
        mostrarMesmoTipo()
    }else if(x === 6){
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
    menu()
}

function pegaPassiva() {
    var id = user.question("Digite o ID ou nome do pokemon para mais informacoes: ")

    axios.get(`https://pokeapi.co/api/v2/ability/${id}/`)
        .then(resultado => {
            var passiva = resultado.data.effect_entries

            for (let i = 0; i < passiva.length; i++) {
                console.log("\n" + passiva[i].effect)                
            }
            menu()
        })
        .catch(erro => {
            console.log(erro);
            menu()
        })
}

function mostraTipo() {
    var id = user.question("Digite o ID ou nome do tipo: ")
    
    axios.get(`https://pokeapi.co/api/v2/type/${id}/`)
        .then(resultado => {
            var relacoes = resultado.data.damage_relations
            console.log(`Tipo: ${resultado.data.name}\n`)

            console.log(`Recebe o dobro do dano de pokemons do tipo: ${doubleFrom(relacoes).join(', ')}`);
            console.log(`Aplica o dobro do dano em pokemons do tipo: ${doubleTo(relacoes).join(', ')}\n`);
            console.log(`Recebe a metade do dano de pokemons do tipo: ${halfFrom(relacoes).join(', ')}`);
            console.log(`Aplica a metade do dano em pokemons do tipo: ${halfTo(relacoes).join(', ')}\n`);
            console.log(`Não recebe dano de pokemons do tipo: ${noFrom(relacoes).join(', ')}`);
            console.log(`Não aplica dano em pokemons do tipo: ${noTo(relacoes).join(', ')}\n`);

            menu()
        })

        .catch(erro => {
            console.log(erro);
            menu()
        })    
}

function doubleFrom(relacoes) {
    var arr = []
    
    for (let i = 0; i < relacoes.double_damage_from.length; i++) {
        arr[i] = relacoes.double_damage_from[i].name
    }

    return arr
}

function doubleTo(relacoes) {
    var arr = []

    for (let i = 0; i < relacoes.double_damage_to.length; i++) {
        arr[i] = relacoes.double_damage_to[i].name
    }

    return arr
}

function halfFrom(relacoes) {
    var arr = []

    for (let i = 0; i < relacoes.half_damage_from.length; i++) {
        arr[i] = relacoes.half_damage_from[i].name
    }

    return arr
}

function halfTo(relacoes) {
    var arr = []

    for (let i = 0; i < relacoes.half_damage_to.length; i++) {
        arr[i] = relacoes.half_damage_to[i].name
    }

    return arr
}

function noFrom(relacoes) {
    var arr = []

    for (let i = 0; i < relacoes.no_damage_from.length; i++) {
        arr[i] = relacoes.no_damage_from[i].name
    }

    return arr
}

function noTo(relacoes) {
    var arr = []

    for (let i = 0; i < relacoes.no_damage_to.length; i++) {
        arr[i] = relacoes.no_damage_to[i].name
    }

    return arr
}

function mostrarMesmoTipo(){
    var id = user.question("Digite o ID ou nome do tipo: ")
    
    axios.get(`https://pokeapi.co/api/v2/type/${id}/`)
        .then(resultado => {
                console.log(`\nTipo: ${resultado.data.name}`)

                var arr = []
                resultado.data.pokemon.forEach(element => {
                    arr.push(element.pokemon.name)
                });

                console.log('\n' + arr.join(', ') + '\n');

                menu()
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