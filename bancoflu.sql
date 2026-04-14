-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 17/06/2025 às 02:22
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bancoflu`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `contas`
--

CREATE TABLE `contas` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `sobrenome` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo_usuario` enum('normal','admin') DEFAULT 'normal',
  `ativo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `contas`
--

INSERT INTO `contas` (`id`, `nome`, `sobrenome`, `email`, `telefone`, `endereco`, `senha`, `tipo_usuario`, `ativo`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Fluminense', 'admin@fluminense.com.br', '(21) 99999-9999', 'Laranjeiras, Rio de Janeiro', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1, '2025-06-14 04:18:28', '2025-06-14 04:18:28'),
(2, 'João', 'Silva', 'joao@email.com', '(21) 98888-8888', 'Copacabana, Rio de Janeiro', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'normal', 1, '2025-06-14 04:18:28', '2025-06-14 04:18:28'),
(5, 'Victor', 'Alves', 'vseixasalves@gmail.com', '(31) 98334-2557', 'Rua Dr Walter Ferreira Barreto 1515', '$2y$10$Iub6hUqwIWbdtsZuXBlTouFvEDW6iRSE9l6jln1bTu3vs4LxoNeD2', 'normal', 1, '2025-06-16 23:15:27', '2025-06-16 23:15:27');

-- --------------------------------------------------------

--
-- Estrutura para tabela `elenco`
--

CREATE TABLE `elenco` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `posicao` enum('goleiro','zagueiro','lateral','meias','atacantes') NOT NULL,
  `numero` int(11) NOT NULL,
  `jogos` int(11) DEFAULT 0,
  `gols` int(11) DEFAULT 0,
  `assistencias` int(11) DEFAULT 0,
  `defesas` int(11) DEFAULT 0,
  `jogos_sem_sofrer_gol` int(11) DEFAULT 0,
  `foto` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `elenco`
--

INSERT INTO `elenco` (`id`, `nome`, `posicao`, `numero`, `jogos`, `gols`, `assistencias`, `defesas`, `jogos_sem_sofrer_gol`, `foto`, `created_at`, `updated_at`) VALUES
(1, 'Fábio', 'goleiro', 1, 218, 0, 0, 653, 87, 'Fabio.png', '2025-06-14 04:15:49', '2025-06-14 05:55:39'),
(2, 'Vitor Eudes', 'goleiro', 98, 11, 0, 0, 34, 3, 'Vitor_Eudes.png', '2025-06-14 04:15:49', '2025-06-14 05:56:45'),
(3, 'Thiago Silva', 'zagueiro', 3, 182, 16, 1, 0, 0, 'Thiago_Silva.png', '2025-06-14 04:15:49', '2025-06-14 05:58:24'),
(4, 'Thiago Santos', 'zagueiro', 33, 12, 1, 0, 0, 0, 'Thiago_Santos.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(6, 'Samuel Xavier', 'lateral', 2, 16, 1, 3, 0, 0, 'Samuel_Xavier.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(7, 'Paulo Henrique Ganso', 'meias', 10, 22, 4, 8, 0, 0, 'ganso.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(9, 'Germán Cano', 'atacantes', 14, 25, 18, 3, 0, 0, 'German_Cano.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(10, 'Agustin Canobbio', 'atacantes', 11, 10, 2, 1, 0, 0, 'Agustin_Canobbio.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(11, 'Everaldo', 'atacantes', 77, 15, 5, 2, 0, 0, 'Everaldo.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(12, 'Freytes', 'zagueiro', 22, 25, 0, 0, 0, 0, 'Freytes.png', '2025-06-14 04:15:49', '2025-06-14 05:59:07'),
(13, 'Gabriel Fuentes', 'lateral', 12, 12, 1, 2, 0, 0, 'Gabriel_Fuentes.png', '2025-06-14 04:15:49', '2025-06-15 22:54:15'),
(14, 'Hercules', 'meias', 20, 8, 1, 0, 0, 0, 'Hercules.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(15, 'Ignacio', 'meias', 8, 14, 3, 2, 0, 0, 'Ignacio.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(16, 'Isaque', 'atacantes', 29, 7, 1, 1, 0, 0, 'Isaque.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(17, 'Jhon Arias', 'meias', 21, 20, 5, 7, 0, 0, 'Jhon_Arias.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(18, 'Joaquin Lavega', 'atacantes', 30, 3, 0, 0, 0, 0, 'Joaquin_Lavega.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(19, 'Kevin Serna', 'atacantes', 17, 10, 2, 3, 0, 0, 'Kevin_Serna.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(20, 'Lima', 'meias', 45, 18, 4, 5, 0, 0, 'Lima.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(21, 'Manoel', 'zagueiro', 26, 10, 1, 0, 0, 0, 'Manoel.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(22, 'Marcelo Pitaluga', 'goleiro', 27, 1, 0, 0, 0, 0, 'Marcelo_Pitaluga.png', '2025-06-14 04:15:49', '2025-06-14 05:57:27'),
(23, 'Martinelli', 'meias', 88, 15, 2, 3, 0, 0, 'Martinelli.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(24, 'Nonato', 'meias', 28, 12, 1, 2, 0, 0, 'Nonato.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(25, 'Paulo Baya', 'atacantes', 9, 6, 1, 0, 0, 0, 'Paulo_Baya.png', '2025-06-14 04:15:49', '2025-06-14 04:15:49'),
(26, 'Rene', 'lateral', 6, 10, 0, 1, 0, 0, 'Rene.png', '2025-06-14 04:15:49', '2025-06-16 23:02:39'),
(27, 'Riquelme', 'atacantes', 38, 4, 0, 0, 0, 0, 'Riquelme.png', '2025-06-14 04:15:49', '2025-06-14 04:33:43');

-- --------------------------------------------------------

--
-- Estrutura para tabela `loja`
--

CREATE TABLE `loja` (
  `id` int(11) NOT NULL,
  `nome_produto` varchar(255) NOT NULL,
  `foto_produto` varchar(255) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `categoria` varchar(100) DEFAULT 'geral',
  `descricao` text DEFAULT NULL,
  `estoque` int(11) DEFAULT 0,
  `ativo` tinyint(1) DEFAULT 1,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `loja`
--

INSERT INTO `loja` (`id`, `nome_produto`, `foto_produto`, `valor`, `categoria`, `descricao`, `estoque`, `ativo`, `data_criacao`, `data_atualizacao`) VALUES
(1, 'Camisa Titular 2025 - Masculina', 'produtos/camisa_titular_2025.png', 239.92, 'camisas', 'Camisa oficial do Fluminense para a temporada 2025', 50, 1, '2025-06-16 23:34:50', '2025-06-16 23:34:50'),
(2, 'Camisa Reserva 2025 - Masculina', 'produtos/camisa_reserva_2025.png', 239.92, 'camisas', 'Camisa reserva oficial do Fluminense para a temporada 2025', 30, 1, '2025-06-16 23:34:50', '2025-06-16 23:34:50'),
(3, 'Boné Oficial Fluminense', 'produtos/bone_oficial.png', 79.90, 'acessorios', 'Boné oficial com escudo bordado do Fluminense', 100, 1, '2025-06-16 23:34:50', '2025-06-16 23:34:50'),
(4, 'Cachecol Oficial Tricolor', 'produtos/cachecol_tricolor.png', 59.90, 'acessorios', 'Cachecol oficial nas cores do Fluminense', 75, 1, '2025-06-16 23:34:50', '2025-06-16 23:34:50'),
(5, 'Caneca Oficial Fluminense', 'produtos/caneca_oficial.png', 39.90, 'casa', 'Caneca de porcelana com escudo oficial do Fluminense', 200, 1, '2025-06-16 23:34:50', '2025-06-16 23:34:50'),
(6, 'Camisa Titular 2025 - Infantil', 'produtos/camisa_infantil_2025.png', 149.90, 'infantil', 'Camisa oficial infantil do Fluminense para a temporada 2025', 40, 1, '2025-06-16 23:34:50', '2025-06-16 23:34:50'),
(7, 'Mochila Oficial Fluminense', 'produtos/mochila_oficial.png', 129.90, 'acessorios', 'Mochila oficial com compartimentos e logo do Fluminense', 25, 1, '2025-06-16 23:34:50', '2025-06-16 23:34:50'),
(8, 'Chaveiro Escudo Fluminense', 'produtos/chaveiro_escudo.png', 19.90, 'acessorios', 'Chaveiro de metal com escudo oficial do Fluminense', 300, 1, '2025-06-16 23:34:50', '2025-06-16 23:34:50');

-- --------------------------------------------------------

--
-- Estrutura para tabela `noticias`
--

CREATE TABLE `noticias` (
  `id` int(11) NOT NULL,
  `data` date NOT NULL,
  `imagem_capa` varchar(255) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `tema` varchar(100) NOT NULL,
  `texto_resumido` text NOT NULL,
  `texto_noticia` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `noticias`
--

INSERT INTO `noticias` (`id`, `data`, `imagem_capa`, `titulo`, `tema`, `texto_resumido`, `texto_noticia`, `created_at`, `updated_at`) VALUES
(1, '2025-06-14', 'copa_brasil_oitavas.png', 'Fluminense enfrentará o Internacional nas oitavas da Copa do Brasil', 'Copa do Brasil', 'O Tricolor conheceu seu adversário nas oitavas de final da Copa do Brasil. O confronto promete ser emocionante no Maracanã.', 'O Fluminense Football Club conheceu nesta sexta-feira (14) seu adversário para as oitavas de final da Copa do Brasil 2025. O Tricolor das Laranjeiras enfrentará o Sport Club Internacional em confronto que promete grandes emoções.\n\nO primeiro jogo será realizado no Estádio do Maracanã, no Rio de Janeiro, enquanto a partida de volta acontecerá no Estádio Beira-Rio, em Porto Alegre. As datas dos jogos ainda serão definidas pela CBF.\n\nO técnico Fernando Diniz demonstrou confiança na classificação: \"Sabemos da qualidade do Internacional, mas estamos preparados. Nossa torcida será fundamental neste momento decisivo da competição.\"\n\nO Fluminense chega às oitavas após eliminar o Atlético-MG nas fases anteriores, mostrando um futebol consistente e ofensivo que tem empolgado a torcida tricolor.\n\nA Copa do Brasil representa uma das principais competições do calendário brasileiro, e o Fluminense busca conquistar mais este título para sua galeria de troféus.', '2025-06-14 20:06:10', '2025-06-14 20:06:10'),
(2, '2025-06-13', 'thiago_silva_renovacao.png', 'Thiago Silva renova contrato com o Fluminense até 2026', 'Contratações', 'O capitão tricolor estendeu seu vínculo com o clube carioca por mais uma temporada, mantendo a liderança da defesa.', 'O zagueiro Thiago Silva, de 40 anos, renovou seu contrato com o Fluminense até dezembro de 2026. O anúncio foi feito oficialmente pelo clube nesta quinta-feira (13), para alegria da torcida tricolor.\n\nO experiente defensor, que retornou ao Fluminense em 2023 após passagem vitoriosa pela Europa, tem sido peça fundamental na defesa do time comandado por Fernando Diniz.\n\n\"Estou muito feliz em continuar defendendo as cores do Fluminense. Este clube é minha casa e quero ajudar a conquistar mais títulos\", declarou Thiago Silva em entrevista coletiva.\n\nO presidente do Fluminense, Mário Bittencourt, destacou a importância da renovação: \"Thiago Silva é um líder nato e sua experiência é fundamental para nosso projeto esportivo.\"\n\nCom a camisa tricolor, o zagueiro já disputou mais de 180 jogos e marcou 16 gols, sendo uma das principais referências técnicas e de liderança do elenco atual.', '2025-06-14 20:06:10', '2025-06-16 23:02:25'),
(3, '2025-06-12', 'brasileirao_vitoria.png', 'Fluminense vence o Botafogo por 2x1 no clássico carioca', 'Brasileirão', 'Em partida emocionante no Maracanã, o Tricolor superou o rival e subiu na tabela do Campeonato Brasileiro.', 'O Fluminense conquistou uma vitória importante sobre o Botafogo por 2 a 1, na noite desta quarta-feira (12), no Estádio do Maracanã, pela 15ª rodada do Campeonato Brasileiro.\n\nOs gols tricolores foram marcados por Germán Cano, aos 23 minutos do primeiro tempo, e Jhon Arias, aos 38 da segunda etapa. O Botafogo descontou com Tiquinho Soares aos 45 do segundo tempo.\n\nA partida foi marcada pela intensidade e rivalidade característica dos clássicos cariocas. O Fluminense mostrou superioridade técnica e soube aproveitar as oportunidades criadas.\n\nCom o resultado, o Tricolor subiu para a 8ª posição na tabela do Brasileirão, somando 24 pontos em 15 jogos disputados.\n\nO técnico Fernando Diniz elogiou a atuação da equipe: \"Foi um jogo muito bem disputado. Os jogadores seguiram à risca nossa estratégia e mereceram esta vitória importante.\"\n\nO próximo compromisso do Fluminense será contra o Grêmio, no domingo (16), às 16h, no Estádio das Laranjeiras.', '2025-06-14 20:06:10', '2025-06-14 20:06:10'),
(4, '2025-06-11', 'libertadores_classificacao.png', 'Fluminense se classifica para as quartas de final da Libertadores', 'Libertadores', 'O Tricolor eliminou o River Plate nos pênaltis e avança na principal competição sul-americana.', 'O Fluminense garantiu sua classificação para as quartas de final da Copa Libertadores da América após eliminar o River Plate (ARG) na disputa por pênaltis, na noite desta terça-feira (11), no Estádio Monumental de Núñez, em Buenos Aires.\n\nApós empate por 1 a 1 no tempo normal e prorrogação, a decisão foi para os pênaltis, onde o Tricolor venceu por 4 a 3. O goleiro Fábio foi o herói da classificação, defendendo duas cobranças argentinas.\n\nO gol do Fluminense no tempo normal foi marcado por Lima, aos 34 minutos do segundo tempo, enquanto o River empatou com Borja aos 42 minutos.\n\nNas quartas de final, o Fluminense enfrentará o vencedor do confronto entre Palmeiras e Estudiantes. Os jogos estão previstos para acontecer entre os dias 18 e 25 de junho.\n\nO presidente Mário Bittencourt comemorou a classificação: \"É uma alegria imensa ver o Fluminense entre os oito melhores da América. Nossos jogadores mostraram muita garra e determinação.\"\n\nEsta é a segunda vez consecutiva que o Fluminense chega às quartas de final da Libertadores, repetindo o feito da temporada passada quando conquistou o título inédito.', '2025-06-14 20:06:10', '2025-06-14 20:06:10');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `contas`
--
ALTER TABLE `contas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `elenco`
--
ALTER TABLE `elenco`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`);

--
-- Índices de tabela `loja`
--
ALTER TABLE `loja`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `contas`
--
ALTER TABLE `contas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `elenco`
--
ALTER TABLE `elenco`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de tabela `loja`
--
ALTER TABLE `loja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
