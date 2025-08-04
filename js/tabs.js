/**
 * Gerenciador de Tabs e Interface (Versão com visual corrigido)
 */

class TabManager {
    constructor() {
        this.tabContent = document.getElementById('tab-content');
        this.pageTitle = document.getElementById('page-title');
        this.pageSubtitle = document.getElementById('page-subtitle');
        this.sidebar = document.getElementById('sidebar');
        this.sidebarOverlay = document.getElementById('sidebar-overlay');
        this.toggleBtn = document.getElementById('toggle-sidebar');
        this.initializeTabs();
        this.setupSidebarToggle();
    }

    initializeTabs() {
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchToTab(e.currentTarget.dataset.tab);
                this.hideSidebarOnMobile();
            });
        });
        this.switchToTab(appData.get('activeTab') || 'entrada');
    }

    setupSidebarToggle() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
        if (this.sidebarOverlay) {
            this.sidebarOverlay.addEventListener('click', () => {
                this.hideSidebarOnMobile();
            });
        }
    }

    toggleSidebar() {
        if (window.innerWidth <= 768) {
            this.sidebar.classList.toggle('mobile-open');
            this.sidebarOverlay.classList.toggle('visible');
            this.sidebarOverlay.classList.toggle('hidden');
        }
    }

    hideSidebarOnMobile() {
        if (window.innerWidth <= 768) {
            this.sidebar.classList.remove('mobile-open');
            this.sidebarOverlay.classList.remove('visible');
            this.sidebarOverlay.classList.add('hidden');
        }
    }
    switchToTab(tabName) {
        appData.set('activeTab', tabName);
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        this.updatePageHeader(tabName);
        this.loadTabContent(tabName);
    }

    updatePageHeader(tabName) {
        const headers = {
            'entrada': { title: 'Entrada de Dados', subtitle: 'Preencha os dados da prova e do corredor' },
            'analise': { title: 'Análise e Estratégia', subtitle: 'Estratégias personalizadas para sua corrida' },
            'pos-prova': { title: 'Análise Pós-Prova', subtitle: 'Compare resultados e otimize futuras corridas' }
        };
        const header = headers[tabName] || headers['entrada'];
        this.pageTitle.textContent = header.title;
        this.pageSubtitle.textContent = header.subtitle;

        // Atualiza o título da aba do navegador para SEO e UX
        document.title = `Análise de Corrida - ${header.title}`;
    }

    loadTabContent(tabName) {
        this.tabContent.innerHTML = '';
        this.tabContent.className = 'fade-in';
        switch (tabName) {
            case 'entrada': this.loadEntradaTab(); break;
            case 'analise': this.loadAnaliseTab(); break;
            case 'pos-prova': this.loadPosProvaTab(); break;
            default: this.loadEntradaTab();
        }
    }

    loadEntradaTab() {
        this.tabContent.innerHTML = `
            <div class="space-y-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="analysis-card p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4">📍 Informações da Prova</h3>
                        <div class="space-y-4">
                            <div><label class="block text-sm font-medium text-gray-700 mb-1 required">Nome da Corrida</label><input type="text" id="raceName" data-mask="raceName" placeholder="Ex: Maratona de São Paulo" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
                            <div class="flex flex-wrap gap-4">
                                <div><label class="block text-sm font-medium text-gray-700 mb-1">Data</label><input type="date" id="raceDate" class="w-36 px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
                                <div><label class="block text-sm font-medium text-gray-700 mb-1 required">Distância (km)</label><input type="text" id="raceDistance" data-mask="distance" placeholder="10" class="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
                                <div><label class="block text-sm font-medium text-gray-700 mb-1">Percurso</label><select id="raceType" class="w-36 px-3 py-2 border border-gray-300 rounded-md text-sm"><option value="Rua">Rua</option><option value="Trilha">Trilha</option></select></div>
                            </div>
                        </div>
                    </div>
                    <div class="analysis-card p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-4">👤 Dados do Corredor</h3>
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">Idade</label><input type="text" id="runnerAge" data-mask="age" placeholder="30" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label><input type="text" id="runnerWeight" data-mask="weight" placeholder="70" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">Altura (m)</label><input type="text" id="runnerHeight" data-mask="height" placeholder="1.75" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">Experiência</label><select id="runnerExperience" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"><option value="Iniciante">Iniciante</option><option value="Intermediário" selected>Intermediário</option><option value="Avançado">Avançado</option></select></div>
                        </div>
                         <h4 class="text-md font-semibold mt-6 mb-4">⏱️ Recordes Pessoais (PBs)</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">5K (mm:ss)</label><input type="text" id="pb5k" data-mask="time" placeholder="25:00" class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"></div>
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">10K (mm:ss)</label><input type="text" id="pb10k" data-mask="time" placeholder="50:00" class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"></div>
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">21K (h:mm:ss)</label><input type="text" id="pb21k" data-mask="longTime" placeholder="1:50:00" class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"></div>
                            <div><label class="block text-sm font-medium text-gray-700 mb-1">42K (h:mm:ss)</label><input type="text" id="pb42k" data-mask="longTime" placeholder="4:00:00" class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-8 text-center"><button id="generate-analysis" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all">Gerar Análise Completa</button></div>
            </div>`;
        this.setupEntradaTabEvents();
        this.loadFormData();
        setupInputMasksAndValidation();
    }

    setupEntradaTabEvents() {
        document.getElementById('generate-analysis').addEventListener('click', () => this.generateAnalysis());
        const fields = ['raceName', 'raceDate', 'raceDistance', 'raceType', 'runnerAge', 'runnerWeight', 'runnerHeight', 'runnerExperience', 'pb5k', 'pb10k', 'pb21k', 'pb42k'];
        fields.forEach(id => {
            const field = document.getElementById(id);
            if (field) field.addEventListener('input', () => appData.set(id, field.value));
        });
    }

    loadFormData() {
        const fields = ['raceName', 'raceDate', 'raceDistance', 'raceType', 'runnerAge', 'runnerWeight', 'runnerHeight', 'runnerExperience', 'pb5k', 'pb10k', 'pb21k', 'pb42k'];
        fields.forEach(id => {
            const field = document.getElementById(id);
            const value = appData.get(id);
            if (field && value) field.value = value;
        });
    }

    generateAnalysis() {
        document.getElementById('loading-overlay').classList.remove('hidden');
        const validation = appData.validateRequiredData();
        if (!validation.isValid) {
            alert(`Erro de Validação: ${validation.errors.join(', ')}`);
            document.getElementById('loading-overlay').classList.add('hidden');
            return;
        }
        setTimeout(() => {
            try {
                const analysis = analysisEngine.generateCompleteAnalysis(appData.data);
                appData.set('analysis', analysis);
                this.switchToTab('analise');
            } catch (error) {
                alert('Erro ao gerar análise: ' + error.message);
            } finally {
                document.getElementById('loading-overlay').classList.add('hidden');
            }
        }, 500);
    }

    loadAnaliseTab() {
        const analysis = appData.get('analysis');
        if (!analysis) {
            this.tabContent.innerHTML = `<div class="text-center py-16"><div class="text-6xl mb-4">📊</div><h3 class="text-2xl font-bold text-gray-800">Análise Não Gerada</h3><p class="text-gray-500 mt-2">Volte para a aba 'Entrada de Dados' para gerar sua análise personalizada.</p></div>`;
            return;
        }
        this.tabContent.innerHTML = this.renderAnalysisContent(analysis);
        document.getElementById('export-pdf').addEventListener('click', () => {
            pdfExporter.exportAnalysisReport(appData.get('analysis'), appData.data);
        });
    }

    renderAnalysisContent(analysis) {
        const { healthAnalysis, timeEstimate, segmentStrategy, hydrationPlan, equipmentRecommendations, performanceComparison } = analysis;
        return `<div class="space-y-8">
            <div class="flex justify-between items-center analysis-card p-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-900">Análise Completa Gerada</h3>
                    <p class="text-sm text-gray-600">Revise sua estratégia personalizada para a corrida</p>
                </div>
                <button id="export-pdf" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    Exportar PDF
                </button>
            </div>
            ${this.renderHealthAnalysis(healthAnalysis)}
            ${this.renderTimeEstimates(timeEstimate)}
            ${this.renderPerformanceComparison(performanceComparison)}
            ${this.renderSegmentStrategy(segmentStrategy)}
            ${this.renderHydrationPlan(hydrationPlan)}
            ${this.renderEquipmentRecommendations(equipmentRecommendations)}
        </div>`;
    }

    renderHealthAnalysis(health) {
        if (!health) return '';
        const riskClass = health.riskLevel === 'Alto' ? 'risk-high' : health.riskLevel === 'Médio' ? 'risk-medium' : 'risk-low';
        return `<div class="${riskClass} p-6 rounded-lg border-2">
            <h4 class="text-lg font-bold mb-4">🏥 Análise de Saúde e Segurança</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-3">
                    <div class="flex justify-between"><span>IMC:</span> <span class="font-semibold">${health.bmi || 'N/A'} (${health.bmiCategory || 'N/A'})</span></div>
                    <div class="flex justify-between"><span>Nível de Risco:</span> <span class="font-semibold">${health.riskLevel}</span></div>
                    <div class="flex justify-between"><span>FC Máxima Estimada:</span> <span class="font-semibold">${health.maxHeartRate || 'N/A'} bpm</span></div>
                </div>
                <div class="space-y-3">
                    <div>
                        <h5 class="font-semibold mb-1 text-yellow-800">⚠️ Avisos</h5>
                        <ul class="list-disc list-inside text-sm">${health.warnings.map(w => `<li>${w}</li>`).join('') || '<li>Nenhum aviso específico.</li>'}</ul>
                    </div>
                    <div>
                        <h5 class="font-semibold mb-1 text-blue-800">💡 Recomendações</h5>
                        <ul class="list-disc list-inside text-sm">${health.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
                    </div>
                </div>
            </div>
        </div>`;
    }

    renderTimeEstimates(estimate) {
        if (!estimate) return '';
        return `<div class="analysis-card p-6">
            <h4 class="text-lg font-bold text-gray-900 mb-4">⏱️ Estimativa de Tempo</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div><p class="text-2xl font-bold text-green-600">${estimate.optimistic}</p><p class="text-sm text-gray-500">Otimista</p></div>
                <div><p class="text-2xl font-bold text-blue-600">${estimate.realistic}</p><p class="text-sm text-gray-500">Realista</p></div>
                <div><p class="text-2xl font-bold text-orange-600">${estimate.conservative}</p><p class="text-sm text-gray-500">Conservador</p></div>
                <div><p class="text-2xl font-bold text-red-600">${estimate.safePace}</p><p class="text-sm text-gray-500">Ritmo Seguro</p></div>
            </div>
        </div>`;
    }
    
    renderPerformanceComparison(comp) {
        if (!comp || !comp.hasData) return '';
        return `<div class="analysis-card p-6">
            <h4 class="text-lg font-bold text-gray-900 mb-4">📊 Análise de Performance</h4>
            <p class="mb-4"><strong>Tempo de Referência Usado:</strong> ${comp.baseRecord.name} - ${comp.baseRecord.value}</p>
            <h5 class="font-semibold mb-2">Projeções de Tempo (Fórmula de Riegel)</h5>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${comp.projections.map(p => `
                    <div class="bg-gray-50 p-3 rounded-lg text-center">
                        <p class="font-bold">${p.name}</p>
                        <p class="text-lg text-purple-600 font-semibold">${p.projectedTime}</p>
                        <p class="text-xs text-gray-500">Confiança: ${p.confidence}</p>
                    </div>`).join('')}
            </div>
        </div>`;
    }

    renderSegmentStrategy(strategy) {
        if (!strategy || strategy.length === 0) return '';
        return `<div class="analysis-card p-6">
            <h4 class="text-lg font-bold text-gray-900 mb-4">🏃‍♂️ Estratégia de Ritmo</h4>
            <div class="table-responsive">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-2">Segmento</th>
                            <th class="p-2">Pace Alvo</th>
                            <th class="p-2">Esforço</th>
                            <th class="p-2">Notas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${strategy.map(s => `<tr class="border-b"><td class="p-2 font-medium">${s.segment}</td><td class="p-2 font-mono">${s.pace}/km</td><td class="p-2">${s.effort}</td><td class="p-2">${s.notes}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    renderHydrationPlan(plan) {
        if (!plan || plan.length === 0) return '';
        return `<div class="analysis-card p-6">
            <h4 class="text-lg font-bold text-gray-900 mb-4">💧 Plano de Hidratação</h4>
            <div class="table-responsive">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-2">Km (Aprox.)</th>
                            <th class="p-2">Tempo Est.</th>
                            <th class="p-2">Ação</th>
                            <th class="p-2">Nutrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${plan.map(p => `<tr class="border-b"><td class="p-2 font-medium">${p.km}km</td><td class="p-2 font-mono">${p.time}</td><td class="p-2">${p.fluid}</td><td class="p-2">${p.nutrition}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    renderEquipmentRecommendations(rec) {
        if (!rec) return '';
        return `<div class="analysis-card p-6">
            <h4 class="text-lg font-bold text-gray-900 mb-4">🛍️ Recomendações de Equipamentos</h4>
            <div class="space-y-3">
                <p><strong>👟 Calçado:</strong> ${rec.shoes}</p>
                <p><strong>👕 Vestuário:</strong> ${rec.clothing}</p>
                <p><strong>🎒 Acessórios:</strong> ${rec.accessories.join(', ')}</p>
            </div>
        </div>`;
    }

    loadPosProvaTab() {
        const preAnalysis = appData.get('analysis');
        if (!preAnalysis) {
            this.tabContent.innerHTML = `<div class="text-center py-16"><div class="text-6xl mb-4">🏁</div><h3 class="text-2xl font-bold text-gray-800">Primeiro, gere uma análise</h3><p class="text-gray-500 mt-2">A análise pós-prova compara seu resultado com a estimativa gerada na aba 'Análise e Estratégia'.</p></div>`;
            return;
        }

        const postAnalysis = appData.get('postRaceAnalysis');
        // Valida se a análise pós-prova corresponde à análise pré-prova atual (baseado na distância)
        const distanceMatch = postAnalysis ? preAnalysis.metadata.distance === parseFloat(appData.get('raceDistance')) : false;

    }
}
