/**
 * Sistema de Storage - Gerencia dados no localStorage
 */

class StorageManager {
    constructor() {
        this.prefix = 'runner_analysis_';
    }

    set(key, value) {
        try {
            const fullKey = this.prefix + key;
            localStorage.setItem(fullKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const fullKey = this.prefix + key;
            const item = localStorage.getItem(fullKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erro ao recuperar do localStorage:', error);
            return defaultValue;
        }
    }

    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }
}

const storage = new StorageManager();

class AppData {
    constructor() {
        this.data = this.loadData();
        this.observers = [];
    }

    loadData() {
        return {
            activeTab: storage.get('activeTab', 'entrada'),
            sidebarCollapsed: storage.get('sidebarCollapsed', false),
            raceName: storage.get('raceName', ''),
            raceDate: storage.get('raceDate', ''),
            raceDistance: storage.get('raceDistance', ''),
            raceType: storage.get('raceType', 'Rua'),
            tempMin: storage.get('tempMin', ''),
            tempMax: storage.get('tempMax', ''),
            humidity: storage.get('humidity', ''),
            rainChance: storage.get('rainChance', ''),
            runnerAge: storage.get('runnerAge', ''),
            runnerGender: storage.get('runnerGender', ''),
            runnerExperience: storage.get('runnerExperience', 'Intermediário'),
            runnerWeight: storage.get('runnerWeight', ''),
            runnerHeight: storage.get('runnerHeight', ''),
            pb5k: storage.get('pb5k', ''),
            pb10k: storage.get('pb10k', ''),
            pb21k: storage.get('pb21k', ''),
            pb42k: storage.get('pb42k', ''),
            objective: storage.get('objective', 'Tempo Alvo'),
            targetTime: storage.get('targetTime', ''),
            analysis: storage.get('analysis', null)
        };
    }

    set(key, value) {
        this.data[key] = value;
        storage.set(key, value);
    }

    get(key) {
        return this.data[key];
    }
    
    validateRequiredData() {
        const errors = [];
        if (!this.data.raceDistance) {
            errors.push('Distância da prova é obrigatória');
        }
        const distance = parseFloat(this.data.raceDistance);
        if (isNaN(distance) || distance <= 0 || distance > 200) {
            errors.push('Distância deve ser um número válido entre 1 e 200 km');
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    getDataSummary() {
        const filled = [];
        const empty = [];
        const fields = {
            raceName: 'Nome da Corrida', raceDate: 'Data da Prova', raceDistance: 'Distância',
            runnerAge: 'Idade', runnerWeight: 'Peso', runnerHeight: 'Altura'
        };
        Object.keys(fields).forEach(key => {
            if (this.data[key] && this.data[key].toString().trim() !== '') {
                filled.push(fields[key]);
            } else {
                empty.push(fields[key]);
            }
        });
        return {
            filled: filled,
            empty: empty,
            completeness: Math.round((filled.length / Object.keys(fields).length) * 100)
        };
    }
}

const appData = new AppData();
