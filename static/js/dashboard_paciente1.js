/* ==========================================================================
   dashboard_paciente1.js - Motor RESTful do Paciente
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 1. LÓGICA DE GERAÇÃO DOS CARDS DE DATA
    // ==========================================
    const diasContainer = document.getElementById('dias-container');
    const turnoContainer = document.getElementById('turno-container');
    const horariosContainer = document.getElementById('horarios-container');
    const listaHorarios = document.getElementById('lista-horarios');
    const dataHoraOculta = document.getElementById('data_hora_oculta');
    const turnoBtns = document.querySelectorAll('.turno-btn');
    const medicoSelect = document.getElementById('medico');
    
    // Alertas da Tela
    const alertaValidacao = document.getElementById('alerta-validacao'); // O Amarelo (Falta preencher)
    const alertaAgendamento = document.getElementById('alerta-agendamento'); // O Vermelho (Erro da API)

    let dataSelecionada = '';
    let horaSelecionada = '';
    let horariosOcupadosDoDia = [];

    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const blocosHorarios = {
        manha: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
        tarde: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
    };

    // Reseta tudo e esconde os alertas se trocar o médico
    if (medicoSelect) {
        medicoSelect.addEventListener('change', function() {
            document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
            turnoContainer.classList.add('secao-oculta');
            horariosContainer.classList.add('secao-oculta');
            dataHoraOculta.value = '';
            
            // LIMPA OS ALERTAS
            if (alertaValidacao) alertaValidacao.classList.add('d-none');
            if (alertaAgendamento) alertaAgendamento.classList.add('d-none');
        });
    }

    if (diasContainer) {
        let dataAtual = new Date();
        dataAtual.setDate(dataAtual.getDate() + 1); // Começa de amanhã

        let diasAdicionados = 0;
        while (diasAdicionados < 5) {
            if (dataAtual.getDay() !== 0 && dataAtual.getDay() !== 6) { // Pula fins de semana
                
                const ano = dataAtual.getFullYear();
                const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
                const dia = String(dataAtual.getDate()).padStart(2, '0');
                const dataFormatada = `${ano}-${mes}-${dia}`;
                const nomeDia = nomesDias[dataAtual.getDay()];

                const card = document.createElement('div');
                card.className = 'date-card';
                card.dataset.data = dataFormatada;
                card.innerHTML = `<span class="d-block small text-uppercase mb-1">${nomeDia}</span><strong class="fs-5">${dia}/${mes}</strong>`;

                card.addEventListener('click', async function() {
                    // LIMPA O ALERTA VERMELHO AO CLICAR NA DATA
                    if (alertaAgendamento) alertaAgendamento.classList.add('d-none');

                    // Proteção: Obriga a escolher o médico primeiro
                    if (!medicoSelect.value) {
                        alertaValidacao.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Selecione o Médico primeiro.';
                        alertaValidacao.classList.remove('d-none');
                        medicoSelect.focus();
                        return;
                    }
                    alertaValidacao.classList.add('d-none');

                    document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    dataSelecionada = this.dataset.data;
                    horaSelecionada = '';
                    dataHoraOculta.value = '';
                    horariosContainer.classList.add('secao-oculta');
                    
                    try {
                        // CHAMA A API: Busca horários ocupados
                        const response = await fetch(`/api/consultas/horarios-ocupados?medico_id=${medicoSelect.value}&data=${dataSelecionada}`);
                        horariosOcupadosDoDia = await response.json();
                        
                        turnoContainer.classList.remove('secao-oculta');
                        turnoBtns.forEach(btn => {
                            btn.classList.remove('btn-primary', 'text-white');
                            btn.classList.add('btn-outline-primary');
                        });
                    } catch (error) {
                        console.error('Erro ao buscar horários:', error);
                    }
                });

                diasContainer.appendChild(card);
                diasAdicionados++;
            }
            dataAtual.setDate(dataAtual.getDate() + 1);
        }

        turnoBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                turnoBtns.forEach(b => {
                    b.classList.remove('btn-primary', 'text-white');
                    b.classList.add('btn-outline-primary');
                });
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary', 'text-white');

                const turno = this.dataset.turno;
                renderizarHorarios(blocosHorarios[turno]);
            });
        });

        function renderizarHorarios(arrayHorarios) {
            listaHorarios.innerHTML = '';
            horariosContainer.classList.remove('secao-oculta');
            horaSelecionada = '';
            dataHoraOculta.value = '';

            arrayHorarios.forEach(hora => {
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.textContent = hora;

                if (horariosOcupadosDoDia.includes(hora)) {
                    slot.classList.add('ocupado');
                    slot.title = "Horário indisponível";
                } else {
                    slot.addEventListener('click', function() {
                        // LIMPA O ALERTA VERMELHO AO ESCOLHER OUTRO HORÁRIO
                        if (alertaAgendamento) alertaAgendamento.classList.add('d-none');

                        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                        this.classList.add('selected');
                        horaSelecionada = hora;
                        dataHoraOculta.value = `${dataSelecionada}T${horaSelecionada}`; 
                        alertaValidacao.classList.add('d-none');
                    });
                }
                listaHorarios.appendChild(slot);
            });
        }
    }

    // ==========================================
    // 2. LÓGICA DE ENVIO DO AGENDAMENTO (API POST)
    // ==========================================
    const btnAgendar = document.querySelector('.schedule-confirm-btn');
    const scheduleModalElement = document.getElementById('scheduleModal');
    let scheduleModal;
    
    if (scheduleModalElement) {
        scheduleModal = new bootstrap.Modal(scheduleModalElement);
    }

    if (btnAgendar) {
        btnAgendar.addEventListener('click', function () {
            if (!dataHoraOculta.value || !medicoSelect.value) {
                alertaValidacao.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Por favor, preencha todos os campos.';
                alertaValidacao.classList.remove('d-none');
                return;
            }
            alertaValidacao.classList.add('d-none');
            scheduleModal.show();
        });
    }

    const confirmScheduleBtn = document.getElementById('confirmScheduleBtn');

    if (confirmScheduleBtn) {
        confirmScheduleBtn.addEventListener('click', async function () {
            confirmScheduleBtn.disabled = true;
            confirmScheduleBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...';

            const payload = {
                medico_id: medicoSelect.value,
                data_hora: dataHoraOculta.value
            };

            try {
                const response = await fetch('/api/paciente/consultas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.reload();
                } else {
                    scheduleModal.hide();
                    alertaAgendamento.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${data.erro}`;
                    alertaAgendamento.classList.remove('d-none');
                }
            } catch (error) {
                scheduleModal.hide();
                alertaAgendamento.innerHTML = `<i class="bi bi-wifi-off me-2"></i>Erro de conexão com o servidor.`;
                alertaAgendamento.classList.remove('d-none');
            } finally {
                confirmScheduleBtn.disabled = false;
                confirmScheduleBtn.textContent = 'Confirmar agendamento';
            }
        });
    }

    // ==========================================
    // 3. LÓGICA DE CANCELAMENTO (API DELETE)
    // ==========================================
    const cancelModalElement = document.getElementById('cancelModal');
    let cancelModal;
    let consultaParaCancelar = null; 

    if (cancelModalElement) {
        cancelModal = new bootstrap.Modal(cancelModalElement);
    }

    document.querySelectorAll('.cancel-consulta-btn').forEach(button => {
        button.addEventListener('click', function () {
            consultaParaCancelar = this.getAttribute('data-consulta-id');
            const consultaData = this.getAttribute('data-consulta-data');
            
            document.getElementById('cancelConsultaData').textContent = consultaData;
            document.getElementById('alerta-erro-modal-cancelar').classList.add('d-none');
            
            cancelModal.show();
        });
    });

    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', async function () {
            if (!consultaParaCancelar) return;

            confirmCancelBtn.disabled = true;
            confirmCancelBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cancelando...';

            try {
                const response = await fetch(`/api/paciente/consultas/${consultaParaCancelar}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.reload();
                } else {
                    const alertaErro = document.getElementById('alerta-erro-modal-cancelar');
                    alertaErro.innerHTML = `<i class="bi bi-x-circle me-1"></i>${data.erro}`;
                    alertaErro.classList.remove('d-none');
                }
            } catch (error) {
                console.error("Erro ao cancelar:", error);
            } finally {
                confirmCancelBtn.disabled = false;
                confirmCancelBtn.textContent = 'Confirmar cancelamento';
            }
        });
    }
});