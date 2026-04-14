<?php
class Elenco {
    private $conn;
    private $table_name = 'elenco';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function buscarTodos() {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table_name} ORDER BY posicao, numero");
        $stmt->execute();
        return $stmt;
    }

    public function buscarPorPosicao($posicao) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table_name} WHERE posicao = ? ORDER BY numero");
        $stmt->execute([$posicao]);
        return $stmt;
    }

    public function buscarPorId($id) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table_name} WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt;
    }

    public function adicionar($nome, $posicao, $numero, $jogos = 0, $gols = 0, $assistencias = 0, $defesas = 0, $jogos_sem_sofrer_gol = 0, $foto = null) {
        $stmt = $this->conn->prepare(
            "INSERT INTO {$this->table_name}
             (nome, posicao, numero, jogos, gols, assistencias, defesas, jogos_sem_sofrer_gol, foto)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        return $stmt->execute([$nome, $posicao, $numero, $jogos, $gols, $assistencias, $defesas, $jogos_sem_sofrer_gol, $foto]);
    }

    public function atualizar($id, $nome, $posicao, $numero, $jogos, $gols, $assistencias, $defesas, $jogos_sem_sofrer_gol, $foto) {
        $stmt = $this->conn->prepare(
            "UPDATE {$this->table_name}
             SET nome = ?, posicao = ?, numero = ?, jogos = ?, gols = ?, assistencias = ?,
                 defesas = ?, jogos_sem_sofrer_gol = ?, foto = ?
             WHERE id = ?"
        );
        return $stmt->execute([$nome, $posicao, $numero, $jogos, $gols, $assistencias, $defesas, $jogos_sem_sofrer_gol, $foto, $id]);
    }

    public function deletar($id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table_name} WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>
