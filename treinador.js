var poke = require("./pokemon")

var pokemon = new poke

class treinador {
    constructor(nome){
    this.nome = nome;
    this.pokebola = pokemon;
    }
}

module.exports = treinador
