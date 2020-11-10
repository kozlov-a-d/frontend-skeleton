/**
 * TODO: допилить нормально, должно быть что-то вроде
 * validate = (value, rule/type): boolean
 * внутри switch case и отдельная функция на каждое правило или тип данных
 */

export function validatePhone(value) {
    let isValid = false;
    let error = ``;

    if (value === '') {
        isValid = false;
        error = `Значение не должно быть пустым.`;
    } else {
        const reg = /^[+0-9]{1}[0-9]{1}([(-0-9]{0,1})?([(0-9]{0,1})?([0-9]{0,2})?([)0-9]{0,2})?([-0-9]{0,1})?([0-9]{0,3})?([-0-9]{0,1})?([0-9]{0,2})?([-]{0,1})?([0-9]{0,2})?( [(0-9]{1})?([0-9]{0,3})?([)]{0,1})?([-]{0,1})?([0-9]{0,3})?([-]{0,1})?([0-9]{0,2})?([-]{0,1})?([0-9]{0,2})?( [0-9]{3})?( [0-9]{2,4})?( [0-9]{2})?$/;
        isValid = reg.test(value);
        !isValid ? (error = `Некорректный формат телефона`) : '';
    }

    return {
        isValid,
        error,
    };
}

export function validateEmail(value) {
    let isValid = false;
    let error = ``;

    if (value === '') {
        isValid = true;
    } else {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        isValid = reg.test(value);
        !isValid ? (error = `Некорректный формат электронной почты`) : '';
    }

    return {
        isValid,
        error,
    };
}
