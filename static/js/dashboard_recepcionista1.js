/* ==========================================================================
   dashboard_recepcionista1.js - Motor RESTful da Recepcionista
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    
    // 1. Máscaras automáticas (CPF e Telefone)
    const cpfInput = document.getElementById('cpf');
    if (cpfInput && typeof IMask !== 'undefined') {
        IMask(cpfInput, { mask: '000.000.000-00' });
    }

    const telInput = document.getElementById('telefone');
    if (telInput && typeof IMask !== 'undefined') {
        IMask(telInput, { mask: '(00) 00000-0000' });
    }

    const alertaRecep = document.getElementById('alerta-recep');

    // ==========================================
    // 2. CADASTRO DE PACIENTE (API POST)
    // ==========================================
    const registerModalEl = document.getElementById('patientRegisterModal');
    let registerModal = registerModalEl ? new bootstrap.Modal(registerModalEl) : null;
    
    const openRegisterBtn = document.getElementById('openPatientRegisterModalBtn');
    if (openRegisterBtn) {
        openRegisterBtn.addEventListener('click', function () {
            const form = document.getElementById('formCadastroPaciente');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            if (registerModal) registerModal.show();
        });
    }

    const confirmRegisterBtn = document.getElementById('confirmPatientRegisterBtn');
    if (confirmRegisterBtn) {
        confirmRegisterBtn.addEventListener('click', async function () {
            confirmRegisterBtn.disabled = true;
            confirmRegisterBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cadastrando...';

            const payload = {
                nome: document.getElementById('nome').value,
                cpf: document.getElementById('cpf').value,
                cns: document.getElementById('cns').value,
                senha: document.getElementById('senha').value,
                telefone: document.getElementById('telefone').value,
                data_nascimento: document.getElementById('data_nascimento').value
            };

            try {
                const response = await fetch('/api/recepcionista/pacientes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (registerModal) registerModal.hide();

                if (response.ok) {
                    window.location.reload();
                } else {
                    alertaRecep.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${data.erro}`;
                    alertaRecep.className = 'alert alert-danger mb-4 shadow-sm';
                    alertaRecep.classList.remove('d-none');
                }
            } catch (error) {
                if (registerModal) registerModal.hide();
                alertaRecep.innerHTML = `<i class="bi bi-wifi-off me-2"></i>Erro de conexão com o servidor.`;
                alertaRecep.className = 'alert alert-danger mb-4 shadow-sm';
                alertaRecep.classList.remove('d-none');
            } finally {
                confirmRegisterBtn.disabled = false;
                confirmRegisterBtn.textContent = 'Confirmar cadastro';
            }
        });
    }

    // ==========================================
    // 3. ATUALIZAR STATUS DE CONSULTA (API PUT)
    // ==========================================
    const statusModalEl = document.getElementById('receptionistStatusModal');
    let statusModal = statusModalEl ? new bootstrap.Modal(statusModalEl) : null;
    
    let consultaAlvoId = null;
    let novoStatusAlvo = null;

    const botoesAcao = document.querySelectorAll('.receptionist-confirm-btn, .receptionist-cancel-btn');
    console.log("Botões de status encontrados na tela:", botoesAcao.length);

    botoesAcao.forEach(button => {
        button.addEventListener('click', function () {
            consultaAlvoId = this.getAttribute('data-consulta-id');
            novoStatusAlvo = this.getAttribute('data-action');
            const pacienteNome = this.getAttribute('data-paciente-nome');
            const dataConsulta = this.getAttribute('data-consulta-data');

            const mensagemModal = document.getElementById('receptionistStatusMessage');
            if (mensagemModal) {
                mensagemModal.textContent = `Deseja marcar a consulta de ${pacienteNome} (${dataConsulta}) como '${novoStatusAlvo}'?`;
            }
            
            if (statusModal) statusModal.show();
        });
    });

    const confirmStatusBtn = document.getElementById('confirmStatusChangeBtn');
    if (confirmStatusBtn) {
        confirmStatusBtn.addEventListener('click', async function () {
            if (!consultaAlvoId || !novoStatusAlvo) return;

            confirmStatusBtn.disabled = true;
            confirmStatusBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Atualizando...';

            try {
                const response = await fetch(`/api/recepcionista/consultas/${consultaAlvoId}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: novoStatusAlvo })
                });

                const data = await response.json(); // Lê a resposta (tanto sucesso quanto erro)

                if (response.ok) {
                    // Esconde o modal
                    if (statusModal) statusModal.hide();

                    // Exibe a barra verde de sucesso
                    alertaRecep.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>${data.mensagem}`;
                    alertaRecep.className = 'alert alert-success mb-4 shadow-sm';
                    alertaRecep.classList.remove('d-none');

                    // Aguarda 1.5 segundos para o usuário ler a mensagem antes de atualizar a tabela
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                    
                } else {
                    if (statusModal) statusModal.hide();
                    alertaRecep.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${data.erro || 'Erro ao atualizar status.'}`;
                    alertaRecep.className = 'alert alert-danger mb-4 shadow-sm';
                    alertaRecep.classList.remove('d-none');
                }
            } catch (error) {
                if (statusModal) statusModal.hide();
                console.error("Erro:", error);
            } finally {
                confirmStatusBtn.disabled = false;
                confirmStatusBtn.textContent = 'Confirmar';
            }
        });
    }

    // ==========================================
    // 4. DELETAR PACIENTE (API DELETE)
    // ==========================================
    const deleteModalEl = document.getElementById('deletePatientModal');
    let deleteModal = deleteModalEl ? new bootstrap.Modal(deleteModalEl) : null;
    let pacienteParaDeletarId = null;

    document.querySelectorAll('.delete-patient-btn').forEach(button => {
        button.addEventListener('click', function () {
            pacienteParaDeletarId = this.getAttribute('data-paciente-id');
            const nomePaciente = this.getAttribute('data-paciente-nome');

            document.getElementById('deletePatientMessage').textContent = 
                `Você está prestes a deletar o(a) paciente ${nomePaciente} do sistema.`;
            
            if (deleteModal) deleteModal.show();
        });
    });

    const confirmDeleteBtn = document.getElementById('confirmDeletePatientBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function () {
            if (!pacienteParaDeletarId) return;

            confirmDeleteBtn.disabled = true;
            confirmDeleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deletando...';

            try {
                const response = await fetch(`/api/recepcionista/pacientes/${pacienteParaDeletarId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    const data = await response.json();
                    if (deleteModal) deleteModal.hide();
                    alertaRecep.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${data.erro}`;
                    alertaRecep.className = 'alert alert-danger mb-4 shadow-sm';
                    alertaRecep.classList.remove('d-none');
                }
            } catch (error) {
                if (deleteModal) deleteModal.hide();
                console.error("Erro:", error);
            } finally {
                confirmDeleteBtn.disabled = false;
                confirmDeleteBtn.textContent = 'Confirmar exclusão';
            }
        });
    }
});