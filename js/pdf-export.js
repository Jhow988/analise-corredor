/**
 * Gerador de PDF para relatórios de análise
 */

class PDFExporter {
    constructor() {
        this.jsPDF = window.jspdf.jsPDF;
    }

    exportAnalysisReport(analysisData, userData) {
        if (!analysisData) {
            alert('Nenhuma análise encontrada para exportar.');
            return;
        }

        try {
            const doc = new this.jsPDF();
            let yPosition = 20;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 20;
            const lineHeight = 6;

            doc.setFont('helvetica');

            const checkPageBreak = (neededSpace = 20) => {
                if (yPosition + neededSpace > pageHeight - margin) {
                    doc.addPage();
                    yPosition = margin;
                }
            };

            const removeAccents = (str) => {
                if (!str) return '';
                return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[çÇ]/g, 'c');
            };

            const addText = (text, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
                doc.setFontSize(fontSize);
                doc.setTextColor(...color);
                doc.setFont('helvetica', isBold ? 'bold' : 'normal');
                const cleanText = removeAccents(text);
                const splitText = doc.splitTextToSize(cleanText, doc.internal.pageSize.width - 2 * margin);
                splitText.forEach(line => {
                    checkPageBreak();
                    doc.text(line, margin, yPosition);
                    yPosition += lineHeight;
                });
            };

            const addSection = (title, color = [0, 100, 200]) => {
                checkPageBreak(30);
                yPosition += 5;
                addText(title, 14, true, color);
                yPosition += 3;
            };

            // Cabeçalho
            doc.setFontSize(18);
            doc.setTextColor(0, 100, 200);
            doc.setFont('helvetica', 'bold');
            doc.text('RELATORIO DE ANALISE DE CORRIDA', margin, yPosition);
            yPosition += 15;
            const currentDate = new Date().toLocaleDateString('pt-BR');
            addText(`Relatorio gerado em: ${currentDate}`, 10, false, [100, 100, 100]);
            yPosition += 10;

            // Dados
            addSection('INFORMACOES DA PROVA', [200, 0, 0]);
            addText(`Nome da Corrida: ${userData.raceName || 'Nao informado'}`);
            addText(`Distancia: ${userData.raceDistance || 'N/A'}km`);
            addText(`Tipo de Percurso: ${userData.raceType || 'N/A'}`);

            addSection('DADOS DO CORREDOR');
            addText(`Idade: ${userData.runnerAge || 'N/A'} anos`);
            addText(`Peso: ${userData.runnerWeight || 'N/A'}kg`);
            addText(`Altura: ${userData.runnerHeight || 'N/A'}m`);

            // Análise de Saúde
            if (analysisData.healthAnalysis) {
                const health = analysisData.healthAnalysis;
                addSection('ANALISE DE SAUDE E SEGURANCA', [200, 0, 0]);
                if (health.bmi) addText(`IMC: ${health.bmi} (${health.bmiCategory})`, 11, true);
                addText(`Nivel de Risco: ${health.riskLevel}`, 11, true, health.riskLevel === 'Alto' ? [200, 0, 0] : health.riskLevel === 'Médio' ? [200, 150, 0] : [0, 150, 0]);
                if (health.maxHeartRate) addText(`Frequencia Cardiaca Maxima Estimada: ${health.maxHeartRate} bpm`);
                if (health.warnings.length > 0) {
                    yPosition += 3;
                    addText('AVISOS IMPORTANTES:', 12, true, [200, 0, 0]);
                    health.warnings.forEach(warning => addText(`- ${warning}`, 10, false, [200, 0, 0]));
                }
                if (health.recommendations.length > 0) {
                    yPosition += 3;
                    addText('RECOMENDACOES DE SEGURANCA:', 12, true);
                    health.recommendations.forEach(rec => addText(`- ${rec}`));
                }
            }

            // Estimativas de Tempo
            if (analysisData.timeEstimate) {
                addSection('ESTIMATIVAS DE TEMPO');
                addText(`Cenario Otimista: ${analysisData.timeEstimate.optimistic}`);
                addText(`Cenario Realista: ${analysisData.timeEstimate.realistic}`);
                addText(`Cenario Conservador: ${analysisData.timeEstimate.conservative}`);
                addText(`Ritmo Seguro (Baseado na Saude): ${analysisData.timeEstimate.safePace}`);
            }

            // Estratégia de Ritmo
            if (analysisData.segmentStrategy && analysisData.segmentStrategy.length > 0) {
                addSection('ESTRATEGIA DE RITMO POR SEGMENTO');
                analysisData.segmentStrategy.forEach(segment => {
                    addText(`${segment.segment}: ${segment.pace}/km (${segment.effort})`, 10);
                });
            }

            // Plano de Hidratação
            if (analysisData.hydrationPlan && analysisData.hydrationPlan.length > 0) {
                addSection('PLANO DE HIDRATACAO E NUTRICAO');
                analysisData.hydrationPlan.forEach(point => {
                    addText(`${point.km}km (${point.time}): ${point.fluid}${point.nutrition !== '-' ? ` + ${point.nutrition}` : ''}`, 10);
                });
            }

            // Rodapé
            yPosition += 10;
            addText('Este relatorio foi gerado pelo Sistema de Analise para Corredores.', 8, false, [100, 100, 100]);
            addText('As recomendacoes nao substituem a orientacao de um profissional de saude ou educacao fisica.', 8, false, [100, 100, 100]);

            doc.save(`analise-corrida-${currentDate.replace(/\//g, '-')}.pdf`);
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        }
    }
}

const pdfExporter = new PDFExporter();
