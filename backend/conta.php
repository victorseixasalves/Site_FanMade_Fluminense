<?php
class Conta {
    private $conn;
    private $table_name = 'contas';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar($nome, $sobrenome, $email, $telefone, $endereco, $senha, $tipo_usuario = 'normal') {
        $stmt = $this->conn->prepare(
            "INSERT INTO {$this->table_name}
             (nome, sobrenome, email, telefone, endereco, senha, tipo_usuario)
             VALUES (:nome, :sobrenome, :email, :telefone, :endereco, :senha, :tipo_usuario)"
        );
        $stmt->bindValue(':nome', $nome);
        $stmt->bindValue(':sobrenome', $sobrenome);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':telefone', $telefone);
        $stmt->bindValue(':endereco', $endereco);
        $stmt->bindValue(':senha', password_hash($senha, PASSWORD_DEFAULT));
        $stmt->bindValue(':tipo_usuario', $tipo_usuario);
        return $stmt->execute();
    }

    public function login($email, $senha) {
        $stmt = $this->conn->prepare(
            "SELECT id, nome, sobrenome, email, telefone, endereco, senha, tipo_usuario, ativo
             FROM {$this->table_name}
             WHERE email = :email AND ativo = 1"
        );
        $stmt->bindValue(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($senha, $row['senha'])) {
                unset($row['senha']);
                return $row;
            }
        }
        return false;
    }

    public function emailExiste($email) {
        $stmt = $this->conn->prepare("SELECT id FROM {$this->table_name} WHERE email = :email");
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function buscarPorId($id) {
        $stmt = $this->conn->prepare(
            "SELECT id, nome, sobrenome, email, telefone, endereco, tipo_usuario, ativo, created_at
             FROM {$this->table_name} WHERE id = :id"
        );
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt;
    }

    public function atualizar($id, $nome, $sobrenome, $telefone, $endereco) {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name}
             SET nome = :nome, sobrenome = :sobrenome, telefone = :telefone, endereco = :endereco
             WHERE id = :id"
        );
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':nome', $nome);
        $stmt->bindValue(':sobrenome', $sobrenome);
        $stmt->bindValue(':telefone', $telefone);
        $stmt->bindValue(':endereco', $endereco);
        return $stmt->execute();
    }

    public function alterarSenha($id, $senha_nova) {
        $stmt = $this->conn->prepare("UPDATE {$this->table_name} SET senha = :senha WHERE id = :id");
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':senha', password_hash($senha_nova, PASSWORD_DEFAULT));
        return $stmt->execute();
    }

    public function desativar($id) {
        $stmt = $this->conn->prepare("UPDATE {$this->table_name} SET ativo = 0 WHERE id = :id");
        $stmt->bindValue(':id', $id);
        return $stmt->execute();
    }

    public function listarTodos() {
        $stmt = $this->conn->prepare(
            "SELECT id, nome, sobrenome, email, telefone, endereco, tipo_usuario, ativo, created_at
             FROM {$this->table_name} ORDER BY created_at DESC"
        );
        $stmt->execute();
        return $stmt;
    }
}
?>
