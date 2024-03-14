const myForm = document.querySelector('#my-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const msg_email = document.getElementById('msg_email');
const msg_password = document.getElementById('msg_password');
// const studentParentPhone = document.getElementById('student_parent');

myForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    try {
        e.preventDefault();

        if (email.value === '') {
            msg_email.style.color = 'chocolate';
            msg_email.style.background = 'beige';
            msg_email.innerHTML = 'Please Enter Email!';
            setTimeout(() => msg_email.remove(), 3000);
        } else if (password.value === '') {
            msg_password.style.color = 'chocolate';
            msg_password.style.background = 'beige';
            msg_password.innerHTML = 'Please Enter Password!';
            setTimeout(() => msg_password.remove(), 3000);
        } else {
            // console.log(username.value, email.value, password.value);

            objUser = {
                email: email.value,
                password: password.value,
                // student_parent: studentParentPhone.value
            };

            // console.log(objUser);

            let res = await axios.post('http://13.233.236.151:4000/login', objUser);
            // let res = await axios.post('/login', objUser);

            // console.log(res);
            // console.log(res.data.premium);

            let prem = res.data.premium ? 1 : 0;

            // alert(res.data.message);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('isPremium', prem);
            localStorage.setItem('rowSize', 5);

            window.location.replace('index.html');

            // username.value = '';
            // email.value = '';
            // password.value = '';
            // studentParentPhone.value = '';
        }



    } catch (err) {
        console.log(err);

        if (err.response.status === 404) {
            msg_dup.style.color = 'chocolate';
            msg_dup.style.background = 'beige';
            msg_dup.innerHTML = 'The Email is not Registered, Please Register!';
            setTimeout(() => msg_dup.remove(), 3000);
        } else if (err.response.status === 401) {
            msg_wp.style.color = 'chocolate';
            msg_wp.style.background = 'beige';
            msg_wp.innerHTML = 'The Password is Wrong!';
            setTimeout(() => msg_wp.remove(), 3000);
        }

        // msg_dup.style.color = 'chocolate';
        // msg_dup.style.background = 'beige';
        // msg_dup.innerHTML = 'Sorry, the Email already Exists!';
        // setTimeout(() => msg_dup.remove(), 3000);
        
    }
}