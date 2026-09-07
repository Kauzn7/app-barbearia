const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para o servidor entender JSON enviado pelo front-end
app.use(express.json());

// Serve os arquivos da pasta "public" (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota de teste, só para confirmar que o servidor está de pé
app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'Servidor funcionando!' });
});

// Rota para SALVAR um novo agendamento
app.post('/api/agendamentos', (req, res) => {
  const { nome, servico, data, hora } = req.body;

  const sql = `INSERT INTO agendamentos (nome, servico, data, hora) VALUES (?, ?, ?, ?)`;

  db.run(sql, [nome, servico, data, hora], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ erro: 'Erro ao salvar agendamento' });
    }
    res.json({ mensagem: 'Agendamento salvo!', id: this.lastID });
  });
});

// Rota para LISTAR os agendamentos (vamos usar no Passo 7)
app.get('/api/agendamentos', (req, res) => {
  db.all('SELECT * FROM agendamentos', [], (err, linhas) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
    }
    res.json(linhas);
  });
});
// Rota para CANCELAR (excluir) um agendamento
app.delete('/api/agendamentos/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM agendamentos WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ erro: 'Erro ao cancelar agendamento' });
    }
    res.json({ mensagem: 'Agendamento cancelado' });
  });
});
// Rota para SALVAR um novo cliente (cadastro)
app.post('/api/clientes', (req, res) => {
  const { nome, telefone, email } = req.body;

  const sql = `INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)`;

  db.run(sql, [nome, telefone, email], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ erro: 'Erro ao salvar cadastro' });
    }
    res.json({ mensagem: 'Cadastro salvo!', id: this.lastID });
  });
});
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});