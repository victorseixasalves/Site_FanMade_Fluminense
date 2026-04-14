<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';
require_once 'elenco.php';

$database = new Database();
$db = $database->getConnection();
$elenco = new Elenco($db);

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));
$action = $request[0] ?? '';

// Helper para formatar um jogador como array
function formatarJogador(array $row): array {
    return [
        'id'                   => $row['id'],
        'nome'                 => $row['nome'],
        'posicao'              => $row['posicao'],
        'numero'               => $row['numero'],
        'jogos'                => $row['jogos'],
        'gols'                 => $row['gols'],
        'assistencias'         => $row['assistencias'],
        'defesas'              => $row['defesas'],
        'jogos_sem_sofrer_gol' => $row['jogos_sem_sofrer_gol'],
        'foto'                 => $row['foto'],
    ];
}

switch ($method) {
    case 'GET':
        if ($action === 'todos') {
            $stmt = $elenco->buscarTodos();
            $jogadores = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $jogadores[] = formatarJogador($row);
            }
            http_response_code(200);
            echo json_encode($jogadores);

        } elseif ($action === 'posicao' && isset($request[1])) {
            $stmt = $elenco->buscarPorPosicao($request[1]);
            $jogadores = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $jogadores[] = formatarJogador($row);
            }
            http_response_code(200);
            echo json_encode($jogadores);

        } elseif ($action === 'jogador' && isset($request[1])) {
            $stmt = $elenco->buscarPorId((int) $request[1]);
            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(formatarJogador($stmt->fetch(PDO::FETCH_ASSOC)));
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Jogador não encontrado.']);
            }

        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint não encontrado.']);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->nome) && !empty($data->posicao) && !empty($data->numero)) {
            if ($elenco->adicionar(
                $data->nome, $data->posicao, $data->numero,
                $data->jogos ?? 0, $data->gols ?? 0, $data->assistencias ?? 0,
                $data->defesas ?? 0, $data->jogos_sem_sofrer_gol ?? 0, $data->foto ?? null
            )) {
                http_response_code(201);
                echo json_encode(['message' => 'Jogador adicionado com sucesso.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Não foi possível adicionar o jogador.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Dados incompletos. Nome, posição e número são obrigatórios.']);
        }
        break;

    case 'PUT':
        if ($action === 'jogador' && isset($request[1])) {
            $data = json_decode(file_get_contents("php://input"));
            if (!empty($data->nome) && !empty($data->posicao) && !empty($data->numero)) {
                if ($elenco->atualizar(
                    (int) $request[1],
                    $data->nome, $data->posicao, $data->numero,
                    $data->jogos ?? 0, $data->gols ?? 0, $data->assistencias ?? 0,
                    $data->defesas ?? 0, $data->jogos_sem_sofrer_gol ?? 0, $data->foto ?? null
                )) {
                    http_response_code(200);
                    echo json_encode(['message' => 'Jogador atualizado com sucesso.']);
                } else {
                    http_response_code(503);
                    echo json_encode(['message' => 'Não foi possível atualizar o jogador.']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Dados incompletos.']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint não encontrado.']);
        }
        break;

    case 'DELETE':
        if ($action === 'jogador' && isset($request[1])) {
            if ($elenco->deletar((int) $request[1])) {
                http_response_code(200);
                echo json_encode(['message' => 'Jogador removido com sucesso.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Não foi possível remover o jogador.']);
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
