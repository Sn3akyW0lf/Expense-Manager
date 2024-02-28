const path = require('path');
const fs = require('fs');

const express = require('express');
const helmet = require('helmet');
// const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPasswordRequests = require('./models/forgotPassword');

var cors = require('cors');

const app = express();

app.use(cors());

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

app.use(helmet());
// app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

app.use(errorController.get404);

async function start() {
    try{
         let result = await sequelize.sync();
        //  let result = await sequelize.sync({ force: true });

         app.listen(process.env.PORT || 4000);
    } catch (err) {
        console.log(err);
    }
}

start();



