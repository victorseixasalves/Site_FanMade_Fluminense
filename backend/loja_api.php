<?php
header("Access-Control-Allow-Origin: *" );
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';
require_once 'loja.php';

$database = new Database();
$db = $database->getConnection();
$loja = new Loja($db);

$method = $_SERVER['REQUEST_METHOD'];
$rota = $_GET['rota'] ?? '';
$id   = isset($_GET['id']) ? (int) $_GET['id'] : null;

// Helper para formatar um produto como array
function formatarProduto(array $row): array {
    return [
        'id'               => $row['id'],
        'nome_produto'     => $row['nome_produto'],
        'foto_produto'     => $row['foto_produto'],
        'valor'            => floatval($row['valor']),
        'categoria'        => $row['categoria'],
        'descricao'        => $row['descricao'],
        'estoque'          => intval($row['estoque']),
        'data_criacao'     => $row['data_criacao'],
        'data_atualizacao' => $row['data_atualizacao'],
    ];
}

switch ($method) {
    case 'GET':
        if ($rota === 'produtos') {
            $stmt = $loja->buscarComFiltros(
                $_GET['categoria'] ?? null,
                $_GET['ordenacao'] ?? 'nome',
                $_GET['busca'] ?? null,
                isset($_GET['limite']) ? (int) $_GET['limite'] : null
            );
            $produtos = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $produtos[] = formatarProduto($row);
            }
            http_response_code(200);
            echo json_encode($produtos);

        } elseif ($rota === 'produto' && $id) {
            $stmt = $loja->buscarPorId($id);
            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(formatarProduto($stmt->fetch(PDO::FETCH_ASSOC)));
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Produto não encontrado.']);
            }

        } elseif ($rota === 'buscar' && isset($_GET['q'])) {
            $stmt = $loja->buscarPorNome($_GET['q']);
            $produtos = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $produtos[] = formatarProduto($row);
            }
            http_response_code(200);
            echo json_encode($produtos);

        } elseif ($rota === 'disponibilidade' && $id) {
            $quantidade = isset($_GET['quantidade']) ? (int) $_GET['quantidade'] : 1;
            http_response_code(200);
            echo json_encode([
                'produto_id'          => $id,
                'quantidade_solicitada' => $quantidade,
                'disponivel'          => $loja->verificarDisponibilidade($id, $quantidade),
            ]);

        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint não encontrado.']);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));

        if ($rota === 'produto') {
            if (empty($data->nome_produto) || empty($data->foto_produto) || !isset($data->valor)) {
                http_response_code(400);
                echo json_encode(['message' => 'Nome, foto e valor são obrigatórios.']);
                break;
            }
            if ($loja->adicionar($data->nome_produto, $data->foto_produto, $data->valor, $data->categoria ?? 'geral', $data->descricao ?? '', $data->estoque ?? 0)) {
                http_response_code(201);
                echo json_encode(['message' => 'Produto adicionado com sucesso.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Não foi possível adicionar o produto.']);
            }

        } elseif ($rota === 'comprar') {
            if (empty($data->produto_id) || !isset($data->quantidade)) {
                http_response_code(400);
                echo json_encode(['message' => 'Dados incompletos para processar a compra.']);
                break;
            }
            $produto_id = $data->produto_id;
            $quantidade = $data->quantidade;

            if (!$loja->verificarDisponibilidade($produto_id, $quantidade)) {
                http_response_code(400);
                echo json_encode(['message' => 'Produto indisponível ou estoque insuficiente.']);
                break;
            }

            if ($loja->atualizarEstoque($produto_id, $quantidade)) {
                http_response_code(200);
                echo json_encode(['message' => 'Compra realizada com sucesso.', 'produto_id' => $produto_id, 'quantidade' => $quantidade]);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Erro ao processar a compra.']);
            }

        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint não encontrado.']);
        }
        break;

    case 'PUT':
        if ($rota === 'produto' && $id) {
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->nome_produto) || empty($data->foto_produto) || !isset($data->valor)) {
                http_response_code(400);
                echo json_encode(['message' => 'Dados incompletos.']);
                break;
            }
            if ($loja->atualizar($id, $data->nome_produto, $data->foto_produto, $data->valor, $data->categoria ?? 'geral', $data->descricao ?? '', $data->estoque ?? 0)) {
                http_response_code(200);
                echo json_encode(['message' => 'Produto atualizado com sucesso.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Não foi possível atualizar o produto.']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint não encontrado.']);
        }
        break;

    case 'DELETE':
        if ($rota === 'produto' && $id) {
            if ($loja->deletar($id)) {
                http_response_code(200);
                echo json_encode(['message' => 'Produto removido com sucesso.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Não foi possível remover o produto.']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint não encontrado.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método não permitido.']);
        break;
}
?>
