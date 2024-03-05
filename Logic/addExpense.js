const myForm = document.querySelector('#my-form');
const expense = document.querySelector('#expense');
const exp_desc = document.querySelector('#exp_desc');
const exp_type = document.querySelector('#exp_type');
const msg_exp = document.querySelector('#msg_exp');
const msg_exp_type = document.querySelector('#msg_exp_type');
const msg_desc = document.querySelector('#msg_desc');

myForm.addEventListener('submit', onSubmit);


async function onSubmit(e) {
    try {
        e.preventDefault();

        const token = localStorage.getItem('token');        

        if (expense.value === '') {
            msg_exp.style.color = 'chocolate';
            msg_exp.style.background = 'beige';
            msg_exp.innerHTML = 'Please Enter Expense Amount!';
            setTimeout(() => msg_exp.remove(), 3000);
        } else if (exp_desc.value === '') {
            msg_desc.style.color = 'chocolate';
            msg_desc.style.background = 'beige';
            msg_desc.innerHTML = 'Please Enter Something about Your Expense!';
            setTimeout(() => msg_desc.remove(), 3000);
        } else if (exp_type.value === 'none') {
            msg_exp_type.style.color = 'chocolate';
            msg_exp_type.style.background = 'beige';
            msg_exp_type.innerHTML = 'Please Select Expense Type!';
            setTimeout(() => msg_exp_type.remove(), 3000);
        } else {
            let expObj = {
                amount: expense.value,
                category: exp_type.value,
                description: exp_desc.value
                
            }
            console.log(expObj);


            let res = await axios.post('http://13.233.152.205:4000/expense/add-expense', expObj, { headers: { 'Authorization' : token } });

            // let res = await axios.post('/expense/add-expense', expObj, { headers: { 'Authorization' : token } });
            

            console.log(res);

            window.location.replace('index.html');

            // console.log(expObj);
        }
    } catch (err) {
        console.log(err);
    }


}