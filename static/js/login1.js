document.addEventListener('DOMContentLoaded', function () {
    // Captura os elementos da tela
    const formPaciente = document.getElementById('loginFormPaciente');
    const formRecepcionista = document.getElementById('loginFormRecepcionista');
    const alertaLogin = document.getElementById('alerta-login');

    // Função central que faz a requisição REST
    async function realizarLogin(evento, tipoUsuario) {
        evento.preventDefault(); // Impede o recarregamento da tela
        alertaLogin.classList.add('d-none'); // Esconde alertas anteriores

        let usuario = '';
        let senha = '';

        // Descobre de qual aba a requisição está vindo e pega os dados corretos
        if (tipoUsuario === 'paciente') {
            usuario = document.getElementById('cpf').value;
            senha = document.getElementById('senha-paciente').value;
        } else {
            usuario = document.getElementById('login').value;
            senha = document.getElementById('senha-recep').value;
        }

        // Monta o pacote JSON
        const dados = {
            usuario: usuario,
            senha: senha,
            tipo: tipoUsuario
        };

        try {
            // Faz a chamada assíncrona para o nosso backend Flask (API)
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const resultado = await response.json();

            // Se a API retornar 200 OK
            if (response.ok) {
                // Redireciona o usuário para o painel correto
                if (resultado.tipo === 'paciente') {
                    window.location.href = '/paciente/dashboard';
                } else {
                    window.location.href = '/recepcionista/dashboard';
                }
            } else {
                // Se a API retornar erro (senha errada, etc), mostra a caixa vermelha
                alertaLogin.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${resultado.erro}`;
                alertaLogin.classList.remove('d-none');
            }
        } catch (error) {
            alertaLogin.innerHTML = `<i class="bi bi-wifi-off me-2"></i>Erro de conexão com o servidor.`;
            alertaLogin.classList.remove('d-none');
            console.error(error);
        }
    }

    // Adiciona os "escutadores" de clique nos botões de submit de cada aba
    if (formPaciente) {
        formPaciente.addEventListener('submit', function (e) {
            realizarLogin(e, 'paciente');
        });
    }

    if (formRecepcionista) {
        formRecepcionista.addEventListener('submit', function (e) {
            realizarLogin(e, 'recepcionista');
        });
    }

    // -----------------------------------------------------
    // Código para o botão do olhinho (Mostrar/Esconder Senha)
    // Mantive o seu código visual caso já estivesse usando
    // -----------------------------------------------------
    const toggleButtons = document.querySelectorAll('.password-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });
});