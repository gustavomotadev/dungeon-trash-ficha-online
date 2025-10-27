function modificador(rolagem) {

    if (rolagem < 5) return -3;
    else if (rolagem < 7) return -2;
    else if (rolagem < 9) return -1;
    else if (rolagem < 12) return 0;
    else if (rolagem < 15) return 1;
    else if (rolagem < 17) return 2;
    else return 3;
}

function d(lados) {
    return Math.floor(Math.random() * (lados + 1));
}

function rolarTabelas() {

}

function gerarPersonagem(tabelas) {

    console.debug(tabelas);

    let classe = document.getElementById('classe').value;
    console.debug(classe);

    let rolagem_agilidade = d(6) + d(6) + d(6);
    let agilidade = modificador(rolagem_agilidade);
    console.log(rolagem_agilidade, agilidade);

    let rolagem_fisico = d(6) + d(6) + d(6);
    let fisico = modificador(rolagem_fisico);
    console.log(rolagem_fisico, fisico);

    let rolagem_mental = d(6) + d(6) + d(6);
    let mental = modificador(rolagem_mental);
    console.log(rolagem_mental, mental);

    let rolagem_vida = d(6) + d(6);
    let vida = rolagem_vida + agilidade + fisico + mental;
    console.log(rolagem_vida, vida);

    let carga_padrao = 10 + fisico;
    let carga_maxima = carga_padrao * 2;
    console.log(carga_padrao, carga_maxima);

    let comida_agua = d(6);
    let agua_suja = d(2) > 0;
    console.debug(comida_agua, agua_suja);
}

async function carregarJSON(caminho) {

    try {
        const resposta = await fetch(caminho);
        const dados = await resposta.json();
        return { sucesso: true, dados };
    } catch (erro) {
        console.error('Erro ao carregar JSON:', erro);
        return { sucesso: false, dados: null };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Code here runs once, after the DOM is loaded
    console.debug('TRASH!');

    carregarJSON('tabelas.json').then(resultado => {
        if (resultado.sucesso) gerarPersonagem(resultado.dados);
    });

});