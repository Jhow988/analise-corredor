/**
 * Máscaras para campos de entrada de dados
 */

class InputMasks {
    static maskTime(value) {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        return numbers.slice(0, 2) + ':' + numbers.slice(2, 4);
    }

    static maskLongTime(value) {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 1) return numbers;
        if (numbers.length <= 3) return numbers.slice(0, 1) + ':' + numbers.slice(1, 3);
        return numbers.slice(0, 1) + ':' + numbers.slice(1, 3) + ':' + numbers.slice(3, 5);
    }

    static applyMask(input, maskType) {
        const value = input.value;
        let maskedValue = value;
        switch (maskType) {
            case 'time': maskedValue = this.maskTime(value); break;
            case 'longTime': maskedValue = this.maskLongTime(value); break;
            case 'percentage': maskedValue = value.replace(/\D/g, '').slice(0, 3); break;
            case 'temperature': maskedValue = value.replace(/\D/g, '').slice(0, 2); break;
            case 'distance': maskedValue = value.replace(/\D/g, '').slice(0, 3); break;
            case 'age': maskedValue = value.replace(/\D/g, '').slice(0, 2); break;
            case 'raceName': maskedValue = value.slice(0, 50); break;
            case 'weight': maskedValue = value.replace(/\D/g, '').slice(0, 3); break;
            case 'height':
                const numbers = value.replace(/\D/g, '');
                if (numbers.length <= 1) maskedValue = numbers;
                else maskedValue = numbers.slice(0, 1) + '.' + numbers.slice(1, 3);
                break;
        }
        if (maskedValue !== value) {
            input.value = maskedValue;
        }
    }
}

function setupInputMasksAndValidation() {
    const maskFields = {
        '[data-mask="time"]': 'time', '[data-mask="longTime"]': 'longTime',
        '[data-mask="percentage"]': 'percentage', '[data-mask="temperature"]': 'temperature',
        '[data-mask="distance"]': 'distance', '[data-mask="age"]': 'age',
        '[data-mask="raceName"]': 'raceName', '[data-mask="weight"]': 'weight',
        '[data-mask="height"]': 'height'
    };
    Object.keys(maskFields).forEach(selector => {
        const inputs = document.querySelectorAll(selector);
        inputs.forEach(input => {
            input.addEventListener('input', (e) => InputMasks.applyMask(e.target, maskFields[selector]));
        });
    });
}
