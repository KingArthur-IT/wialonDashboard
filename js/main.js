//внутренние данные для таблицы
var carsData = []

// const reqData = [
//     { name: "LADA", reg_plate: "А183СМ82", sts: '8225725410'},
//     { name: "LADA", reg_plate: "А183СМ82", sts: '8225725410'},
// ]

//Получить данные
const url = "https://fines.naveoapps.ru/wialon.php?user_name=alk-spb%40yandex.ru&access_token=4ca372de99f11361de6d499caafcafbe6C3660739CDD084BC99382B4EB26F27B566FF497";

var xhrGetCars = new XMLHttpRequest();
xhrGetCars.open("GET", url);

xhrGetCars.setRequestHeader("Accept", "application/json");
xhrGetCars.setRequestHeader("Content-Type", "application/json");

xhrGetCars.onreadystatechange = function () {
if (xhrGetCars.readyState === 4) {
    if (xhrGetCars.status === 200) {
        const reqData = JSON.parse(xhrGetCars.responseText)
        console.log(reqData);
        document.querySelector('#loader')?.classList.add('d-none')

        if (reqData.length) {
            document.querySelector('#cars-table')?.classList.remove('d-none');
            carsData = reqData.map((el, inx) => {
                return {
                    ...el, 
                    id: inx + 1,
                    checked: true,
                    edit: false
                }
            });
            addToTable(carsData);
            setEventListeners()
        } else {
            document.querySelector('#no-data-text')?.classList.remove('d-none')
        }
    }
}};

xhrGetCars.send();


//functions
function getTableRowTemplate(id, name, reg, sts) { 
    return `
    <tr class="main-row" data-id="${id}">
        <td class="p-0 pe-2">
            <div class="form-check form-check-sm form-check-custom form-check-solid">
                <input class="car-checkbox form-check-input" type="checkbox" data-id="${id}" checked />
            </div>
        </td>
        <td class="p-0 pe-2">
            <input type="text" class="car-name form-control border-0" value="${name}" readonly data-id="${id}">
        </td>
        <td class="p-0 pe-2">
            <input type="text" class="car-reg_plate form-control border-0" value="${reg}" readonly data-id="${id}">
        </td>
        <td class="p-0 pe-2">
            <input type="text" class="car-sts form-control border-0" value="${sts}" readonly data-id="${id}">
        </td>
        <td class="pe-0 text-end">
            <button class="btn btn-light fw-boldest btn-sm px-5 car-btn" data-id="${id}">Редактировать</button>
        </td>
    </tr>
    <tr class="info-row d-none" data-id="${id}">
        <td colspan="5">
            <div class="info ps-19"></div>
        </td>
    </tr>
    `
}

function addToTable(tableData) {
    const table = document.getElementById('cars-table-body')
    document.querySelector('#allChecked').checked = true
    tableData.forEach((d) => {
        table.insertAdjacentHTML('beforeend', getTableRowTemplate(d.id, d.name, d.reg_plate, d.sts))
    })
    setTableListeners()
}

function setEventListeners() {
    //all checked
    document.querySelector('#allChecked').addEventListener('input', (el) => {
        carsData.forEach((car) => {
            car.checked = el.target.checked
        })
    });

    //send btn
    document.querySelector('#sendRequest').addEventListener('click', penaltyRequestHandler);
}

function setTableListeners() {
    //edit btn
    document.querySelectorAll('.car-btn').forEach(btnEl => 
        btnEl.addEventListener('click', () => {
            const id = btnEl.getAttribute('data-id')
            const inputsArr = ['name', 'reg_plate', 'sts']

            if (btnEl.innerHTML === 'Редактировать') {
                //set editable
                btnEl.innerHTML = 'Сохранить'
                inputsArr.forEach(item => {
                    document.querySelector(`input.car-${item}[data-id='${id}']`).classList.remove('border-0')
                    document.querySelector(`input.car-${item}[data-id='${id}']`).removeAttribute('readonly')
                });
            }
            else {
                btnEl.innerHTML = 'Редактировать'
                inputsArr.forEach(item => {
                    document.querySelector(`input.car-${item}[data-id='${id}']`).classList.add('border-0')
                    document.querySelector(`input.car-${item}[data-id='${id}']`).setAttribute('readonly', true)
                    carsData[id - 1][item] = document.querySelector(`input.car-${item}[data-id='${id}']`).value
                });

                //ЗАПРОС на обновление данных
                const reqData = carsData.map(el => {
                    return {
                        name: el.name,
                        req_plate: el.reg_plate,
                        sts: el.sts
                    }
                });
                console.log('update data', reqData);
                //...
            }
        })    
    );

    //checkboxes
    document.querySelectorAll('.car-checkbox').forEach(box => 
        box.addEventListener('input', () => {
            const id = box.getAttribute('data-id')
            if (id) {
                carsData[id - 1].checked = box.checked;
            }
        })
    );
}

function penaltyRequestHandler() {
    const sendData = carsData.filter(car => car.checked).map(el => {
        return {
            reg_plate: el.reg_plate,
            sts: el.sts
        }
    })
    console.log(sendData);
    if (sendData.length) {
        //ЗАПРОС на отправку данных для проверки штрафов
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://fines.naveoapps.ru/fines.php");

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText)
                carsData.filter(car => car.checked).forEach((el, inx) => {
                    if (res.length > inx) {
                        document.querySelector(`.main-row[data-id='${el.id}']`).classList.add('border-bottom-0')
                        const row = document.querySelector(`.info-row[data-id='${el.id}']`)
                        row.classList.remove('d-none')
                        if (res[inx].status === 200)
                            row.querySelector('.info').innerHTML = `Количество штрафов: ${res[inx].num}, ${res[inx].message}`
                        else row.querySelector('.info').innerHTML = res[inx].message
                    }
                });
            }
        }};

        xhr.send(JSON.stringify(sendData));
    }
}