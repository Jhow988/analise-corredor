/**
 * Engine de Análise de Corrida
 * Implementa as diretrizes da OMS e algoritmos científicos
 * VERSÃO REVISADA E CORRIGIDA
 */

class RunningAnalysisEngine {
    constructor() {
        this.WHO_GUIDELINES = {
            WEEKLY_MODERATE: 150, // minutos por semana
            WEEKLY_VIGOROUS: 75,  // minutos por semana
            STRENGTH_DAYS: 2      // dias por semana
        };
        this.ACSM_HYDRATION_RATE = 150; // ml a cada 15-20 minutos (referência ACSM)
    }

    generateCompleteAnalysis(data) {
        const distance = parseFloat(data.raceDistance);
        if (!distance || distance <= 0) {
            throw new Error('Distância da prova é obrigatória e deve ser maior que zero.');
        }

        try {
            const performanceComparison = this.generatePerformanceComparison(data, distance);
            const basePace = this.calculateBasePace(data, performanceComparison);
            const healthAnalysis = this.generateHealthAnalysis(data, distance);
            const timeEstimate = this.generateTimeEstimate(data, distance, basePace, healthAnalysis);
            const segmentStrategy = this.generateSegmentStrategy(distance, basePace);
            const hydrationPlan = this.generateHydrationPlan(distance, basePace, data);
            const equipmentRecommendations = this.generateEquipmentRecommendations(data);

            return {
                healthAnalysis,
                timeEstimate,
                segmentStrategy,
                hydrationPlan,
                equipmentRecommendations,
                performanceComparison,
                metadata: {
                    generatedAt: new Date().toISOString(),
                    distance: distance,
                    basePace: basePace
                }
            };
        } catch (error) {
            console.error('Erro ao gerar análise:', error);
            throw error;
        }
    }

    calculateBasePace(data, performanceComparison) {
        const projectedTimeForTarget = performanceComparison.projections.find(p => p.distance === parseFloat(data.raceDistance));
        if (projectedTimeForTarget) {
            const totalSeconds = this.parseTimeToSeconds(projectedTimeForTarget.projectedTime);
            const paceInSeconds = totalSeconds / parseFloat(data.raceDistance);
            return this.formatSecondsToTime(paceInSeconds, 'pace');
        }
        if (performanceComparison.baseRecord) {
            const baseTimeSeconds = this.parseTimeToSeconds(performanceComparison.baseRecord.value);
            const basePaceSeconds = baseTimeSeconds / performanceComparison.baseRecord.distance;
            return this.formatSecondsToTime(basePaceSeconds, 'pace');
        }
        return '6:00';
    }

    generateHealthAnalysis(data, distance) {
        const weight = parseFloat(data.runnerWeight);
        const height = parseFloat(data.runnerHeight);
        const age = parseInt(data.runnerAge);
        const temp = parseFloat(data.tempMax) || 20;
        const humidity = parseFloat(data.humidity) || 50;
        const analysis = {
            bmi: null, bmiCategory: '', riskLevel: 'Baixo', recommendations: [], warnings: [],
            safetyAdjustments: {}, maxHeartRate: age ? Math.round(208 - (0.7 * age)) : null,
            targetHeartRateZones: null, whoGuidelines: []
        };
        if (analysis.maxHeartRate) {
            analysis.targetHeartRateZones = this.calculateHeartRateZones(analysis.maxHeartRate);
        }
        if (weight && height > 0) {
            const bmi = weight / (height * height);
            analysis.bmi = bmi.toFixed(1);
            this.analyzeBMI(bmi, analysis);
        }
        if (age) this.analyzeAgeGroup(age, analysis);
        this.analyzeClimateConditions(temp, humidity, analysis);
        this.analyzeExperienceAndProgression(data, distance, analysis);
        analysis.safetyAdjustments = this.calculateSafetyAdjustments(analysis, temp);
        this.addGeneralSafetyRecommendations(analysis);
        return analysis;
    }

    analyzeBMI(bmi, analysis) {
        if (bmi < 18.5) {
            analysis.bmiCategory = 'Baixo peso (OMS)';
            analysis.riskLevel = 'Médio';
            analysis.warnings.push('IMC abaixo do normal pode indicar deficiência nutricional. Risco de fratura por estresse aumentado.');
            analysis.recommendations.push('OMS: Consulte profissional de saúde para avaliação nutricional.');
        } else if (bmi < 25) {
            analysis.bmiCategory = 'Peso normal (OMS)';
        } else if (bmi < 30) {
            analysis.bmiCategory = 'Sobrepeso (OMS)';
            analysis.riskLevel = 'Médio';
            analysis.warnings.push('IMC indica sobrepeso, aumentando o estresse sobre as articulações (joelhos, tornozelos).');
            analysis.recommendations.push('OMS: Foco em fortalecimento muscular para proteger articulações.');
        } else {
            analysis.bmiCategory = 'Obesidade (OMS)';
            analysis.riskLevel = 'Alto';
            analysis.warnings.push('Obesidade aumenta significativamente o risco de eventos cardiovasculares e lesões ortopédicas durante a corrida.');
            analysis.recommendations.push('CRÍTICO: Consulta e liberação médica são essenciais antes de provas longas.');
        }
    }

    calculateHeartRateZones(maxHR) {
        return {
            zone1: `${Math.round(maxHR * 0.5)} - ${Math.round(maxHR * 0.6)} bpm (50-60%)`,
            zone2: `${Math.round(maxHR * 0.6)} - ${Math.round(maxHR * 0.7)} bpm (60-70%)`,
            zone3: `${Math.round(maxHR * 0.7)} - ${Math.round(maxHR * 0.8)} bpm (70-80%)`,
            zone4: `${Math.round(maxHR * 0.8)} - ${Math.round(maxHR * 0.9)} bpm (80-90%)`,
            zone5: `${Math.round(maxHR * 0.9)} - ${Math.round(maxHR * 1.0)} bpm (90-100%)`,
        };
    }
    
    analyzeAgeGroup(age, analysis) {
        if (age >= 40) {
            analysis.riskLevel = analysis.riskLevel === 'Alto' ? 'Alto' : 'Médio';
            analysis.recommendations.push('Idade acima de 40 anos: OMS sugere avaliação médica regular para praticantes de atividades intensas.');
        }
    }

    analyzeClimateConditions(temp, humidity, analysis) {
        const heatIndex = -8.78469475556 + 1.61139411 * temp + 2.33854883889 * humidity - 0.14611605 * temp * humidity;
        if (heatIndex > 27) {
            analysis.warnings.push(`Condições de calor (sensação térmica ~${Math.round(heatIndex)}°C). Risco de estresse térmico aumentado.`);
            analysis.recommendations.push('Aumente a hidratação e considere reduzir a intensidade.');
        }
        if (heatIndex > 32) {
            analysis.riskLevel = analysis.riskLevel === 'Alto' ? 'Alto' : 'Médio';
            analysis.warnings.push(`PERIGO: Condições de calor elevado (sensação térmica ~${Math.round(heatIndex)}°C). Alto risco de hipertermia.`);
            analysis.recommendations.push('OMS: Reduza a intensidade em 15-30%. Evite competir se não estiver aclimatado.');
        }
    }

    analyzeExperienceAndProgression(data, distance, analysis) {
        if (distance > 10 && data.runnerExperience === 'Iniciante') {
            analysis.riskLevel = 'Alto';
            analysis.warnings.push('Distância longa para um iniciante. Risco elevado de lesão por sobrecarga (overuse).');
            analysis.recommendations.push('Princípio da progressão: Aumente a distância semanal em no máximo 10-15%.');
        }
    }

    calculateSafetyAdjustments(analysis, temp) {
        let paceAdjustmentFactor = 1.0;
        if (analysis.riskLevel === 'Médio') paceAdjustmentFactor *= 1.05;
        if (analysis.riskLevel === 'Alto') paceAdjustmentFactor *= 1.12;
        if (temp > 28) paceAdjustmentFactor *= 1.05;
        return {
            paceAdjustment: paceAdjustmentFactor,
            recommendedPaceIncrease: Math.round((paceAdjustmentFactor - 1) * 100)
        };
    }

    addGeneralSafetyRecommendations(analysis) {
        analysis.recommendations.push('Sempre realize um aquecimento adequado antes da corrida e um desaquecimento após.');
        analysis.recommendations.push('Ouça seu corpo. Pare imediatamente se sentir dor aguda, tontura ou dor no peito.');
    }

    generateTimeEstimate(data, distance, basePace, healthAnalysis) {
        if (!basePace || !basePace.includes(':')) return {};
        const paceInSeconds = this.parseTimeToSeconds(basePace);
        const totalSeconds = distance * paceInSeconds;
        const optimistic = totalSeconds * 0.97;
        const realistic = totalSeconds;
        const conservative = totalSeconds * 1.05;
        const safePaceTotal = totalSeconds * (healthAnalysis.safetyAdjustments.paceAdjustment || 1.0);
        return {
            optimistic: this.formatSecondsToTime(optimistic),
            realistic: this.formatSecondsToTime(realistic),
            conservative: this.formatSecondsToTime(conservative),
            safePace: this.formatSecondsToTime(safePaceTotal)
        };
    }

    generateSegmentStrategy(distance, basePace) {
        const segments = [];
        const segmentDistance = distance <= 10 ? 1 : distance <= 21.1 ? 2 : 5;
        const numSegments = Math.ceil(distance / segmentDistance);
        for (let i = 0; i < numSegments; i++) {
            const startKm = i * segmentDistance;
            const endKm = Math.min((i + 1) * segmentDistance, distance);
            let paceAdjustment = 1.0;
            const progressRatio = i / (numSegments - 1);
            if (i === 0) paceAdjustment = 1.05;
            else if (progressRatio <= 0.5) paceAdjustment = 1.02;
            else if (progressRatio <= 0.8) paceAdjustment = 0.98;
            else paceAdjustment = 0.96;
            segments.push({
                segment: `${startKm.toFixed(1)}-${endKm.toFixed(1)}km`,
                pace: this.adjustPace(basePace, paceAdjustment),
                effort: i === 0 ? 'Aquecimento' : progressRatio <= 0.5 ? 'Controlado' : 'Intenso',
                notes: i === 0 ? 'Foque na técnica, não na velocidade.' : progressRatio <= 0.5 ? 'Mantenha o ritmo, guarde energia.' : 'Aumente o esforço progressivamente.'
            });
        }
        return segments;
    }

    generateHydrationPlan(distance, basePace, data) {
        const plan = [];
        const paceSecondsPerKm = this.parseTimeToSeconds(basePace);
        const temp = parseFloat(data.tempMax) || 20;
        const hydrationIntervalMinutes = temp > 25 ? 15 : 20;
        const hydrationIntervalSeconds = hydrationIntervalMinutes * 60;
        let nextHydrationTime = hydrationIntervalSeconds;
        for (let km = 1; km <= distance; km++) {
            const currentTime = km * paceSecondsPerKm;
            if (currentTime >= nextHydrationTime) {
                plan.push({
                    km: km.toFixed(1),
                    time: this.formatSecondsToTime(currentTime),
                    fluid: `Beba ${this.ACSM_HYDRATION_RATE}ml de água ou isotônico`,
                    nutrition: (distance > 15 && currentTime > 3600) ? 'Considere 1 gel de carboidrato' : '-'
                });
                nextHydrationTime += hydrationIntervalSeconds;
            }
        }
        return plan;
    }

    generateEquipmentRecommendations(data) {
        const temp = parseFloat(data.tempMax) || 20;
        const distance = parseFloat(data.raceDistance) || 10;
        return {
            shoes: data.raceType === 'Trilha' ? 'Tênis de trail com boa tração e proteção.' : 
                   distance > 21 ? 'Tênis com máximo amortecimento para longas distâncias.' :
                   'Tênis versátil com bom equilíbrio entre amortecimento e resposta.',
            clothing: temp > 25 ? 'Roupas leves, de cor clara e alta respirabilidade.' :
                      temp > 15 ? 'Camiseta técnica e shorts/bermuda.' :
                      'Considere manguitos ou camiseta de manga longa leve.',
            accessories: [
                'Boné ou viseira e óculos de sol para proteção UV.',
                distance > 10 ? 'Cinto de hidratação ou mochila, se não houver postos suficientes.' : null,
                'Use protetor solar (recomendação OMS).'
            ].filter(Boolean)
        };
    }

    generatePerformanceComparison(data, targetDistance) {
        const distances = [
            { key: 'pb5k', value: data.pb5k, distance: 5, name: '5K' },
            { key: 'pb10k', value: data.pb10k, distance: 10, name: '10K' },
            { key: 'pb21k', value: data.pb21k, distance: 21.0975, name: '21K' },
            { key: 'pb42k', value: data.pb42k, distance: 42.195, name: '42K' }
        ];
        const filledRecords = distances.filter(d => d.value && d.value.includes(':'));
        const comparison = { hasData: filledRecords.length > 0, baseRecord: null, projections: [], recommendations: [] };
        if (!comparison.hasData) {
            comparison.recommendations.push('Preencha pelo menos um recorde pessoal para uma análise de performance mais precisa.');
            return comparison;
        }
        comparison.baseRecord = filledRecords.reduce((prev, curr) => 
            Math.abs(curr.distance - targetDistance) < Math.abs(prev.distance - targetDistance) ? curr : prev
        );
        const allDistancesToProject = [
            { distance: 5, name: '5K' }, { distance: 10, name: '10K' },
            { distance: 21.0975, name: '21K' }, { distance: 42.195, name: '42K' }
        ];
        if (!allDistancesToProject.some(d => d.distance === targetDistance)) {
            allDistancesToProject.push({ distance: targetDistance, name: `${targetDistance}K` });
        }
        allDistancesToProject.forEach(record => {
            const projectedTime = this.projectTimeRiegel(comparison.baseRecord, record.distance);
            comparison.projections.push({
                distance: record.distance, name: record.name,
                projectedTime: projectedTime,
                confidence: this.getConfidenceLevel(comparison.baseRecord.distance, record.distance)
            });
        });
        return comparison;
    }

    parseTimeToSeconds(timeString) {
        if (!timeString || !timeString.includes(':')) return 0;
        const parts = timeString.split(':').map(Number);
        if (parts.some(isNaN)) return 0;
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return 0;
    }

    formatSecondsToTime(seconds, format = 'time') {
        if (isNaN(seconds) || seconds <= 0) return '0:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.round(seconds % 60);
        if (format === 'pace' || h === 0) {
            return `${m}:${s.toString().padStart(2, '0')}`;
        } else {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
    }

    adjustPace(basePace, factor) {
        const seconds = this.parseTimeToSeconds(basePace);
        return this.formatSecondsToTime(seconds * factor, 'pace');
    }

    projectTimeRiegel(baseRecord, targetDistance) {
        const t1 = this.parseTimeToSeconds(baseRecord.value);
        const d1 = baseRecord.distance;
        const d2 = targetDistance;
        const exponent = 1.06;
        const t2 = t1 * Math.pow(d2 / d1, exponent);
        return this.formatSecondsToTime(t2);
    }

    getConfidenceLevel(baseDistance, targetDistance) {
        const ratio = Math.max(baseDistance, targetDistance) / Math.min(baseDistance, targetDistance);
        if (ratio <= 2) return 'Alta';
        if (ratio <= 4) return 'Média';
        return 'Baixa';
    }

    generatePostRaceAnalysis(preRaceAnalysis, actualTime) {
        if (!preRaceAnalysis || !preRaceAnalysis.timeEstimate || !preRaceAnalysis.timeEstimate.realistic) {
            throw new Error("Análise pré-prova não encontrada ou incompleta.");
        }
        if (!actualTime || !actualTime.includes(':')) {
            throw new Error("Tempo real da prova é inválido. Use o formato h:mm:ss ou mm:ss.");
        }

        const estimatedSeconds = this.parseTimeToSeconds(preRaceAnalysis.timeEstimate.realistic);
        const actualSeconds = this.parseTimeToSeconds(actualTime);
        const distance = preRaceAnalysis.metadata.distance;

        if (actualSeconds <= 0) {
            throw new Error("Tempo real da prova deve ser maior que zero.");
        }

        const differenceSeconds = actualSeconds - estimatedSeconds;
        const differencePercentage = (differenceSeconds / estimatedSeconds) * 100;

        const estimatedPaceSeconds = estimatedSeconds / distance;
        const actualPaceSeconds = actualSeconds / distance;

        let feedback = '';
        if (differencePercentage < -2) {
            feedback = 'Performance excepcional! Você superou a estimativa de forma significativa.';
        } else if (differencePercentage <= 0) {
            feedback = 'Parabéns! Você atingiu ou superou a sua meta de tempo realista.';
        } else if (differencePercentage <= 5) {
            feedback = 'Ótimo resultado! Você chegou muito perto da estimativa. Excelente esforço.';
        } else {
            feedback = 'Prova concluída! Cada corrida é um aprendizado. Use os dados para ajustar o treino para a próxima.';
        }

        return {
            estimatedTime: preRaceAnalysis.timeEstimate.realistic, actualTime: actualTime,
            difference: this.formatSecondsToTime(Math.abs(differenceSeconds)),
            wasFaster: differenceSeconds < 0, differencePercentage: differencePercentage.toFixed(2),
            estimatedPace: this.formatSecondsToTime(estimatedPaceSeconds, 'pace'), actualPace: this.formatSecondsToTime(actualPaceSeconds, 'pace'),
            feedback: feedback, generatedAt: new Date().toISOString()
        };
    }
}

const analysisEngine = new RunningAnalysisEngine();
