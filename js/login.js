const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/;

const emailGroup = document.querySelector('#emailGroup')
const passwordGroup = document.querySelector('#passwordGroup')

const signInBtn = document.querySelector('#sign_in_submit')
const emailInput = emailGroup.querySelector('input')
const passwordInput = passwordGroup.querySelector('input')

signInBtn.addEventListener('click', (e) => {
    e.preventDefault()

    if (!emailValidator.test(emailInput.value)) {
        emailGroup.querySelector('.invalid-feedback').classList.add('d-block')
        emailInput.classList.add('is-invalid')
        return
    } else {
        emailGroup.querySelector('.invalid-feedback').classList.remove('d-block')
        emailInput.classList.remove('is-invalid')
    }

    if (!passwordRegex.test(passwordInput.value)) {
        passwordGroup.querySelector('.invalid-feedback').classList.add('d-block')
        passwordInput.classList.add('is-invalid')
        return
    } else {
        passwordGroup.querySelector('.invalid-feedback').classList.remove('d-block')
        passwordInput.classList.remove('is-invalid')
    }

    signInBtn.querySelector('.indicator-label').classList.add('d-none')
    signInBtn.querySelector('.indicator-progress').classList.add('d-block')

    //отправка данных на сервер
    //passwordInput.value
    //emailInput.value

    setTimeout(() => {
        signInBtn.querySelector('.indicator-label').classList.remove('d-none')
        signInBtn.querySelector('.indicator-progress').classList.remove('d-block')
    }, 2000);
})