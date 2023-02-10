//data
const reqData = [
    { name: "LADA К028РУ198", reg_plate: "К028РУ198", sts: '1'},
    { name: "LADA К028РУ198", reg_plate: "К028РУ198", sts: '2'},
    { name: "LADA К028РУ198", reg_plate: "К028РУ198", sts: '3'},
    { name: "LADA К028РУ198", reg_plate: "К028РУ198", sts: '4'},
    { name: "LADA К028РУ198", reg_plate: "К028РУ198", sts: '5'},
    { name: "LADA К028РУ198", reg_plate: "К028РУ198", sts: '6'},
]
var carsData = []
const perPage = 5
let pageIndex = 1
let pageCount = 0

//data loading
setTimeout(() => {
    document.querySelector('#loader')?.classList.add('d-none')

    if (reqData.length) {
        document.querySelector('#cars-table')?.classList.remove('d-none');
        carsData = reqData.map((el, inx) => {
            return {
                ...el, 
                id: inx + 1,
                checked: false,
                edit: false
            }
        });
        const elStart = (pageIndex - 1) * perPage
        const elEnd = pageIndex * perPage
        addToTable(carsData.slice(elStart, elEnd));
        setEventListeners()
        if (carsData.length > perPage) {
            document.querySelector('#pagination').classList.remove('d-none')
            pageCount = Math.ceil(carsData.length / perPage)
            document.querySelector('#pagination-count').innerHTML = pageCount
            setPagination()
        }
    } else {
        document.querySelector('#no-data-text')?.classList.remove('d-none')
    }
}, 1000);


//functions
function getTableRowTemplate(id, name, reg, sts) { 
    return `
    <tr class="car-table-row">
        <td class="p-0 pe-2">
            <div class="form-check form-check-sm form-check-custom form-check-solid">
                <input class="car-checkbox form-check-input" type="checkbox" data-id="${id}" />
            </div>
        </td>
        <td class="p-0 pe-2">
            <input type="text" class="car-name form-control border-0" placeholder="Название" value="${name}" readonly data-id="${id}">
        </td>
        <td class="p-0 pe-2">
            <input type="text" class="car-reg_plate form-control border-0" placeholder="Название" value="${reg}" readonly data-id="${id}">
        </td>
        <td class="p-0 pe-2">
            <input type="text" class="car-sts form-control border-0" placeholder="Название" value="${sts}" readonly data-id="${id}">
        </td>
        <td class="pe-0 text-end">
            <button class="btn btn-light fw-boldest btn-sm px-5 car-btn" data-id="${id}">Редактировать</button>
        </td>
    </tr>
    `
}

function addToTable(tableData) {
    const table = document.getElementById('cars-table-body');
    table.querySelectorAll('.car-table-row').forEach(el => el.remove())
    document.querySelector('#allChecked').checked = false
    carsData.forEach(car => car.checked = false)
    tableData.forEach((d) => {
        table.insertAdjacentHTML('beforeend', getTableRowTemplate(d.id, d.name, d.reg_plate, d.sts))
    })
    setTableListeners()
}

function setEventListeners() {
    //all checked
    document.querySelector('#allChecked').addEventListener('input', (el) => {
        const elStart = (pageIndex - 1) * perPage
        const elEnd = pageIndex * perPage
        carsData.forEach((car, inx) => {
            if (inx >= elStart && inx < elEnd) 
                car.checked = el.target.checked
        })
    });

    //send btn
    document.querySelector('#sendRequest').addEventListener('click', () => {
        const sendData = carsData.filter(car => car.checked).map(el => {
                return {
                    name: el.name,
                    req_plate: el.reg_plate,
                    sts: el.sts
                }
            })
        console.log(sendData);
        if (sendData.length) {
            //send request
        }
    });
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
                //send request to save
                console.log('update data');
                // carsData.map(el => {
                //     return {
                //         name: el.name,
                //         req_plate: el.reg_plate,
                //         sts: el.sts
                //     }
                // })
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

function setPagination() {
    document.querySelector('#pagination-left').addEventListener('click', () => {
        if (pageIndex > 1) {
            pageIndex --
            document.querySelector('#pagination-current').innerHTML = pageIndex
            const elStart = (pageIndex - 1) * perPage
            const elEnd = pageIndex * perPage
            addToTable(carsData.slice(elStart, elEnd));
        }
    });

    document.querySelector('#pagination-right').addEventListener('click', () => {
        if (pageIndex < pageCount) {
            pageIndex ++
            document.querySelector('#pagination-current').innerHTML = pageIndex
            const elStart = (pageIndex - 1) * perPage
            const elEnd = pageIndex * perPage
            addToTable(carsData.slice(elStart, elEnd));
        }
    })
}