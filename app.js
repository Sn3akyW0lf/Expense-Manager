const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');

var cors = require('cors');

const app = express();

app.use(cors());


const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findByPk(1)
//     .then(user => {
//         req.user = user;
//         next();
//     })
//     .catch(err => console.log(err));
// })

app.use(userRoutes);
app.use('/expense', expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

app.use(errorController.get404);

async function start() {
    try{
         let result = await sequelize.sync();
        //  let result = await sequelize.sync({ force: true });         
        //  let user = await User.findByPk(1);

        //  if (!user){
        //     await User.create({ name: 'Sid', email: 'siddhesh.meher@protonmail.com'});
        //  }

         app.listen(4000);
    } catch (err) {
        console.log(err);
    }
}

start();



