const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/;

const emailGroup = document.querySelector('#emailGroup')
const passwordGroup = document.querySelector('#passwordGroup')

const signInBtn = document.querySelector('#sign_in_submit')
const emailInput = emailGroup.querySelector('input')
const passwordInput = passwordGroup.querySelector('input')

signInBtn.addEventListener('click', (e) => {
    e.preventDefault()

    let hasErrors = false
    document.querySelector('#loginError').classList.remove('d-block')

    if (!emailValidator.test(emailInput.value)) {
        emailGroup.querySelector('.invalid-feedback').classList.add('d-block')
        emailInput.classList.add('is-invalid')
        hasErrors = true
    } else {
        emailGroup.querySelector('.invalid-feedback').classList.remove('d-block')
        emailInput.classList.remove('is-invalid')
    }

    if (!passwordRegex.test(passwordInput.value)) {
        passwordGroup.querySelector('.invalid-feedback').classList.add('d-block')
        passwordInput.classList.add('is-invalid')
        hasErrors = true
    } else {
        passwordGroup.querySelector('.invalid-feedback').classList.remove('d-block')
        passwordInput.classList.remove('is-invalid')
    }

    if (hasErrors) return

    signInBtn.querySelector('.indicator-label').classList.add('d-none')
    signInBtn.querySelector('.indicator-progress').classList.add('d-block')

    //отправка данных на сервер
    const sendData = {
        username: emailInput.value,
        password: passwordInput.value
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://fines.naveoapps.ru/do_login.php");

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        signInBtn.querySelector('.indicator-label').classList.remove('d-none')
        signInBtn.querySelector('.indicator-progress').classList.remove('d-block')

        if (xhr.status === 200) {
            console.log('res = ', xhr.responseText);
            if (xhr.responseText.includes('Ошибка')) {
                document.querySelector('#loginError').classList.add('d-block')
                document.querySelector('#loginError').innerHTML = xhr.responseText
            } else {
                const res = JSON.parse(xhr.responseText)
                console.log(xhr.responseText, res);
            }
        }
    }};

    xhr.send(JSON.stringify(sendData));
})