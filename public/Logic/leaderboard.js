window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const isPremium = localStorage.getItem('isPremium');


    if (isPremium == true) {
        razorPremium.className = 'd-none';

        let result = await axios.get('http://13.233.236.151:4000/premium/show-leaderboard', {
        // let result = await axios.get('/premium/show-leaderboard', {
            headers: {
                'Authorization': token
            }
        });

        // console.log(result);

        premium_leader.className = 'container';

        const data = result.data;

        data.forEach(d => {
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');

            td1.appendChild(document.createTextNode(`${d.name}`));
            if (d.totalExpense) {
                td2.appendChild(document.createTextNode(`${d.totalExpense}`));
            } else {
                td2.appendChild(document.createTextNode(0));
            }

            tr.appendChild(td1);
            tr.appendChild(td2);
            tblLeader.appendChild(tr);

        });
    } else {
        msg_premium.style.color = 'chocolate';
        msg_premium.className = 'align-self-center';        
        msg_premium.innerHTML = 'This is a Premium Member Feature, Please Purchase Membership to Access this Page!';
    }



})

function premiumMessage() {
    razorPremium.className = 'd-none';
    msg_premium.style.color = 'chocolate';
    msg_premium.innerHTML = 'You Are a Premium Member!';
    btnLeader.className = 'btn btn-warning btn-sm btn-outline-dark p-3 m-3';
}