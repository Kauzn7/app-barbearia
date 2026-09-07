document.getElementById('form-cadastro').addEventListener('submit', async function (event) {
  event.preventDefault();

  const dados = {
    nome: document.getElementById('nome').value,
    telefone: document.getElementById('telefone').value,
    email: document.getElementById('email').value
  };

  try {
    const resposta = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      // cadastro deu certo, cliente segue pra tela inicial
      window.location.href = 'inicio.html';
    } else {
      alert('Erro ao fazer cadastro. Tente novamente.');
    }
  } catch (erro) {
    alert('Não foi possível conectar ao servidor.');
    console.error(erro);
  }
});