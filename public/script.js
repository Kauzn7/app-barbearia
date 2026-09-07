function gerarListaDeHorarios() {
  const horarios = [];
  const intervaloMinutos = 30;

  function adicionarFaixa(inicioHora, fimHora) {
    for (let hora = inicioHora; hora < fimHora; hora++) {
      for (let minuto = 0; minuto < 60; minuto += intervaloMinutos) {
        const horaTexto = String(hora).padStart(2, '0');
        const minutoTexto = String(minuto).padStart(2, '0');
        horarios.push(`${horaTexto}:${minutoTexto}`);
      }
    }
  }

  adicionarFaixa(9, 12);  // 09h às 12h
  adicionarFaixa(13, 18); // 13h às 18h

  return horarios;
}

async function atualizarHorariosDisponiveis() {
  const data = document.getElementById('data').value;
  const selectHora = document.getElementById('hora');

  selectHora.innerHTML = '';

  if (!data) {
    selectHora.disabled = true;
    selectHora.innerHTML = '<option value="">Escolha uma data primeiro</option>';
    return;
  }

  selectHora.disabled = false;
  selectHora.innerHTML = '<option value="">Selecione um horário</option>';

  let horariosOcupados = [];

  try {
    const resposta = await fetch('/api/agendamentos');
    const agendamentos = await resposta.json();

    // pega só os horários já marcados NESSE dia específico
    horariosOcupados = agendamentos
      .filter((agendamento) => agendamento.data === data)
      .map((agendamento) => agendamento.hora);
  } catch (erro) {
    console.error('Erro ao verificar horários ocupados:', erro);
  }

  const todosHorarios = gerarListaDeHorarios();

  todosHorarios.forEach((horario) => {
    const estaOcupado = horariosOcupados.includes(horario);

    const opcao = document.createElement('option');
    opcao.value = horario;
    opcao.textContent = estaOcupado ? `${horario} (indisponível)` : horario;
    opcao.disabled = estaOcupado;

    selectHora.appendChild(opcao);
  });
}

// Toda vez que o cliente mudar a data, atualiza a lista de horários
document.getElementById('data').addEventListener('change', atualizarHorariosDisponiveis);

document.getElementById('form-agendamento').addEventListener('submit', async function (event) {
  event.preventDefault();

  const dados = {
    nome: document.getElementById('nome').value,
    servico: document.getElementById('servico').value,
    data: document.getElementById('data').value,
    hora: document.getElementById('hora').value
  };

  try {
    const resposta = await fetch('/api/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert('Agendamento confirmado com sucesso!');
      document.getElementById('form-agendamento').reset();
      atualizarHorariosDisponiveis(); // já deixa o campo de horário travado de novo
    } else {
      alert('Erro ao agendar: ' + resultado.erro);
    }
  } catch (erro) {
    alert('Não foi possível conectar ao servidor.');
    console.error(erro);
  }
});