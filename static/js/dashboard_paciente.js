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
    const medicoSelect = document.getElementById('medico'); // Captura a escolha do médico

    let dataSelecionada = '';
    let horaSelecionada = '';
    let horariosOcupadosDoDia = []; // Vai guardar o que o Python responder

    // Dicionário de dias da semana e horários
    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const blocosHorarios = {
        manha: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
        tarde: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
    };

    // Se o paciente trocar de médico, resetamos as datas e horários por segurança
    if (medicoSelect) {
        medicoSelect.addEventListener('change', function() {
            document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
            turnoContainer.classList.add('secao-oculta');
            horariosContainer.classList.add('secao-oculta');
            dataHoraOculta.value = '';
        });
    }

    if (diasContainer) {
        let dataAtual = new Date();
        dataAtual.setDate(dataAtual.getDate() + 1);

        let diasAdicionados = 0;
        
        while (diasAdicionados < 5) {
            if (dataAtual.getDay() !== 0 && dataAtual.getDay() !== 6) {
                
                const ano = dataAtual.getFullYear();
                const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
                const dia = String(dataAtual.getDate()).padStart(2, '0');
                const dataFormatadaBanco = `${ano}-${mes}-${dia}`;
                const nomeDia = nomesDias[dataAtual.getDay()];

                const card = document.createElement('div');
                card.className = 'date-card';
                card.dataset.data = dataFormatadaBanco;
                card.innerHTML = `<span class="d-block small text-uppercase mb-1">${nomeDia}</span><strong class="fs-5">${dia}/${mes}</strong>`;

                card.addEventListener('click', function() {
                    // Proteção de UX: Obriga a escolher o médico primeiro
                    if (!medicoSelect.value) {
                        const alertaValidacao = document.getElementById('alerta-validacao');
                        alertaValidacao.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Por favor, selecione o Médico primeiro.';
                        alertaValidacao.classList.remove('d-none');
                        medicoSelect.focus();
                        return;
                    } else {
                        document.getElementById('alerta-validacao').classList.add('d-none');
                    }

                    document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    dataSelecionada = this.dataset.data;
                    horaSelecionada = '';
                    dataHoraOculta.value = '';
                    
                    // Mostra visual de "Carregando" (Opcional, mas dá charme)
                    horariosContainer.classList.add('secao-oculta');
                    
                    // CHAMA O PYTHON: Busca os horários ocupados via API (Fetch)
                    fetch(`/api/horarios_ocupados?medico_id=${medicoSelect.value}&data=${dataSelecionada}`)
                        .then(response => response.json())
                        .then(data => {
                            horariosOcupadosDoDia = data; // Salva a lista de '08:30', '10:00', etc.
                            
                            turnoContainer.classList.remove('secao-oculta');
                            
                            turnoBtns.forEach(btn => {
                                btn.classList.remove('btn-primary', 'text-white');
                                btn.classList.add('btn-outline-primary');
                            });
                        })
                        .catch(error => console.error('Erro ao buscar horários:', error));
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

                // A MÁGICA ACONTECE AQUI:
                // Se a hora estiver na lista que o Python retornou, pinta de cinza e bloqueia
                if (horariosOcupadosDoDia.includes(hora)) {
                    slot.classList.add('ocupado');
                    slot.title = "Horário indisponível";
                } else {
                    // Só adiciona o evento de clique se o horário estiver livre
                    slot.addEventListener('click', function() {
                        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                        this.classList.add('selected');
                        
                        horaSelecionada = hora;
                        dataHoraOculta.value = `${dataSelecionada}T${horaSelecionada}`; 

                        const alertaValidacao = document.getElementById('alerta-validacao');
                        if (alertaValidacao) {
                            alertaValidacao.classList.add('d-none');
                        }
                    });
                }

                listaHorarios.appendChild(slot);
            });
        }
    }
}); 