/**
 * Arquivo principal de inicialização (Versão com inicialização robusta)
 */

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM completamente carregado. Iniciando a aplicação...');
        const app = new MainApp();
        
        window.runnerAnalysis = {
            app: app,
            debug: () => app.debug(),
            reset: () => app.reset(),
            version: '1.1.0'
        };
    } catch (error) {
        console.error("ERRO CRÍTICO AO INICIAR A APLICAÇÃO:", error);
        document.body.innerHTML = `<div style="padding: 40px; text-align: center; font-family: sans-serif; color: red;">
            <h1>Erro Crítico na Aplicação</h1>
            <p>Não foi possível carregar o sistema. Por favor, verifique o console do desenvolvedor (F12) para detalhes técnicos.</p>
        </div>`;
    }
});

class MainApp {
    constructor() {
        this.start();
    }

    start() {
        try {
            console.log('🚀 MainApp.start() foi chamado.');
            this.checkDependencies();
            this.initializeSidebar();
            window.tabManager = new TabManager();
            console.log('✅ Sistema inicializado com sucesso!');
        } catch (error) {
            console.error('Erro dentro do método start():', error);
        }
    }

    checkDependencies() {
        console.log('Verificando dependências...');
        const dependencies = [
            { name: 'jsPDF', check: () => window.jspdf },
            { name: 'Chart.js', check: () => window.Chart }
        ];
        const missing = dependencies.filter(dep => !dep.check());
        if (missing.length > 0) {
            console.warn('⚠️ Dependências faltando:', missing.map(d => d.name));
        } else {
            console.log('✅ Todas as dependências carregadas.');
        }
    }

    initializeSidebar() {
        const toggleBtn = document.getElementById('toggle-sidebar');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (!toggleBtn || !sidebar || !overlay) {
            console.error('Elementos essenciais da sidebar não encontrados');
            return;
        }

        const isMobile = () => window.innerWidth < 768;

        const toggleSidebar = () => {
            if (isMobile()) {
                const isOpen = sidebar.classList.contains('mobile-open');
                sidebar.classList.toggle('mobile-open', !isOpen);
                overlay.classList.toggle('visible', !isOpen);
            } else {
                const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
                sidebar.classList.toggle('sidebar-collapsed', !isCollapsed);
                appData.set('sidebarCollapsed', !isCollapsed);
            }
        };

        toggleBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar); // Fecha ao clicar no overlay

        // Fecha o menu mobile ao clicar em um botão da sidebar
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (isMobile()) {
                    toggleSidebar();
                }
            });
        });

        // Garante que o estado da sidebar (desktop) seja restaurado ao carregar
        if (!isMobile()) {
            const isCollapsed = appData.get('sidebarCollapsed') || false;
            if (isCollapsed) {
                sidebar.classList.add('sidebar-collapsed');
            }
        }

        console.log('✅ Sidebar inicializado com lógica responsiva.');
    }
}
