const tblMonth = document.getElementById('tblMonth');
const tblYear = document.getElementById('tblYear');
const dlReport = document.getElementById('dlReport');
const token = localStorage.getItem('token');

var expArr = [];

// myForm.addEventListener('submit', onSubmit);

// records.addEventListener('click', remExp);
// records.addEventListener('click', editExp);

// Get Existing data from the database and populate the table with that data

window.addEventListener('DOMContentLoaded', async () => {
    try {

        const isPremium = localStorage.getItem('isPremium');

        console.log(isPremium == 0);

        if (isPremium == true) {
            premiumMessage();
        }

        if (isPremium == 0) {
            dlReport.className = 'd-none';
        }
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
        const token = localStorage.getItem('token');

        console.log(token);

        const expenseObj = {
            id: expense.id
        };

        // let res = await axios.post(`http://13.233.152.205:4000/expense/delete-expense`, expenseObj, {

        let res = await axios.post(`/expense/delete-expense`, expenseObj, {
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

    // const response = await axios.get('http://13.233.152.205:4000/purchase/purchase-membership', {
    const response = await axios.get('/purchase/purchase-membership', {        
        headers: {
            'Authorization': token
        }
    });

    console.log(response);

    let options = {
        'key': response.data.key_id,
        'order_id': response.data.order.id,
        'handler': async function (response) {
            // await axios.post('http://13.233.152.205:4000/purchase/update-transaction-status', {
            await axios.post('/purchase/update-transaction-status', {                
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
        // await axios.post('http://13.233.152.205:4000/purchase/failed-transaction', {
        await axios.post('/purchase/failed-transaction', {            
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
    msg_premium.className = 'align-self-center';    
    msg_premium.innerHTML = 'You Are a Premium Member!';
    // btnLeader.className = 'btn btn-warning btn-sm btn-outline-dark p-3 m-3';
}

dlReport.addEventListener('click', async () => {
    try {
        let response = await axios.get('http://13.233.152.205:4000/expense/download', {
        // let response = await axios.get('/expense/download', {
            
            headers: {
                'Authorization': token
            }
        });
        console.log(response.data);

        if (response.status === 200) {
            let a = document.createElement('a');
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response);
        }
    } catch (err) {
        if (response.status === 401) {
            msg_premium.style.color = 'chocolate';
            msg_premium.className = 'align-self-center';
            msg_premium.innerHTML = 'This is a Premium Member Feature, Please Purchase Membership to Access this Feature!';
        }
        console.log(err);
    }

});