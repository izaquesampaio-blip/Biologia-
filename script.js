// Objeto de Gerenciamento do Progresso (Estado do Jogo)
const estadoJogo = {
    pistasDescobertas: new Set(),
    totalRequerido: 4
};

// Dados estruturados baseados rigorosamente nas instruções do caso real
const bancoPistas = {
    1: {
        nome: "Corpos de terno",
        descricao: "Dois técnicos em eletrônica, Manoel Pereira da Cruz e Miguel José Viana, encontrados mortos sem sinais de violência física.",
        slotId: "slot-1",
        hotspotId: "pista-corpos"
    },
    2: {
        nome: "Máscaras de Chumbo",
        descricao: "Máscaras artesanais de chumbo para proteção dos olhos.",
        slotId: "slot-2",
        hotspotId: "pista-mascaras"
    },
    3: {
        nome: "Água Mineral",
        descricao: "Uma garrafa de água vazia com comprovante de devolução da cidade de Campos dos Goytacazes.",
        slotId: "slot-3",
        hotspotId: "pista-garrafa"
    },
    4: {
        nome: "Caderneta Secreta",
        descricao: "O item mais importante. Bilhete real traduzido em texto corrido:",
        transcricao: "16:30hs está no local determinado. 18:30hs ingerir as cápsulas, após o efeito proteger os olhos aguardar sinal que pacto.",
        slotId: "slot-4",
        hotspotId: "pista-caderneta"
    }
};

// Executada ao interagir com os pontos quentes do cenário
function investigarPista(id) {
    const pista = bancoPistas[id];
    if (!pista || estadoJogo.pistasDescobertas.has(id)) return;

    // Remove a mensagem por padrão ao colher a primeira evidência
    if (estadoJogo.pistasDescobertas.size === 0) {
        document.getElementById('notas-dinamicas').innerHTML = '';
    }

    // Registra a descoberta no Estado do Jogo
    estadoJogo.pistasDescobertas.add(id);

    // Efeito Visual na Cena do Crime
    document.getElementById(pista.hotspotId).classList.add('descoberto');

    // Desbloqueio e Atualização de Item no Inventário
    const elementoSlot = document.getElementById(pista.slotId);
    elementoSlot.textContent = id === 2 ? "M. Chumbo" : pista.nome.split(" ")[0]; // Nome reduzido para caber no slot
    elementoSlot.classList.add('coletado');
    elementoSlot.title = id === 2 ? pista.descricao : pista.nome;

    // Impressão da pista no Bloco de Notas (Papel de Carta Antigo)
    const containerNotas = document.getElementById('notas-dinamicas');
    const elementoEntrada = document.createElement('div');
    elementoEntrada.className = "entrada-pista";
    
    if (id === 4) {
        // Formato específico para a caderneta
        elementoEntrada.innerHTML = `<strong>• Pista: ${pista.nome}</strong> — ${pista.descricao} <div class="transcricao-real">"${pista.transcricao}"</div>`;
    } else {
        elementoEntrada.innerHTML = `<strong>• Pista: ${pista.nome}</strong> — ${pista.descricao}`;
    }
    containerNotas.appendChild(elementoEntrada);

    // Validação da Condição de Vitória
    checarCondicaoVitoria();
}

// Verifica se as 4 pistas foram coletadas para ativar o formulário de teorias
function checarCondicaoVitoria() {
    if (estadoJogo.pistasDescobertas.size === estadoJogo.totalRequerido) {
        document.getElementById('formulario-conclusao').style.display = 'block';
    }
}

// Executado ao submeter o formulário final de conclusões
function emitirRelatorioFinal(event) {
    event.preventDefault();
    
    // Oculta o formulário de decisão após o envio do relatório
    document.getElementById('formulario-conclusao').style.display = 'none';
    
    // Revela a mensagem instigante do mistério real arquivado
    document.getElementById('desfecho-historico').style.display = 'block';
}

// Reseta o jogo completo limpando cache, inventário e formulários
function reiniciarInvestigacao() {
    estadoJogo.pistasDescobertas.clear();

    // Limpa registros do bloco de notas
    document.getElementById('notas-dinamicas').innerHTML = '<p class="nota-inicial">Nenhuma evidência analisada ainda. Vasculhe o Morro do Vintém ao lado...</p>';
    
    // Oculta blocos finais
    document.getElementById('formulario-conclusao').style.display = 'none';
    document.getElementById('desfecho-historico').style.display = 'none';

    // Reseta elementos visuais dos Hotspots e Slots
    for (const chave in bancoPistas) {
        const pista = bancoPistas[chave];
        document.getElementById(pista.hotspotId).classList.remove('descoberto');
        
        const elSlot = document.getElementById(pista.slotId);
        elSlot.textContent = "Vazio";
        elSlot.classList.remove('coletado');
        elSlot.removeAttribute('title');
    }
}

