const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

require('dotenv').config();

const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPasswordRequests = require('./models/forgotPassword');

const cors = require('cors');

const app = express();

app.use(cors());

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');

// app.use(helmet());

// app.use(helmet({
//     contentSecurityPolicy: false
// }));

// app.use(bodyParser.json({ extended: false }));

app.use(express.json());

// app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com");
    // next();
    front();
});

let front = app.use((req, res) => {
    console.log('url----', req.url);
    res.sendFile(path.join(__dirname, `public/Pages/${req.url}`));
});


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);


async function start() {
    try{
        console.log('trying connection');

         let result = await sequelize.sync();
        //  let result = await sequelize.sync({ force: true });

         app.listen(process.env.PORT || 4000);
    } catch (err) {
        console.log('Error ---- ',err);
    }
}

start();



