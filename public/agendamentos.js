async function carregarAgendamentos() {
  try {
    const resposta = await fetch('/api/agendamentos');
    const agendamentos = await resposta.json();

    const corpoTabela = document.querySelector('#tabela-agendamentos tbody');
    corpoTabela.innerHTML = ''; // limpa antes de preencher, evitando duplicar linhas

    agendamentos.forEach((agendamento) => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${agendamento.nome}</td>
        <td>${agendamento.servico}</td>
        <td>${agendamento.data}</td>
        <td>${agendamento.hora}</td>
      `;
      corpoTabela.appendChild(linha);
    });
  } catch (erro) {
    console.error('Erro ao carregar agendamentos:', erro);
  }
}

// Roda assim que a página carrega
carregarAgendamentos();