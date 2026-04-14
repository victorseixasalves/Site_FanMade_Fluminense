# 🟢 SiteFlu — Site Oficial(Fanmade) do Fluminense FC

Site fan-made do **Fluminense Football Club**, desenvolvido com HTML, CSS, JavaScript no frontend e PHP + MySQL no backend. O projeto simula um portal completo do clube com notícias, elenco, loja oficial e área de membros.

---

## 📸 Páginas do Projeto

| Página | Descrição |
|---|---|
| `index.html` | Página inicial do clube |
| `noticias.html` | Feed de notícias |
| `noticia_ampliada.html` | Notícia em detalhes |
| `clube.html` | Informações sobre o clube |
| `futebol.html` | Informações sobre futebol |
| `loja.html` | Loja oficial com produtos |
| `login.html` | Login de usuário |
| `cadastro.html` | Cadastro de novo usuário |
| `admin.html` | Painel administrativo |

---

## 🗂️ Estrutura de Pastas

```
SiteFlu_Clean/
├── frontend/
│   ├── index.html
│   ├── loja.html
│   ├── noticias.html
│   ├── admin.html
│   ├── login.html
│   ├── cadastro.html
│   ├── loja.js
│   ├── carrinho.js
│   ├── auth.js
│   ├── elenco.js
│   ├── admin.js
│   ├── admin_news.js
│   ├── jogadores_fotos/
│   ├── imagens_noticias/
│   ├── logo_times/
│   └── Patrocinadores/
├── backend/
│   ├── database.php       # Conexão com o banco
│   ├── auth.php           # Autenticação
│   ├── loja.php           # Model da loja
│   ├── loja_api.php       # API REST da loja
│   ├── noticias.php       # Notícias
│   ├── elenco.php         # Elenco
│   ├── conta.php          # Gerenciamento de conta
│   └── api.php            # API principal
└── bancoflu.sql           # Dump do banco de dados
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [XAMPP](https://www.apachefriends.org/) ou WAMP instalado
- PHP 8.2+
- MySQL / MariaDB

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/SEU_USUARIO/SiteFlu.git
```

**2. Mova para a pasta do servidor**

Coloque a pasta `SiteFlu_Clean` dentro de:
- XAMPP → `C:/xampp/htdocs/`
- WAMP → `C:/wamp64/www/`

**3. Importe o banco de dados**

- Abra o [phpMyAdmin](http://localhost/phpmyadmin)
- Crie um banco chamado `bancoflu`
- Importe o arquivo `bancoflu.sql`

**4. Configure a conexão** (se necessário)

Edite `backend/database.php`:
```php
private $host     = 'localhost';
private $db_name  = 'bancoflu';
private $username = 'root';
private $password = '';  // sua senha aqui
```

**5. Acesse no navegador**
```
http://localhost/SiteFlu_Clean/frontend/index.html
```

---

## 🔐 Acesso Admin

| Campo | Valor |
|---|---|
| E-mail | `admin@fluminense.com.br` |
| Senha | `password` |

---

## 🛒 API da Loja

| Método | Rota | Descrição |
|---|---|---|
| GET | `loja_api.php?rota=produtos` | Lista todos os produtos |
| GET | `loja_api.php?rota=produto&id=1` | Busca produto por ID |
| GET | `loja_api.php?rota=buscar&q=camisa` | Busca por nome |
| POST | `loja_api.php?rota=produto` | Adiciona produto |
| POST | `loja_api.php?rota=comprar` | Realiza compra |
| PUT | `loja_api.php?rota=produto&id=1` | Atualiza produto |
| DELETE | `loja_api.php?rota=produto&id=1` | Remove produto |

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** PHP 8.2
- **Banco de dados:** MySQL / MariaDB
- **Servidor local:** XAMPP / WAMP

---

## ⚠️ Aviso

Este projeto é **fan-made** e não possui nenhum vínculo oficial com o Fluminense Football Club. Desenvolvido apenas para fins educacionais.

---

## 👨‍💻 Autor
Victor Seixas Alves, resultado do trabalho final da disciplina de **Programação II** do curso de *Sistemas de Informação (4° Período) - Unimontes*
