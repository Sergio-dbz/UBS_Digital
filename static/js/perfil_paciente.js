/* ==========================================================================
   perfil_paciente.js - Scripts exclusivos do Perfil do Paciente
   ========================================================================== */

// Função de Máscara para o Telefone
function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, ''); 
    if (valor.length > 11) valor = valor.slice(0, 11);
    
    // Aplica a formatação apenas se o número estiver completo (11 dígitos)
    if (valor.length === 11) {
        input.value = '(' + valor.substring(0, 2) + ') ' + valor.substring(2, 7) + '-' + valor.substring(7, 11);
    } else {
        input.value = valor; 
    }
}

// Função para validar formulário e abrir o Modal
function validarEConfirmar() {
    const form = document.getElementById('formPerfil');
    const campoTelefone = document.getElementById('telefone');

    if (form.checkValidity()) {
        // Validação extra: Se houver algo digitado no telefone, exige 11 números
        if (campoTelefone && campoTelefone.value) {
            let numeros = campoTelefone.value.replace(/\D/g, '');
            if (numeros.length > 0 && numeros.length !== 11) {
                alert('O telefone deve conter exatamente 11 dígitos com DDD.');
                campoTelefone.focus();
                return;
            }
        }

        const modalConfirmacao = new bootstrap.Modal(document.getElementById('confirmSaveModal'));
        modalConfirmacao.show();
    } else {
        form.reportValidity();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 1. Aplica a máscara assim que a página carrega (se já vier dado do banco)
    const campoTelefone = document.getElementById('telefone');
    
    if(campoTelefone && campoTelefone.value) {
        let numeros = campoTelefone.value.replace(/\D/g, '');
        campoTelefone.value = numeros; // Reseta para números puros
        mascaraTelefone(campoTelefone); // Aplica a formatação visual
    }

    // 2. Limpa a máscara do telefone ANTES de enviar o formulário (Salva só os números no banco)
    const formPerfil = document.getElementById('formPerfil');
    if (formPerfil && campoTelefone) {
        formPerfil.addEventListener('submit', function() {
            campoTelefone.value = campoTelefone.value.replace(/\D/g, '');
        });
    }
});