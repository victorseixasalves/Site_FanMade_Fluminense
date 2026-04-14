// URL da API de notícias (utilizada também pelo admin)
const NEWS_API_URL = 'http://localhost/SiteFlu_Clean/backend/noticias.php';

// Função genérica para requisições à API de notícias
async function newsRequest(params = '', method = 'GET', data = null) {
    const url = params ? `${NEWS_API_URL}${params}` : NEWS_API_URL;
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(url, options);
    const result   = await response.json();
    if (!response.ok) throw new Error(result.message || 'Erro na requisição');
    return result;
}

// Alterna entre as seções do painel admin (elenco / notícias)
function showSection(section) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));

    document.querySelector(`[onclick="showSection('${section}')"]`).classList.add('active');
    document.getElementById(`${section}-section`).classList.add('active');

    if (section === 'noticias') loadNews();
    else if (section === 'elenco') loadPlayers();
}

// Carrega e renderiza a lista de notícias na tabela
async function loadNews() {
    const loading   = document.getElementById('loading-news');
    const newsTable = document.getElementById('news-table');

    loading.style.display   = 'block';
    newsTable.style.display = 'none';

    try {
        const response = await newsRequest();
        if (response.success && response.data) {
            displayNews(response.data);
            newsTable.style.display = 'table';
        } else {
            showAlert('Erro ao carregar notícias', 'error');
        }
    } catch {
        showAlert('Erro de conexão ao carregar notícias', 'error');
    } finally {
        loading.style.display = 'none';
    }
}

// Renderiza as notícias na tabela
function displayNews(noticias) {
    const tbody = document.getElementById('news-tbody');
    tbody.innerHTML = '';

    noticias.forEach(noticia => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(noticia.data)}</td>
            <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
                title="${noticia.titulo}">${noticia.titulo}</td>
            <td><span style="background:#8B0000;color:white;padding:4px 8px;border-radius:4px;font-size:12px;">${noticia.tema}</span></td>
            <td>
                <img src="imagens_noticias/${noticia.imagem_capa}" alt="Imagem" class="news-image-preview" onerror="this.src='news1.jpg'">
            </td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editNews(${noticia.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteNews(${noticia.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Formata uma data ISO para o padrão pt-BR
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Abre o modal para adicionar nova notícia
function openAddNewsModal() {
    document.getElementById('news-modal-title').textContent = 'Adicionar Notícia';
    document.getElementById('newsForm').reset();
    document.getElementById('news-id').value = '';
    document.getElementById('news-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('newsModal').style.display = 'block';
}

// Fecha o modal de notícias
function closeNewsModal() {
    document.getElementById('newsModal').style.display = 'none';
}

// Carrega dados de uma notícia no modal para edição
async function editNews(id) {
    try {
        const response = await newsRequest(`?id=${id}`);
        if (!response.success || !response.data) {
            showAlert('Erro ao carregar dados da notícia', 'error');
            return;
        }

        const n = response.data;
        document.getElementById('news-modal-title').textContent = 'Editar Notícia';
        document.getElementById('news-id').value      = n.id;
        document.getElementById('news-date').value    = n.data;
        document.getElementById('news-title').value   = n.titulo;
        document.getElementById('news-theme').value   = n.tema;
        document.getElementById('news-image').value   = n.imagem_capa;
        document.getElementById('news-summary').value = n.texto_resumido;
        document.getElementById('news-content').value = n.texto_noticia;
        document.getElementById('newsModal').style.display = 'block';
    } catch {
        showAlert('Erro de conexão ao carregar notícia', 'error');
    }
}

// Exclui uma notícia após confirmação
async function deleteNews(id) {
    if (!confirm('Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.')) return;

    try {
        const response = await newsRequest(`?id=${id}`, 'DELETE');
        if (response.success) {
            showAlert('Notícia excluída com sucesso!', 'success');
            loadNews();
        } else {
            showAlert(response.message || 'Erro ao excluir notícia', 'error');
        }
    } catch {
        showAlert('Erro de conexão ao excluir notícia', 'error');
    }
}

// ── Inicialização ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    loadNews();

    document.getElementById('newsForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const newsId = document.getElementById('news-id').value;
        const newsData = {
            data:           document.getElementById('news-date').value,
            titulo:         document.getElementById('news-title').value,
            tema:           document.getElementById('news-theme').value,
            imagem_capa:    document.getElementById('news-image').value,
            texto_resumido: document.getElementById('news-summary').value,
            texto_noticia:  document.getElementById('news-content').value,
        };

        try {
            const response = newsId
                ? await newsRequest(`?id=${newsId}`, 'PUT', newsData)
                : await newsRequest('', 'POST', newsData);

            if (response.success) {
                showAlert(response.message, 'success');
                closeNewsModal();
                loadNews();
            } else {
                showAlert(response.message || 'Erro ao salvar notícia', 'error');
            }
        } catch {
            showAlert('Erro de conexão ao salvar notícia', 'error');
        }
    });

    window.addEventListener('click', function (e) {
        if (e.target === document.getElementById('newsModal')) closeNewsModal();
    });
});
