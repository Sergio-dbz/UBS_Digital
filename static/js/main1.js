/* ==========================================================================
   main1.js - Script Global RESTful (Tema e Logout)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 1. LÓGICA DO LOGOUT RESTFUL
    // ==========================================
    const botoesLogout = document.querySelectorAll('.acao-logout');
    
    botoesLogout.forEach(botao => {
        botao.addEventListener('click', async function (e) {
            e.preventDefault();
            
            try {
                // Chama a rota de logout da API usando POST
                const response = await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Limpa qualquer dado local se houver e redireciona para a tela de login
                    window.location.href = '/login';
                } else {
                    console.error('Erro ao tentar sair do sistema');
                }
            } catch (error) {
                console.error('Erro de conexão:', error);
            }
        });
    });

    // ==========================================
    // 2. LÓGICA DO TEMA ESCURO (Dark Mode)
    // ==========================================
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const body = document.body;
    
    // Verifica a preferência salva no navegador (LocalStorage)
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
        updateThemeUI(true);
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            body.classList.toggle('dark-theme');
            const isDark = body.classList.contains('dark-theme');
            
            // Salva a escolha do usuário
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            updateThemeUI(isDark);
        });
    });

    function updateThemeUI(isDark) {
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('.theme-icon');
            const text = btn.querySelector('.theme-text');
            
            if (icon && text) {
                if (isDark) {
                    icon.classList.remove('bi-moon-fill');
                    icon.classList.add('bi-sun-fill');
                    text.textContent = 'Tema Claro';
                } else {
                    icon.classList.remove('bi-sun-fill');
                    icon.classList.add('bi-moon-fill');
                    text.textContent = 'Tema Escuro';
                }
            }
        });
    }
});