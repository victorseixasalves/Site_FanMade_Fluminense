// URL base da API de autenticação
const AUTH_API_URL = 'http://localhost/SiteFlu_Clean/backend/auth.php';

// Função genérica para requisições à API de autenticação
async function authRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(`${AUTH_API_URL}/${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Erro na requisição');
    return result;
}

// Verifica se o usuário está logado
async function verificarSessao() {
    try {
        return await authRequest('verificar-sessao');
    } catch {
        return { logado: false };
    }
}

// Faz login
async function fazerLogin(email, senha) {
    return authRequest('login', 'POST', { email, senha });
}

// Faz logout
async function fazerLogout() {
    return authRequest('logout', 'POST');
}

// Cadastra novo usuário
async function criarConta(nome, sobrenome, email, telefone, endereco, senha) {
    return authRequest('cadastro', 'POST', { nome, sobrenome, email, telefone, endereco, senha });
}

// Verifica se o usuário da sessão é admin
async function verificarAdmin() {
    try {
        const sessao = await verificarSessao();
        return sessao.logado && sessao.user_tipo === 'admin';
    } catch {
        return false;
    }
}

// Redireciona para login se não for admin
async function protegerPaginaAdmin() {
    const isAdmin = await verificarAdmin();
    if (!isAdmin) {
        alert('Acesso negado! Esta página é restrita a administradores.');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Atualiza o menu de perfil no topo com base no status da sessão
async function atualizarInterfaceLogin() {
    const sessao = await verificarSessao();
    const profileMenu = document.getElementById('profile-menu');

    if (profileMenu) {
        if (sessao.logado) {
            profileMenu.innerHTML = `
                <div class="user-info">
                    <span><i class="fas fa-user"></i> ${sessao.user_nome}</span>
                    <span class="user-type">${sessao.user_tipo === 'admin' ? 'Administrador' : 'Usuário'}</span>
                </div>
                <a href="#" onclick="realizarLogout()"><i class="fas fa-sign-out-alt"></i> Sair da Conta</a>
            `;
        } else {
            profileMenu.innerHTML = `
                <a href="login.html"><i class="fas fa-sign-in-alt"></i> Fazer login</a>
                <a href="cadastro.html"><i class="fas fa-user-plus"></i> Fazer Cadastro</a>
            `;
        }
    }

    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        adminLink.style.display = (sessao.logado && sessao.user_tipo === 'admin') ? 'block' : 'none';
    }
}

// Realiza logout e redireciona para home
async function realizarLogout() {
    try {
        await fazerLogout();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Inicializa a interface de login em todas as páginas
document.addEventListener('DOMContentLoaded', function () {
    atualizarInterfaceLogin();
});
