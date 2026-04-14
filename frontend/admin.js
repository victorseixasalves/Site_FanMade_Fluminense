// URL da API de elenco
const API_BASE_URL = 'http://localhost/SiteFlu_Clean/backend/api.php';

let currentEditingId = null;

const posicaoDisplay = {
    goleiro:   'Goleiro',
    zagueiro:  'Zagueiro',
    lateral:   'Lateral',
    meias:     'Meio-campo',
    atacantes: 'Atacante',
};

// Função genérica para requisições à API de elenco
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    const result   = await response.json();
    if (!response.ok) throw new Error(result.message || 'Erro na requisição');
    return result;
}

// Exibe uma mensagem de alerta na página
function showAlert(message, type = 'success') {
    const container = document.getElementById('alert-container');
    if (!container) return;

    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    container.innerHTML = `
        <div class="alert alert-${type}">
            <i class="fas fa-${icon}"></i> ${message}
        </div>
    `;
    setTimeout(() => { container.innerHTML = ''; }, 5000);
}

// Carrega e renderiza a lista de jogadores na tabela
async function loadPlayers() {
    const loading = document.getElementById('loading');
    const table   = document.getElementById('players-table');
    const tbody   = document.getElementById('players-tbody');

    loading.style.display = 'block';
    table.style.display   = 'none';

    try {
        const jogadores = await apiRequest('todos');
        tbody.innerHTML = '';

        jogadores.forEach(jogador => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="jogadores_fotos/${jogador.foto}" alt="${jogador.nome}" class="player-photo"></td>
                <td>${jogador.nome}</td>
                <td>${posicaoDisplay[jogador.posicao] || jogador.posicao}</td>
                <td>${jogador.numero}</td>
                <td>${jogador.jogos}</td>
                <td>${jogador.posicao === 'goleiro' ? '-' : jogador.gols}</td>
                <td>${jogador.posicao === 'goleiro' ? '-' : jogador.assistencias}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editPlayer(${jogador.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="delete-btn" onclick="deletePlayer(${jogador.id}, '${jogador.nome}')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        loading.style.display = 'none';
        table.style.display   = 'table';
    } catch (error) {
        loading.style.display = 'none';
        showAlert('Erro ao carregar jogadores: ' + error.message, 'error');
    }
}

// Abre o modal para adicionar um novo jogador
function openAddModal() {
    currentEditingId = null;
    document.getElementById('modal-title').textContent = 'Adicionar Jogador';
    document.getElementById('playerForm').reset();
    document.getElementById('player-id').value = '';
    togglePositionFields('');
    document.getElementById('playerModal').style.display = 'block';
}

// Carrega dados de um jogador no modal para edição
async function editPlayer(id) {
    try {
        const jogador = await apiRequest(`jogador/${id}`);
        currentEditingId = id;

        document.getElementById('modal-title').textContent = 'Editar Jogador';
        document.getElementById('player-id').value            = jogador.id;
        document.getElementById('player-name').value          = jogador.nome;
        document.getElementById('player-position').value      = jogador.posicao;
        document.getElementById('player-number').value        = jogador.numero;
        document.getElementById('player-games').value         = jogador.jogos;
        document.getElementById('player-goals').value         = jogador.gols;
        document.getElementById('player-assists').value       = jogador.assistencias;
        document.getElementById('player-saves').value         = jogador.defesas;
        document.getElementById('player-clean-sheets').value  = jogador.jogos_sem_sofrer_gol;
        document.getElementById('player-photo').value         = jogador.foto || '';

        togglePositionFields(jogador.posicao);
        document.getElementById('playerModal').style.display = 'block';
    } catch (error) {
        showAlert('Erro ao carregar dados do jogador: ' + error.message, 'error');
    }
}

// Exclui um jogador após confirmação
async function deletePlayer(id, nome) {
    if (!confirm(`Tem certeza que deseja excluir o jogador ${nome}?`)) return;

    try {
        await apiRequest(`jogador/${id}`, 'DELETE');
        showAlert(`Jogador ${nome} removido com sucesso!`);
        loadPlayers();
    } catch (error) {
        showAlert('Erro ao remover jogador: ' + error.message, 'error');
    }
}

// Fecha o modal de jogador
function closeModal() {
    document.getElementById('playerModal').style.display = 'none';
}

// Mostra/oculta campos de estatística conforme a posição selecionada
function togglePositionFields(posicao) {
    const goalsGroup      = document.getElementById('goals-group');
    const assistsGroup    = document.getElementById('assists-group');
    const goalkeeperStats = document.getElementById('goalkeeper-stats');

    if (posicao === 'goleiro') {
        goalsGroup.style.display      = 'none';
        assistsGroup.style.display    = 'none';
        goalkeeperStats.style.display = 'flex';
    } else {
        goalsGroup.style.display      = 'block';
        assistsGroup.style.display    = 'block';
        goalkeeperStats.style.display = 'none';
    }
}

// ── Inicialização ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function () {
    await protegerPaginaAdmin();
    loadPlayers();

    document.getElementById('player-position').addEventListener('change', function () {
        togglePositionFields(this.value);
    });

    document.getElementById('playerForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            nome:                 document.getElementById('player-name').value,
            posicao:              document.getElementById('player-position').value,
            numero:               parseInt(document.getElementById('player-number').value),
            jogos:                parseInt(document.getElementById('player-games').value) || 0,
            gols:                 parseInt(document.getElementById('player-goals').value) || 0,
            assistencias:         parseInt(document.getElementById('player-assists').value) || 0,
            defesas:              parseInt(document.getElementById('player-saves').value) || 0,
            jogos_sem_sofrer_gol: parseInt(document.getElementById('player-clean-sheets').value) || 0,
            foto:                 document.getElementById('player-photo').value || null,
        };

        try {
            if (currentEditingId) {
                await apiRequest(`jogador/${currentEditingId}`, 'PUT', formData);
                showAlert('Jogador atualizado com sucesso!');
            } else {
                await apiRequest('', 'POST', formData);
                showAlert('Jogador adicionado com sucesso!');
            }
            closeModal();
            loadPlayers();
        } catch (error) {
            showAlert('Erro ao salvar jogador: ' + error.message, 'error');
        }
    });

    window.addEventListener('click', function (e) {
        const modal = document.getElementById('playerModal');
        if (e.target === modal) closeModal();
    });
});
