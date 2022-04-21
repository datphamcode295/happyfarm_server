const express = require('express');
const mongoose = require('mongoose');
const employeeRouter = require('./routes/EmployeeRoutes.js');
const userRouter = require('./routes/UserRoutes.js');
const mqtt = require('./mqtt/index.js')


const app = express();
app.use(express.json()); // Make sure it comes back as json

//TODO - Replace you Connection String here // datbk:123456789dat
mongoose.connect('mongodb+srv:// @cluster0.punaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

mqtt.sub();
  



app.use(employeeRouter);
app.use(userRouter);




app.listen(8081, () => { console.log('Server is running...') });
