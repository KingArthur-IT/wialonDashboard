const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/;

const nameGroup = document.querySelector('#nameGroup')
const emailGroup = document.querySelector('#emailGroup')
const passwordGroup = document.querySelector('#passwordGroup')
const repeatPasswordGroup = document.querySelector('#repeatPasswordGroup')
const confirmGroup = document.querySelector('#confirmGroup')

const nameInput = nameGroup.querySelector('input')
const emailInput = emailGroup.querySelector('input')
const passwordInput = passwordGroup.querySelector('input')
const repeatPasswordInput = repeatPasswordGroup.querySelector('input')
const confirmInput = confirmGroup.querySelector('input')

const rigisterBtn = document.querySelector('#register_submit')

rigisterBtn.addEventListener('click', (e) => {
    e.preventDefault()

    let hasErrors = false
    document.querySelector('#regError').classList.remove('d-block')

    //name
    if (nameInput.value.length < 5) {
        nameGroup.querySelector('.invalid-feedback').classList.add('d-block')
        nameInput.classList.add('is-invalid')
        hasErrors = true
    } else {
        nameGroup.querySelector('.invalid-feedback').classList.remove('d-block')
        nameInput.classList.remove('is-invalid')
    }

    //email
    if (!emailValidator.test(emailInput.value)) {
        emailGroup.querySelector('.invalid-feedback').classList.add('d-block')
        emailInput.classList.add('is-invalid')
        hasErrors = true
    } else {
        emailGroup.querySelector('.invalid-feedback').classList.remove('d-block')
        emailInput.classList.remove('is-invalid')
    }

    //password
    if (!passwordRegex.test(passwordInput.value)) {
        passwordGroup.querySelector('.invalid-feedback').classList.add('d-block')
        passwordInput.classList.add('is-invalid')
        hasErrors = true
    } else {
        passwordGroup.querySelector('.invalid-feedback').classList.remove('d-block')
        passwordInput.classList.remove('is-invalid')
    }

    //repeat password
    if (repeatPasswordInput.value !== passwordInput.value) {
        repeatPasswordGroup.querySelector('.invalid-feedback').classList.add('d-block')
        repeatPasswordInput.classList.add('is-invalid')
        hasErrors = true
    } else {
        repeatPasswordGroup.querySelector('.invalid-feedback').classList.remove('d-block')
        repeatPasswordInput.classList.remove('is-invalid')
    }

    //confirm
    if (!confirmInput.checked) {
        confirmGroup.querySelector('.invalid-feedback').classList.add('d-block')
        confirmInput.classList.add('is-invalid')
        hasErrors = true
    } else {
        confirmGroup.querySelector('.invalid-feedback').classList.remove('d-block')
        confirmInput.classList.remove('is-invalid')
    }

    if (hasErrors) return

    rigisterBtn.querySelector('.indicator-label').classList.add('d-none')
    rigisterBtn.querySelector('.indicator-progress').classList.add('d-block')

    //отправка данных на сервер
    const sendData = {
        name: nameInput.value,
        username: emailInput.value,
        password: passwordInput.value
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://fines.naveoapps.ru/do_register.php");

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        rigisterBtn.querySelector('.indicator-label').classList.remove('d-none')
        rigisterBtn.querySelector('.indicator-progress').classList.remove('d-block')

        if (xhr.status === 200) {
            console.log('res = ', xhr.responseText);
            if (xhr.responseText.includes('Ошибка')) {
                document.querySelector('#regError').classList.add('d-block')
                document.querySelector('#regError').innerHTML = xhr.responseText
            } else {
                const res = JSON.parse(xhr.responseText)
                console.log(xhr.responseText, res);
            }
        }
    }};

    xhr.send(JSON.stringify(sendData));
})