/* ==========================================================================
   perfil_paciente1.js - Motor RESTful do Perfil
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    
    // 1. Aplica a máscara no telefone (aproveitando o IMask global)
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput && typeof IMask !== 'undefined') {
        IMask(telefoneInput, {
            mask: '(00) 00000-0000'
        });
    }

    // 2. Elementos da Tela
    const btnPrepararSalvar = document.getElementById('btnPrepararSalvar');
    const btnConfirmarSalvar = document.getElementById('btnConfirmarSalvar');
    const alertaPerfil = document.getElementById('alerta-perfil');
    
    const modalElement = document.getElementById('confirmSaveModal');
    let confirmModal;
    if (modalElement) {
        confirmModal = new bootstrap.Modal(modalElement);
    }

    // 3. Ao clicar em Salvar na tela principal
    if (btnPrepararSalvar) {
        btnPrepararSalvar.addEventListener('click', function () {
            // Esconde alertas antigos
            alertaPerfil.classList.add('d-none');
            
            // Validação simples de campos HTML5
            const form = document.getElementById('formPerfil');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            // Mostra o Modal
            confirmModal.show();
        });
    }

    // 4. Ao clicar em Confirmar dentro do Modal (Chamada na API)
    if (btnConfirmarSalvar) {
        btnConfirmarSalvar.addEventListener('click', async function () {
            btnConfirmarSalvar.disabled = true;
            btnConfirmarSalvar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';

            const telefoneValor = telefoneInput.value;
            const emailValor = document.getElementById('email').value;

            try {
                const response = await fetch('/api/paciente/perfil', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        telefone: telefoneValor,
                        email: emailValor
                    })
                });

                const data = await response.json();
                confirmModal.hide();

                if (response.ok) {
                    // Exibe alerta Verde de Sucesso
                    alertaPerfil.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>${data.mensagem}`;
                    alertaPerfil.className = 'alert alert-success mb-3 shadow-sm';
                    alertaPerfil.classList.remove('d-none');

                    // SOMA O TEMPORIZADOR: Some com a mensagem após 4 segundos (4000ms)
                    setTimeout(() => {
                        alertaPerfil.classList.add('d-none');
                    }, 4000);

                } else {
                    // Exibe alerta Vermelho de Erro
                    alertaPerfil.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${data.erro}`;
                    alertaPerfil.className = 'alert alert-danger mb-3 shadow-sm';
                    alertaPerfil.classList.remove('d-none');
                }

            } catch (error) {
                confirmModal.hide();
                alertaPerfil.innerHTML = `<i class="bi bi-wifi-off me-2"></i>Erro de conexão com o servidor.`;
                alertaPerfil.className = 'alert alert-danger mb-3 shadow-sm';
                alertaPerfil.classList.remove('d-none');
            } finally {
                btnConfirmarSalvar.disabled = false;
                btnConfirmarSalvar.innerHTML = '<i class="bi bi-check-lg me-2"></i>Confirmar';
            }
        });
    }
});