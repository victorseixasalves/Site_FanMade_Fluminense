<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';

$database = new Database();
$pdo = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$input = ($method !== 'GET') ? json_decode(file_get_contents("php://input"), true) : [];

// GET é público
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM noticias WHERE id = ?");
        $stmt->execute([(int) $_GET['id']]);
        $noticia = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($noticia) {
            echo json_encode(['success' => true, 'data' => $noticia]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Notícia não encontrada.']);
        }
    } else {
        $stmt = $pdo->query("SELECT * FROM noticias ORDER BY data DESC, created_at DESC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
    exit();
}

// Operações de escrita exigem admin
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_tipo']) || $_SESSION['user_tipo'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Apenas administradores podem realizar esta ação.']);
    exit();
}

if ($method === 'POST') {
    $required = ['data', 'imagem_capa', 'titulo', 'tema', 'texto_resumido', 'texto_noticia'];
    foreach ($required as $campo) {
        if (empty($input[$campo])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Campo obrigatório faltando: {$campo}"]);
            exit();
        }
    }

    $stmt = $pdo->prepare(
        "INSERT INTO noticias (data, imagem_capa, titulo, tema, texto_resumido, texto_noticia)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    if ($stmt->execute([$input['data'], $input['imagem_capa'], $input['titulo'], $input['tema'], $input['texto_resumido'], $input['texto_noticia']])) {
        echo json_encode(['success' => true, 'message' => 'Notícia adicionada com sucesso!', 'id' => $pdo->lastInsertId()]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro ao adicionar notícia.']);
    }
    exit();
}

if ($method === 'PUT') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID da notícia não fornecido.']);
        exit();
    }

    $campos = [];
    $valores = [];
    foreach (['data', 'imagem_capa', 'titulo', 'tema', 'texto_resumido', 'texto_noticia'] as $campo) {
        if (isset($input[$campo])) {
            $campos[] = "{$campo} = ?";
            $valores[] = $input[$campo];
        }
    }

    if (empty($campos)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nenhum campo para atualizar.']);
        exit();
    }

    $valores[] = (int) $_GET['id'];
    $stmt = $pdo->prepare("UPDATE noticias SET " . implode(', ', $campos) . " WHERE id = ?");
    if ($stmt->execute($valores)) {
        echo json_encode(['success' => true, 'message' => 'Notícia atualizada com sucesso!']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar notícia.']);
    }
    exit();
}

if ($method === 'DELETE') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID da notícia não fornecido.']);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM noticias WHERE id = ?");
    if ($stmt->execute([(int) $_GET['id']])) {
        echo json_encode(['success' => true, 'message' => 'Notícia excluída com sucesso!']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro ao excluir notícia.']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
?>
