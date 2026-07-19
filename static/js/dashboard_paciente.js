/* ==========================================================================
   dashboard_paciente.js - Scripts exclusivos do painel do paciente
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 1. MODAL DE CANCELAMENTO DE CONSULTA
    // ==========================================
    const cancelModalElement = document.getElementById('cancelModal');
    if (cancelModalElement) {
        const cancelModal = new bootstrap.Modal(cancelModalElement);
        const cancelButtons = document.querySelectorAll('.cancel-consulta-btn');
        const cancelData = document.getElementById('cancelConsultaData');
        const confirmLink = document.getElementById('confirmCancelLink');

        cancelButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const consultaId = this.getAttribute('data-consulta-id');
                const consultaData = this.getAttribute('data-consulta-data');

                if (cancelData) cancelData.textContent = consultaData;
                if (confirmLink) confirmLink.href = '/paciente/cancelar_consulta/' + consultaId;

                cancelModal.show();
            });
        });
    }

    // ==========================================
    // 2. MODAL DE AGENDAMENTO DE CONSULTA
    // ==========================================
    const scheduleModalElement = document.getElementById('scheduleModal');
    const agendarForm = document.getElementById('agendarForm');
    const scheduleButton = document.querySelector('.schedule-confirm-btn');
    const confirmScheduleBtn = document.getElementById('confirmScheduleBtn');

    if (scheduleModalElement && agendarForm) {
        const scheduleModal = new bootstrap.Modal(scheduleModalElement);

        if (scheduleButton) {
            scheduleButton.addEventListener('click', function () {
                // Verifica se o campo do médico e a data foram preenchidos
                if (!agendarForm.checkValidity()) {
                    agendarForm.reportValidity(); // Mostra o aviso "Preencha este campo"
                    return; // Impede que o modal abra com campos vazios
                }
                scheduleModal.show();
            });
        }

        if (confirmScheduleBtn) {
            confirmScheduleBtn.addEventListener('click', function () {
                scheduleModal.hide();
                agendarForm.submit();
            });
        }
    }
});