/* ==========================================================================
   editar_paciente1.js - Motor RESTful de Edição de Paciente
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    
    // 1. Aplicação de máscaras
    const cpfInput = document.getElementById('cpf');
    if (cpfInput && typeof IMask !== 'undefined') {
        IMask(cpfInput, { mask: '000.000.000-00' });
    }

    const telInput = document.getElementById('telefone');
    if (telInput && typeof IMask !== 'undefined') {
        IMask(telInput, { mask: '(00) 00000-0000' });
    }

    const alertaEdicao = document.getElementById('alerta-edicao');
    const form = document.getElementById('editPatientForm');
    const pacienteId = form ? form.getAttribute('data-paciente-id') : null;

    // 2. Modal de Confirmação
    const modalEl = document.getElementById('editPatientModal');
    let editModal = modalEl ? new bootstrap.Modal(modalEl) : null;

    const openModalBtn = document.getElementById('openEditPatientModalBtn');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function () {
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            if (editModal) editModal.show();
        });
    }

    // 3. Confirmação e Envio via API (PUT)
    const confirmBtn = document.getElementById('confirmEditPatientBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async function () {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';

            const payload = {
                nome: document.getElementById('nome').value,
                cpf: document.getElementById('cpf').value,
                cns: document.getElementById('cns').value,
                telefone: document.getElementById('telefone').value,
                data_nascimento: document.getElementById('data_nascimento').value
            };

            try {
                const response = await fetch(`/api/recepcionista/pacientes/${pacienteId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (editModal) editModal.hide();

                if (response.ok) {
                    // Exibe mensagem de sucesso e redireciona de volta ao painel após 1.5s
                    alertaEdicao.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>${data.mensagem || 'Paciente atualizado com sucesso!'}`;
                    alertaEdicao.className = 'alert alert-success mb-4 shadow-sm';
                    alertaEdicao.classList.remove('d-none');

                    setTimeout(() => {
                        window.location.href = '/recepcionista/dashboard';
                    }, 1500);
                } else {
                    alertaEdicao.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${data.erro || 'Erro ao atualizar dados.'}`;
                    alertaEdicao.className = 'alert alert-danger mb-4 shadow-sm';
                    alertaEdicao.classList.remove('d-none');
                }
            } catch (error) {
                if (editModal) editModal.hide();
                alertaEdicao.innerHTML = `<i class="bi bi-wifi-off me-2"></i>Erro de conexão com o servidor.`;
                alertaEdicao.className = 'alert alert-danger mb-4 shadow-sm';
                alertaEdicao.classList.remove('d-none');
            } finally {
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Confirmar e Salvar';
            }
        });
    }
});