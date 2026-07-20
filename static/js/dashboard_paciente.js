/* ==========================================================================
   dashboard_paciente.js - Scripts exclusivos do painel do paciente
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 1. MODAL DE CANCELAMENTO DE CONSULTA
    // ==========================================
    const cancelModalElement = document.getElementById('cancelModal');
    if (cancelModalElement) {
        const cancelModal = new bootstrap.Modal(cancelModalElement);
        const cancelButtons = document.querySelectorAll('.cancel-consulta-btn');
        const cancelData = document.getElementById('cancelConsultaData');
        const confirmLink = document.getElementById('confirmCancelLink');

        cancelButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const consultaId = this.getAttribute('data-consulta-id');
                const consultaData = this.getAttribute('data-consulta-data');

                if (cancelData) cancelData.textContent = consultaData;
                if (confirmLink) confirmLink.href = '/paciente/cancelar_consulta/' + consultaId;

                cancelModal.show();
            });
        });
    }

    // ==========================================
    // 2. MODAL DE AGENDAMENTO DE CONSULTA
    // ==========================================
    const scheduleModalElement = document.getElementById('scheduleModal');
    const agendarForm = document.getElementById('agendarForm');
    const scheduleButton = document.querySelector('.schedule-confirm-btn');
    const confirmScheduleBtn = document.getElementById('confirmScheduleBtn');

    if (scheduleModalElement && agendarForm) {
        const scheduleModal = new bootstrap.Modal(scheduleModalElement);

        if (scheduleButton) {
            scheduleButton.addEventListener('click', function () {
                const alertaValidacao = document.getElementById('alerta-validacao');

                // 1. Validação manual para o novo sistema de cards
                if (!document.getElementById('data_hora_oculta').value) {
                    alertaValidacao.classList.remove('d-none'); // Mostra o alerta bonito
                    return; 
                }

                // Esconde o alerta se estiver tudo preenchido
                alertaValidacao.classList.add('d-none');

                // 2. Verifica se o médico foi preenchido (validação padrão)
                if (!agendarForm.checkValidity()) {
                    agendarForm.reportValidity(); 
                    return; 
                }
                
                // Se tudo estiver preenchido, abre o modal de confirmação
                scheduleModal.show();
            });
        }

        if (confirmScheduleBtn) {
            confirmScheduleBtn.addEventListener('click', function () {
                scheduleModal.hide();
                agendarForm.submit();
            });
        }
    }

    // ==========================================
    // 3. LÓGICA DO NOVO AGENDAMENTO POR CARDS
    // ==========================================
    const diasContainer = document.getElementById('dias-container');
    const turnoContainer = document.getElementById('turno-container');
    const horariosContainer = document.getElementById('horarios-container');
    const listaHorarios = document.getElementById('lista-horarios');
    const dataHoraOculta = document.getElementById('data_hora_oculta');
    const turnoBtns = document.querySelectorAll('.turno-btn');

    let dataSelecionada = '';
    let horaSelecionada = '';

    // Dicionário de dias da semana e horários
    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const blocosHorarios = {
        manha: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
        tarde: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
    };

    if (diasContainer) {
        // Gerar os próximos 5 dias úteis (Seg a Sex) a partir de amanhã
        let dataAtual = new Date();
        dataAtual.setDate(dataAtual.getDate() + 1); // Começa de amanhã

        let diasAdicionados = 0;
        
        while (diasAdicionados < 5) {
            // Se não for Domingo (0) nem Sábado (6)
            if (dataAtual.getDay() !== 0 && dataAtual.getDay() !== 6) {
                
                // Formatação segura YYYY-MM-DD
                const ano = dataAtual.getFullYear();
                const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
                const dia = String(dataAtual.getDate()).padStart(2, '0');
                const dataFormatadaBanco = `${ano}-${mes}-${dia}`;
                
                const nomeDia = nomesDias[dataAtual.getDay()];

                // Cria o Card do dia
                const card = document.createElement('div');
                card.className = 'date-card';
                card.dataset.data = dataFormatadaBanco;
                card.innerHTML = `<span class="d-block small text-uppercase mb-1">${nomeDia}</span><strong class="fs-5">${dia}/${mes}</strong>`;

                // Evento de clique no Card do dia
                card.addEventListener('click', function() {
                    // Remove seleção dos outros
                    document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    dataSelecionada = this.dataset.data;
                    horaSelecionada = '';
                    dataHoraOculta.value = ''; // Zera o input
                    
                    // Mostra os turnos e esconde horários antigos
                    turnoContainer.classList.remove('secao-oculta');
                    horariosContainer.classList.add('secao-oculta');
                    
                    // Reseta os botões de turno
                    turnoBtns.forEach(btn => {
                        btn.classList.remove('btn-primary', 'text-white');
                        btn.classList.add('btn-outline-primary');
                    });
                });

                diasContainer.appendChild(card);
                diasAdicionados++;
            }
            dataAtual.setDate(dataAtual.getDate() + 1);
        }

        // Lógica de clique nos Turnos (Manhã / Tarde)
        turnoBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Alterna as cores dos botões
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

                slot.addEventListener('click', function() {
                    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    horaSelecionada = hora;
                    // Preenche o campo oculto exatamente como o Python espera: YYYY-MM-DDTHH:MM
                    dataHoraOculta.value = `${dataSelecionada}T${horaSelecionada}`; 

                    // AQUI É ONDE ENTRA A NOVIDADE: Remove o alerta de erro da tela ao clicar num horário
                    const alertaValidacao = document.getElementById('alerta-validacao');
                    if (alertaValidacao) {
                        alertaValidacao.classList.add('d-none');
                    }
                });

                listaHorarios.appendChild(slot);
            });
        }
    }
}); 