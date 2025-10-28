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
    return Math.floor(Math.random() * (lados)) + 1;
}

function sortearTabela(tabela) {
    return tabela[Math.floor(Math.random() * tabela.length)];
}

function numD(num, lados) {

    let acumulador = 0;

    for (let indice = 0; indice < num; indice++) {
        acumulador += d(lados)
    }

    return acumulador;
}

function interpretarDados(texto) {

    const result = texto.replace(/(\d+)[dD](\d+)/g, (match, a, b) => {
        return numD(Number(a), Number(b));
    });

    return result;
}

function rolarTabelas(tabelas) {

    //console.debug(tabelas);

    const roupas = interpretarDados(sortearTabela(tabelas["roupas"]));
    const defesas = interpretarDados(sortearTabela(tabelas["defesas"]));
    const armas = interpretarDados(sortearTabela(tabelas["armas"]));

    const resultado = { roupas: roupas, defesas: defesas, armas: armas }

    //console.debug(resultado);

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
    //console.debug(classe);

    const rolagem_agilidade = rolagemAtributo(classe);
    const agilidade = modificador(rolagem_agilidade);
    //console.debug(rolagem_agilidade, agilidade);

    const rolagem_fisico = rolagemAtributo(classe);
    const fisico = modificador(rolagem_fisico);
    //console.debug(rolagem_fisico, fisico);

    const rolagem_mental = rolagemAtributo(classe);
    const mental = modificador(rolagem_mental);
    //console.debug(rolagem_mental, mental);

    const rolagem_vida = rolagemVida(classe);
    const vida = rolagem_vida + agilidade + fisico + mental;
    //console.debug(rolagem_vida, vida);

    const carga_padrao = 10 + fisico;
    const carga_maxima = carga_padrao * 2;
    //console.debug(carga_padrao, carga_maxima);

    const comida_agua = d(6);
    const agua_suja = d(2)%2 === 0;
    //console.debug(d(2));
    //console.debug(comida_agua, agua_suja);

    const { roupas, defesas, armas } = rolarTabelas(tabelas);

    const personagem = {
        agilidade: agilidade, fisico: fisico,
        mental: mental, rolagem_vida: rolagem_vida,
        vida: vida, carga_padrao: carga_padrao,
        carga_maxima: carga_maxima, comida_agua: comida_agua,
        agua_suja: agua_suja, roupas: roupas,
        defesas: defesas, armas: armas, classe: classe
    };

    //console.debug(personagem);

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
        ('armas' in tabelas) &&
        ('letras' in tabelas) &&
        (Object.keys(tabelas['letras']).length === 26))) return false;

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

    //alterar texto trash
    textoTrashPagina(tabelas);
}

function habilitarGeracao(tabelas) {

    const botaoGerar = document.getElementById('gerar');
    const seletorClasse = document.getElementById('classe');

    botaoGerar.addEventListener('click', () => preencherPersonagem(tabelas));
    seletorClasse.addEventListener('change', () => preencherPersonagem(tabelas));

    botaoGerar.disabled = false;
}

function textoTrash(texto, letras, porcentagem) {
    return texto.split('').map(ch => {

        if (Math.random() < porcentagem) {

            const upper = ch.toUpperCase();
            const opcoes = letras[upper];
            if (opcoes) return opcoes[Math.floor(Math.random() * opcoes.length)];
            return ch;
        
        } else {

            return ch;
        }

    }).join('');
}

function textoTrashPagina(tabelas) {

    const textosTrash = document.querySelectorAll('.text-trash');

    for (texto of textosTrash) {

        if (!('plaintext' in texto.dataset)) {
            texto.dataset.plaintext = texto.textContent;
        }

        texto.textContent = textoTrash(texto.dataset.plaintext, tabelas['letras'], 0.4);
    }
}

function debug(tabelas) {

    const debug = document.getElementById('debug-section');

    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    const p4 = document.createElement('p');
    const p5 = document.createElement('p');
    const p6 = document.createElement('p');

    const porcentagem = 0.4;

    p1.textContent = textoTrash('The quick brown fox jumps over the lazy dog', tabelas['letras'], porcentagem);
    p2.textContent = textoTrash('The five boxing wizards jump quickly', tabelas['letras'], porcentagem);
    p3.textContent = textoTrash('Sphinx of black quartz, judge my vow', tabelas['letras'], porcentagem);
    p4.textContent = textoTrash('Waltz, bad nymph, for quick jigs vex', tabelas['letras'], porcentagem);
    p5.textContent = textoTrash('How quickly daft jumping zebras vex', tabelas['letras'], porcentagem);
    p6.textContent = textoTrash('Pack my box with five dozen liquor jugs', tabelas['letras'], porcentagem);

    p1.classList.add('fs-6');
    p2.classList.add('fs-5');
    p3.classList.add('fs-4');
    p4.classList.add('fs-3');
    p5.classList.add('fs-2');
    p6.classList.add('fs-1');

    debug.appendChild(p1);
    debug.appendChild(p2);
    debug.appendChild(p3);
    debug.appendChild(p4);
    debug.appendChild(p5);
    debug.appendChild(p6);

    debug.hidden = false;
}

function downloadFromURL(url, filename) {

    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    anchor.click();
}

function habilitarSalvamento() {

    const salvar = document.getElementById('salvar');

    salvar.addEventListener('click', () => {

        const ficha = document.getElementById('ficha');

        html2canvas(ficha).then(canvas => {

            const imgDataURL = canvas.toDataURL('image/png');

            downloadFromURL(imgDataURL, 'ficha.png')
        });
    });

    salvar.disabled = false;
}

document.addEventListener('DOMContentLoaded', () => {
    // Code here runs once, after the DOM is loaded
    console.debug('TRASH!');

    carregarJSON('tabelas.json').then(resultado => {
        if (resultado.sucesso && verificarTabelas(resultado.dados)) {

            textoTrashPagina(resultado.dados);

            habilitarGeracao(resultado.dados);

            preencherPersonagem(resultado.dados);

            habilitarSalvamento();

        } else {

            throw new Error('Problema nas tabelas');
        }
    });

});