<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';
require_once 'conta.php';

$database = new Database();
$db = $database->getConnection();
$conta = new Conta($db);

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));
$action = $request[0] ?? '';

switch ($method) {
    case 'POST':
        $input = file_get_contents("php://input");
        $data = json_decode($input);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['message' => 'JSON inválido.']);
            break;
        }

        if ($action === 'cadastro') {
            if (empty($data->nome) || empty($data->sobrenome) || empty($data->email) || empty($data->senha)) {
                http_response_code(400);
                echo json_encode(['message' => 'Nome, sobrenome, e-mail e senha são obrigatórios.']);
                break;
            }

            if ($conta->emailExiste($data->email)) {
                http_response_code(409);
                echo json_encode(['message' => 'Este e-mail já está cadastrado.']);
                break;
            }

            if ($conta->criar(
                $data->nome, $data->sobrenome, $data->email,
                $data->telefone ?? '', $data->endereco ?? '',
                $data->senha, $data->tipo_usuario ?? 'normal'
            )) {
                http_response_code(201);
                echo json_encode(['message' => 'Usuário cadastrado com sucesso.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Não foi possível cadastrar o usuário.']);
            }

        } elseif ($action === 'login') {
            if (empty($data->email) || empty($data->senha)) {
                http_response_code(400);
                echo json_encode(['message' => 'E-mail e senha são obrigatórios.']);
                break;
            }

            $usuario = $conta->login($data->email, $data->senha);

            if ($usuario) {
                $_SESSION['user_id']    = $usuario['id'];
                $_SESSION['user_email'] = $usuario['email'];
                $_SESSION['user_tipo']  = $usuario['tipo_usuario'];
                $_SESSION['user_nome']  = $usuario['nome'];

                http_response_code(200);
                echo json_encode(['message' => 'Login realizado com sucesso.', 'usuario' => $usuario]);
            } else {
                http_response_code(401);
                echo json_encode(['message' => 'E-mail ou senha incorretos.']);
            }

        } elseif ($action === 'logout') {
            session_destroy();
            http_response_code(200);
            echo json_encode(['message' => 'Logout realizado com sucesso.']);

        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint não encontrado.']);
        }
        break;

    case 'GET':
        if ($action === 'verificar-sessao') {
            if (isset($_SESSION['user_id'])) {
                http_response_code(200);
                echo json_encode([
                    'logado'     => true,
                    'user_id'    => $_SESSION['user_id'],
                    'user_email' => $_SESSION['user_email'],
                    'user_tipo'  => $_SESSION['user_tipo'],
                    'user_nome'  => $_SESSION['user_nome'],
                ]);
            } else {
                http_response_code(200);
                echo json_encode(['logado' => false]);
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
