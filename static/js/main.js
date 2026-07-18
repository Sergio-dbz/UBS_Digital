/* ==========================================================================
   main.js - Scripts Globais do Sistema UBS Digital
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 1. CONTROLE DE MENSAGENS FLASH (AUTO-DISMISS)
    // ==========================================
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(function (alert) {
        const delay = parseInt(alert.getAttribute('data-bs-delay') || '10000', 10);
        window.setTimeout(function () {
            if (alert && alert.classList.contains('show')) {
                bootstrap.Alert.getOrCreateInstance(alert).close();
            }
        }, delay);
    });

    // ==========================================
    // 2. CONTROLE DO TEMA (DARK / LIGHT MODE)
    // ==========================================
    
    // A MUDANÇA FOI AQUI: Trocamos getElementById por querySelector
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');
    const body = document.body;

    function setDarkVisual() {
        body.classList.add('dark-theme');
        if (themeIcon) themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        if (themeText) themeText.innerText = 'Tema Claro';
    }

    function setLightVisual() {
        body.classList.remove('dark-theme');
        if (themeIcon) themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        if (themeText) themeText.innerText = 'Tema Escuro';
    }

    // Verifica preferência salva
    const savedTheme = localStorage.getItem('ubsTheme');
    if (savedTheme === 'dark') {
        setDarkVisual();
    }

    // Ação do botão
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Impede o fechamento do dropdown
            
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('ubsTheme', 'light');
                setLightVisual();
            } else {
                localStorage.setItem('ubsTheme', 'dark');
                setDarkVisual();
            }
        });
    }
});