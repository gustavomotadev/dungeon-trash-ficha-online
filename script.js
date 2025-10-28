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

function sortearTabela(tabela) {
    return tabela[Math.floor(Math.random() * tabela.length)];
}

function rolarTabelas(tabelas) {

    console.debug(tabelas);

    const roupas = sortearTabela(tabelas["roupas"]);
    const defesas = sortearTabela(tabelas["defesas"]);
    const armas = sortearTabela(tabelas["armas"]);

    const resultado = { roupas: roupas, defesas: defesas, armas: armas }

    console.log(resultado);

    return resultado;
}

function rolagemAtributo(classe) {

    if (classe === 'sem') {

        const rolagem1 = d(6);
        const rolagem2 = d(6);
        const rolagem3 = d(6);
        const rolagem4 = d(6);

        return rolagem1 + rolagem2 + rolagem3 + rolagem4 - Math.min(
            rolagem1, rolagem2, rolagem3, rolagem4
        );

    } else {

        return d(6) + d(6) + d(6);
    }
}

function rolagemVida(classe) {

    if (classe === 'forjado') {

        return d(6) + d(6) + d(6);

    } else {

        return d(6) + d(6);
    }
}

function gerarPersonagem(tabelas) {

    const classe = document.getElementById('classe').value;
    console.debug(classe);

    const rolagem_agilidade = rolagemAtributo(classe);
    const agilidade = modificador(rolagem_agilidade);
    console.log(rolagem_agilidade, agilidade);

    const rolagem_fisico = rolagemAtributo(classe);
    const fisico = modificador(rolagem_fisico);
    console.log(rolagem_fisico, fisico);

    const rolagem_mental = rolagemAtributo(classe);
    const mental = modificador(rolagem_mental);
    console.log(rolagem_mental, mental);

    const rolagem_vida = rolagemVida(classe);
    const vida = rolagem_vida + agilidade + fisico + mental;
    console.log(rolagem_vida, vida);

    const carga_padrao = 10 + fisico;
    const carga_maxima = carga_padrao * 2;
    console.log(carga_padrao, carga_maxima);

    const comida_agua = d(6);
    const agua_suja = d(2) > 0;
    console.debug(comida_agua, agua_suja);

    const { roupas, defesas, armas } = rolarTabelas(tabelas);

    const personagem = {
        agilidade: agilidade, fisico: fisico,
        mental: mental, rolagem_vida: rolagem_vida,
        vida: vida, carga_padrao: carga_padrao,
        carga_maxima: carga_maxima, comida_agua: comida_agua,
        agua_suja: agua_suja, roupas: roupas,
        defesas: defesas, armas: armas, classe: classe
    };

    console.debug(personagem);

    return personagem;
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

function verificarTabelas(tabelas) {

    if (!(('roupas' in tabelas) &&
        ('defesas' in tabelas) &&
        ('armas' in tabelas))) return false;

    return true;
}

function preencherPersonagem(tabelas) {

    const personagem = gerarPersonagem(tabelas);

    // esconder e mostrar elementos de classe
    if (personagem.classe === 'senhor') {

        document.getElementById('perito').hidden = false;
        document.getElementById('tocado').hidden = true;

    } else if (personagem.classe === 'subversivo') {

        document.getElementById('perito').hidden = true;
        document.getElementById('tocado').hidden = false;

    } else {

        document.getElementById('perito').hidden = true;
        document.getElementById('tocado').hidden = true;
    }

    // preencher atributos
    document.getElementById('agilidade').textContent = String(personagem.agilidade);
    document.getElementById('fisico').textContent = String(personagem.fisico);
    document.getElementById('mental').textContent = String(personagem.mental);

    //preencher vida
    let dadosVida = 2;
    if (personagem.classe === 'forjado') dadosVida = 3;
    document.getElementById('vida-dados').textContent = String(dadosVida);
    document.getElementById('vida-rolagem').textContent = String(personagem.rolagem_vida);
    document.getElementById('vida-total').textContent = String(personagem.vida);

    //preencher carga
    document.getElementById('carga-padrao').textContent = String(personagem.carga_padrao);
    document.getElementById('carga-maxima').textContent = String(personagem.carga_maxima);

    //preencher comida e agua
    document.getElementById('comida-agua').textContent = String(personagem.comida_agua);
    if (personagem.agua_suja) {
        document.getElementById('agua-suja').hidden = false;
    } else {
        document.getElementById('agua-suja').hidden = true;
    }

    //preencher inventário
    document.getElementById('roupas').textContent = personagem.roupas;
    document.getElementById('defesas').textContent = personagem.defesas;
    document.getElementById('armas').textContent = personagem.armas;
}

function habilitarGeracao(tabelas) {

    const botaoGerar = document.getElementById('gerar');
    const seletorClasse = document.getElementById('classe');

    botaoGerar.addEventListener('click', () => preencherPersonagem(tabelas));
    seletorClasse.addEventListener('change', () => preencherPersonagem(tabelas));

    botaoGerar.disabled = false;
}

document.addEventListener('DOMContentLoaded', () => {
    // Code here runs once, after the DOM is loaded
    console.debug('TRASH!');

    carregarJSON('tabelas.json').then(resultado => {
        if (resultado.sucesso && verificarTabelas(resultado.dados)) {

            habilitarGeracao(resultado.dados);
        
        } else {

            throw new Error('Problema nas tabelas');
        }
    });

});