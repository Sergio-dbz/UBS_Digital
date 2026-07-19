/* ==========================================================================
   editar_paciente.js - Scripts para a tela de edição de paciente
   ========================================================================== */

// Função matemática de validação de CPF (Padrão do sistema)
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
    const cpfInput = document.getElementById('cpf');
    const cnsInput = document.getElementById('cns');
    const telefoneInput = document.getElementById('telefone');
    const form = document.getElementById('editPatientForm');
    const openEditPatientModalBtn = document.getElementById('openEditPatientModalBtn');
    const confirmEditPatientBtn = document.getElementById('confirmEditPatientBtn');
    
    // Inicializa o modal do Bootstrap com segurança
    const editPatientModalElement = document.getElementById('editPatientModal');
    let editPatientModal;
    if (editPatientModalElement) {
        editPatientModal = new bootstrap.Modal(editPatientModalElement);
    }

    // ==========================================
    // FUNÇÕES DE MÁSCARA E FORMATAÇÃO
    // ==========================================
    
    function formatarCPF(value) {
        value = value.replace(/\D/g, '').slice(0, 11);
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
        return value;
    }

    function formatarTelefone(value) {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        let formatted = digits;

        if (digits.length === 10) {
            formatted = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 6) + '-' + digits.slice(6, 10);
        } else if (digits.length === 11) {
            formatted = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7, 11);
        }
        return formatted;
    }

    // Aplica formatação inicial (caso os dados venham sem máscara do banco)
    if (cpfInput && cpfInput.value) cpfInput.value = formatarCPF(cpfInput.value);
    if (telefoneInput && telefoneInput.value) telefoneInput.value = formatarTelefone(telefoneInput.value);

    // ==========================================
    // EVENTOS DOS CAMPOS (Digitação em tempo real)
    // ==========================================

    if (cpfInput) {
        cpfInput.addEventListener('input', function () {
            this.value = formatarCPF(this.value);
        });
    }

    if (cnsInput) {
        cnsInput.addEventListener('input', function () {
            // Garante que apenas números sejam digitados no CNS
            this.value = this.value.replace(/\D/g, '').slice(0, 15);
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function () {
            this.value = formatarTelefone(this.value);
        });
    }

    // ==========================================
    // LÓGICA DO MODAL DE SALVAR
    // ==========================================

    if (openEditPatientModalBtn && form) {
        openEditPatientModalBtn.addEventListener('click', function () {
            // Verifica se os campos obrigatórios estão preenchidos corretamente (HTML5)
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Validação Matemática do CPF
            if (cpfInput) {
                if (!validarCPFJS(cpfInput.value)) {
                    alert('CPF inválido! Verifique a digitação antes de salvar.');
                    cpfInput.focus();
                    return;
                }
            }

            // Validação de tamanho do CNS
            if (cnsInput) {
                const rawCns = cnsInput.value.replace(/\D/g, '');
                if (rawCns.length < 15) {
                    alert('O Cartão SUS (CNS) deve conter exatamente 15 números.');
                    cnsInput.focus();
                    return;
                }
            }
            
            // Validação de Telefone Completo
            if (telefoneInput) {
                const rawTelefone = telefoneInput.value.replace(/\D/g, '');
                if (rawTelefone !== '' && rawTelefone.length !== 10 && rawTelefone.length !== 11) {
                    alert('O telefone deve conter um número completo com 10 ou 11 dígitos.');
                    telefoneInput.focus();
                    return; 
                }
            }

            // Mostra o modal se tudo estiver correto
            if (editPatientModal) editPatientModal.show();
        });
    }

    if (confirmEditPatientBtn && form) {
        confirmEditPatientBtn.addEventListener('click', function () {
            // Limpa as máscaras do CPF e Telefone antes de enviar para o banco de dados
            if (cpfInput) cpfInput.value = cpfInput.value.replace(/\D/g, '');
            if (telefoneInput) telefoneInput.value = telefoneInput.value.replace(/\D/g, '');
            
            if (editPatientModal) editPatientModal.hide();
            form.submit();
        });
    }
});