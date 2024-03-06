const tblExpense = document.getElementById('tblExpense');
var expArr = [];
const pagiantion = document.getElementById('pagination');
const token = localStorage.getItem('token');
const isPremium = localStorage.getItem('isPremium');
const row = localStorage.getItem('rowSize');
// myForm.addEventListener('submit', onSubmit);

// records.addEventListener('click', remExp);
// records.addEventListener('click', editExp);

// Get Existing data from the database and populate the table with that data

document.getElementById('exp_rows').onclick = function () {
    localStorage.setItem('rowSize', exp_rows.value);
}

window.addEventListener('DOMContentLoaded', async () => {
    try {

        const objUrlParams = new URLSearchParams(window.location.search);
        // console.log(objUrlParams);
        const page = objUrlParams.get('page') || 1;

        if (isPremium == true) {
            premiumMessage();
        }

        let response = await axios.get(`http://13.233.152.205:4000/expense/get-expenses?page=${page}&rowsize=${row}`, {

        // let response = await axios.get(`/expense/get-expenses?page=${page}&rowsize=${row}`, {
            headers: {
                'Authorization': token
            }
        });


        let {
            allExpDetails,
            ...pageData
        } = response.data;

        // console.log( 'expData - ' , allExpDetails, ' pageData -', pageData);

        listExpense(allExpDetails);
        showPagination(pageData);

    } catch (err) {
        console.log(err);
    }

    // console.log(expObj);

})

//Deleting the Expense Data from UL as well as Local Storage after Confirmation from the User

async function deleteExp(e) {
    try {
        // console.log(e);

        let tr = e.parentElement;
        let tbl = tr.parentElement;
        let expense = expArr.find(u => u.id == e.innerHTML);
        // console.log(expense);
        // const token = localStorage.getItem('token');

        // console.log(token);

        const expenseObj = {
            id: expense.id
        };

        let res = await axios.post(`http://13.233.152.205:4000/expense/delete-expense`, expenseObj, {
        // let res = await axios.post(`/expense/delete-expense`, expenseObj, {         
            headers: {
                'Authorization': token
            }
        });
        console.log(res);
        tbl.removeChild(tr);
    } catch (err) {
        console.log(err);
    }

}

document.getElementById('razorPremium').onclick = async function (e) {
    // const token = localStorage.getItem('token');

    const response = await axios.get('http://13.233.152.205:4000/purchase/purchase-membership', {
    // const response = await axios.get('/purchase/purchase-membership', {     
        headers: {
            'Authorization': token
        }
    });

    console.log(response);

    let options = {
        'key': response.data.key_id,
        'order_id': response.data.order.id,
        'prefill': {
            'name': 'Siddhesh Meher',
            'email': 'siddhesh.meher@protonmail.com',
            'contact': '7028796469'
        },
        'handler': async function (response) {
            await axios.post('http://13.233.152.205:4000/purchase/update-transaction-status', {
            // await axios.post('/purchase/update-transaction-status', {          
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, {
                headers: {
                    'Authorization': token
                }
            })

            alert('Congratulations! You are Now a Premium Member!');

            localStorage.setItem('isPremium', 1);

            razorPremium.className = 'd-none';
            msg_premium.style.color = 'chocolate';
            msg_premium.style.color = 'chocolate';
            msg_premium.innerHTML = 'You Are a Premium Member!';
        }
    };

    const rzpl = new Razorpay(options);
    rzpl.open();
    e.preventDefault();

    rzpl.on('payment.failed', async function (response) {
        console.log(response);
        await axios.post('http://13.233.152.205:4000/purchase/failed-transaction', {
        // await axios.post('/purchase/failed-transaction', {          
            order_id: options.order_id
        }, {
            headers: {
                'Authorization': token
            }
        })

        alert('Something Went Wrong!');
    })
};

function premiumMessage() {
    razorPremium.className = 'd-none';
    msg_premium.style.color = 'chocolate';
    msg_premium.className = 'align-self-center col-auto';
    msg_premium.innerHTML = 'You Are a Premium Member!';
    // btnLeader.className = 'btn btn-warning btn-sm btn-outline-dark p-3 m-3';
}

function listExpense(data) {
    tblExpense.innerHTML = '';

    data.forEach(d => {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');


        td1.appendChild(document.createTextNode(`${d.id}`));
        td1.className = 'd-none';
        td2.appendChild(document.createTextNode(`${d.amount}`));
        td3.appendChild(document.createTextNode(`${d.description}`));
        td4.appendChild(document.createTextNode(`${d.category}`));

        let del = document.createElement('button');
        del.className = 'btn btn-danger btn-sm float-right delete';
        del.appendChild(document.createTextNode('Delete Expense'));
        del.addEventListener('click', function () {
            deleteExp(td1);
        });

        let edit = document.createElement('button');
        edit.className = 'btn btn-info btn-sm float-right edit';
        edit.appendChild(document.createTextNode('Edit'));

        td5.appendChild(del);
        // td5.appendChild(edit);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tblExpense.appendChild(tr);

        expObj = {
            expense: d.amount,
            exp_desc: d.description,
            exp_type: d.expType,
            id: d.id
        };
        expArr.push(expObj);
    });

}

async function getExpenses (page) {
    const row = localStorage.getItem('rowSize');
    
    let response = await axios.get(`http://13.233.152.205:4000/expense/get-expenses?page=${page}&rowsize=${row}`, {
    // let response = await axios.get(`/expense/get-expenses?page=${page}&rowsize=${row}`, {   
        headers: {
            'Authorization': token
        }
    });
    console.log(response.data);

    let {
        allExpDetails,
        ...pageData
    } = response.data;

    listExpense(allExpDetails);
    showPagination(pageData);
}

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
    }) {
        pagiantion.innerHTML = '';

        if (hasPreviousPage) {
            const btn2 = document.createElement('button');
            btn2.innerHTML = previousPage;
            btn2.addEventListener('click', () => getExpenses(previousPage));
            pagiantion.appendChild(btn2);
        }

        const btn1 = document.createElement('button');
        btn1.innerHTML = `<h5>${currentPage}</h5>`;
        // btn1.addEventListener('click', () => getExpenses(currentPage));
        pagiantion.appendChild(btn1);

        if (hasNextPage) {
            const btn3 = document.createElement('button');
            btn3.innerHTML = nextPage;
            btn3.addEventListener('click', () => getExpenses(nextPage));
            pagiantion.appendChild(btn3);
        }
}