/* ==========================================================================
   dashboard_recepcionista.js - Scripts do painel da recepcionista
   ========================================================================== */

// Função matemática de validação de CPF
function validarCPFJS(cpf) {
    cpf = cpf.replace(/\D/g, ''); 
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    // ==========================================
    // 1. ELEMENTOS DO CADASTRO DE PACIENTE
    // ==========================================
    const form = document.getElementById('formCadastro');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const passwordToggleButtons = document.querySelectorAll('.password-toggle');
    
    const openPatientRegisterModalBtn = document.getElementById('openPatientRegisterModalBtn');
    const confirmPatientRegisterBtn = document.getElementById('confirmPatientRegisterBtn');
    const patientRegisterModalElement = document.getElementById('patientRegisterModal');
    
    // Instancia o modal apenas se ele existir na página
    let patientRegisterModal;
    if (patientRegisterModalElement) {
        patientRegisterModal = new bootstrap.Modal(patientRegisterModalElement);
    }

    // --- Máscara de CPF ---
    if (cpfInput) {
        cpfInput.addEventListener('input', function () {
            this.classList.remove('is-invalid'); // Tira o vermelho quando digita
            let value = this.value.replace(/\D/g, '').slice(0, 11);
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            this.value = value;
        });
    }

    // --- Máscara de Telefone ---
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function () {
            const digits = this.value.replace(/\D/g, '').slice(0, 11);
            let formatted = digits;
            if (digits.length === 10) {
                formatted = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 6) + '-' + digits.slice(6, 10);
            } else if (digits.length === 11) {
                formatted = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7, 11);
            }
            this.value = formatted;
        });
    }

    // --- Mostrar/Ocultar Senha ---
    passwordToggleButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'bi bi-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'bi bi-eye';
                }
            }
        });
    });

    // ==========================================
    // ZERAR O FORMULÁRIO AO CLICAR NA ABA
    // ==========================================
    const tabCadastrar = document.getElementById('cadastrar-tab');
    
    if (tabCadastrar && form) {
        tabCadastrar.addEventListener('click', function() {
            form.reset(); 
            const camposComErro = form.querySelectorAll('.is-invalid');
            camposComErro.forEach(function(campo) {
                campo.classList.remove('is-invalid');
            });
        });
    }
    
    // ==========================================
    // 2. LÓGICA DE VALIDAÇÃO E ENVIO DO MODAL
    // ==========================================
    if (openPatientRegisterModalBtn && form) {
        openPatientRegisterModalBtn.addEventListener('click', function () {
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (cpfInput) {
                cpfInput.classList.remove('is-invalid');
                if (!validarCPFJS(cpfInput.value)) {
                    cpfInput.classList.add('is-invalid'); 
                    cpfInput.focus();
                    return; 
                }
            }

            if (telefoneInput) {
                const rawTelefone = telefoneInput.value.replace(/\D/g, '');
                if (rawTelefone !== '' && rawTelefone.length !== 10 && rawTelefone.length !== 11) {
                    alert('O telefone deve conter um número completo com 10 ou 11 dígitos.');
                    telefoneInput.focus();
                    return; 
                }
            }

            patientRegisterModal.show();
        });
    }

    if (confirmPatientRegisterBtn && form) {
        confirmPatientRegisterBtn.addEventListener('click', function () {
            patientRegisterModal.hide();
            if(cpfInput) cpfInput.value = cpfInput.value.replace(/\D/g, '');
            if(telefoneInput) telefoneInput.value = telefoneInput.value.replace(/\D/g, '');
            form.submit();
        });
    }

    // ==========================================
    // 3. LÓGICA DO MODAL DE STATUS DA CONSULTA
    // ==========================================
    const statusModalElement = document.getElementById('receptionistStatusModal');
    if (statusModalElement) {
        const statusModal = new bootstrap.Modal(statusModalElement);
        const confirmButtons = document.querySelectorAll('.receptionist-confirm-btn');
        const cancelButtons = document.querySelectorAll('.receptionist-cancel-btn');
        const statusMessage = document.getElementById('receptionistStatusMessage');
        const statusIcon = document.getElementById('receptionistStatusIcon');
        const confirmLink = document.getElementById('confirmReceptionistStatusLink');

        function openStatusModal(button) {
            const consultaId = button.getAttribute('data-consulta-id');
            const consultaData = button.getAttribute('data-consulta-data');
            const pacienteNome = button.getAttribute('data-paciente-nome');
            const action = button.getAttribute('data-action');

            if (statusMessage) {
                if (action === 'Realizada') {
                    statusMessage.innerHTML = 'Você está prestes a confirmar a presença de <strong>' + pacienteNome + '</strong> na consulta agendada para <strong>' + consultaData + '</strong>.';
                } else {
                    statusMessage.innerHTML = 'Você está prestes a confirmar a ausência de <strong>' + pacienteNome + '</strong> na consulta agendada para <strong>' + consultaData + '</strong>.';
                }
            }

            if (statusIcon) {
                const iconClass = action === 'Realizada' ? 'bi bi-calendar2-check-fill' : 'bi bi-exclamation-triangle-fill';
                statusIcon.innerHTML = '<i class="' + iconClass + '"></i>';
                statusIcon.className = 'mb-3 ' + (action === 'Realizada' ? 'schedule-icon' : 'cancel-icon');
            }

            if (confirmLink) {
                confirmLink.href = '/recepcionista/atualizar_status/' + consultaId + '/' + action;
                confirmLink.className = 'btn ' + (action === 'Realizada' ? 'btn-schedule-success' : 'btn-cancel-danger');
                confirmLink.textContent = action === 'Realizada' ? 'Confirmar presença' : 'Confirmar ausência';
            }

            statusModal.show();
        }

        confirmButtons.forEach(btn => btn.addEventListener('click', function() { openStatusModal(this); }));
        cancelButtons.forEach(btn => btn.addEventListener('click', function() { openStatusModal(this); }));
    }

    // ==========================================
    // 4. LÓGICA DO MODAL DE DELETAR PACIENTE
    // ==========================================
    const deleteModalElement = document.getElementById('deletePatientModal');
    if (deleteModalElement) {
        const deletePatientModal = new bootstrap.Modal(deleteModalElement);
        const deletePatientButtons = document.querySelectorAll('.delete-patient-btn');
        const deletePatientMessage = document.getElementById('deletePatientMessage');
        const deletePatientForm = document.getElementById('deletePatientForm');

        deletePatientButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const pacienteId = this.getAttribute('data-paciente-id');
                const pacienteNome = this.getAttribute('data-paciente-nome');
                
                deletePatientMessage.innerHTML = 'Você está prestes a deletar o paciente <strong>' + pacienteNome + '</strong> do sistema.';
                deletePatientForm.action = '/deletar_paciente/' + pacienteId;
                
                deletePatientModal.show();
            });
        });
    }
});