<?php
class Loja {
    private $conn;
    private $table_name = 'loja';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function buscarTodos() {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table_name} WHERE ativo = 1 ORDER BY data_criacao DESC");
        $stmt->execute();
        return $stmt;
    }

    public function buscarPorId($id) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table_name} WHERE id = :id AND ativo = 1 LIMIT 1");
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt;
    }

    public function buscarPorCategoria($categoria) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table_name} WHERE categoria = :categoria AND ativo = 1 ORDER BY nome_produto ASC");
        $stmt->bindValue(':categoria', $categoria);
        $stmt->execute();
        return $stmt;
    }

    public function buscarPorNome($nome) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table_name} WHERE nome_produto LIKE :nome AND ativo = 1 ORDER BY nome_produto ASC");
        $stmt->bindValue(':nome', "%{$nome}%");
        $stmt->execute();
        return $stmt;
    }

    public function buscarComFiltros($categoria = null, $ordenacao = 'nome', $busca = null, $limite = null) {
        $query = "SELECT * FROM {$this->table_name} WHERE ativo = 1";
        $params = [];

        if ($categoria && $categoria !== 'todos') {
            $query .= " AND categoria = :categoria";
            $params[':categoria'] = $categoria;
        }

        if ($busca) {
            $query .= " AND nome_produto LIKE :busca";
            $params[':busca'] = "%{$busca}%";
        }

        switch ($ordenacao) {
            case 'menor-preco':  $query .= " ORDER BY valor ASC"; break;
            case 'maior-preco':  $query .= " ORDER BY valor DESC"; break;
            case 'lancamentos':  $query .= " ORDER BY data_criacao DESC"; break;
            default:             $query .= " ORDER BY nome_produto ASC"; break;
        }

        if ($limite) {
            $query .= " LIMIT :limite";
        }

        $stmt = $this->conn->prepare($query);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        if ($limite) {
            $stmt->bindValue(':limite', (int) $limite, PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt;
    }

    public function adicionar($nome_produto, $foto_produto, $valor, $categoria = 'geral', $descricao = '', $estoque = 0) {
        $stmt = $this->conn->prepare(
            "INSERT INTO {$this->table_name}
             (nome_produto, foto_produto, valor, categoria, descricao, estoque)
             VALUES (:nome_produto, :foto_produto, :valor, :categoria, :descricao, :estoque)"
        );
        $stmt->bindValue(':nome_produto', htmlspecialchars(strip_tags($nome_produto)));
        $stmt->bindValue(':foto_produto', htmlspecialchars(strip_tags($foto_produto)));
        $stmt->bindValue(':valor', $valor);
        $stmt->bindValue(':categoria', htmlspecialchars(strip_tags($categoria)));
        $stmt->bindValue(':descricao', htmlspecialchars(strip_tags($descricao)));
        $stmt->bindValue(':estoque', (int) $estoque, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function atualizar($id, $nome_produto, $foto_produto, $valor, $categoria, $descricao, $estoque) {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name}
             SET nome_produto = :nome_produto, foto_produto = :foto_produto, valor = :valor,
                 categoria = :categoria, descricao = :descricao, estoque = :estoque,
                 data_atualizacao = CURRENT_TIMESTAMP
             WHERE id = :id"
        );
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':nome_produto', htmlspecialchars(strip_tags($nome_produto)));
        $stmt->bindValue(':foto_produto', htmlspecialchars(strip_tags($foto_produto)));
        $stmt->bindValue(':valor', $valor);
        $stmt->bindValue(':categoria', htmlspecialchars(strip_tags($categoria)));
        $stmt->bindValue(':descricao', htmlspecialchars(strip_tags($descricao)));
        $stmt->bindValue(':estoque', (int) $estoque, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deletar($id) {
        // Soft delete
        $stmt = $this->conn->prepare("UPDATE {$this->table_name} SET ativo = 0 WHERE id = :id");
        $stmt->bindValue(':id', $id);
        return $stmt->execute();
    }

    public function atualizarEstoque($id, $quantidade) {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name}
             SET estoque = estoque - :quantidade, data_atualizacao = CURRENT_TIMESTAMP
             WHERE id = :id AND estoque >= :quantidade"
        );
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':quantidade', $quantidade);
        return $stmt->execute() && $stmt->rowCount() > 0;
    }

    public function verificarDisponibilidade($id, $quantidade = 1) {
        $stmt = $this->conn->prepare("SELECT estoque FROM {$this->table_name} WHERE id = :id AND ativo = 1");
        $stmt->bindValue(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row['estoque'] >= $quantidade;
        }
        return false;
    }
}
?>
