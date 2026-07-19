/* ==========================================================================
   login.js - Scripts exclusivos da tela de Login do sistema
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 1. MÁSCARA DE CPF EM TEMPO REAL
    // ==========================================
    const cpfInput = document.getElementById('cpf');

    if (cpfInput) {
        cpfInput.addEventListener('input', function () {
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

    // ==========================================
    // 2. BOTÃO DE MOSTRAR / OCULTAR SENHA
    // ==========================================
    const passwordToggleButtons = document.querySelectorAll('.password-toggle');
    
    passwordToggleButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (!input || !icon) return;

            const isPassword = input.type === 'password';
            
            // Troca o tipo do campo
            input.type = isPassword ? 'text' : 'password';
            
            // Troca o ícone (olho aberto / olho fechado)
            icon.classList.toggle('bi-eye', !isPassword);
            icon.classList.toggle('bi-eye-slash', isPassword);
            
            // Acessibilidade
            this.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
        });
    });

    // ==========================================
    // 3. LIMPEZA DOS DADOS ANTES DE ENVIAR
    // ==========================================
    // Remove os pontos e o traço do CPF para o banco de dados processar apenas os números
    const formPaciente = document.querySelector('form[action="/login"]'); // ou o seletor exato do seu form
    
    if (formPaciente && cpfInput) {
        formPaciente.addEventListener('submit', function () {
            cpfInput.value = cpfInput.value.replace(/\D/g, '');
        });
    }
});