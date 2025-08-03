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
        if (!toggleBtn || !sidebar) {
            console.error('Elementos do sidebar não encontrados');
            return;
        }
        const isCollapsed = appData.get('sidebarCollapsed') || false;
        if (isCollapsed) {
            sidebar.classList.add('sidebar-collapsed');
        }
        toggleBtn.addEventListener('click', () => {
            const currentState = sidebar.classList.contains('sidebar-collapsed');
            sidebar.classList.toggle('sidebar-collapsed', !currentState);
            appData.set('sidebarCollapsed', !currentState);
        });
        console.log('✅ Sidebar inicializado.');
    }
}
