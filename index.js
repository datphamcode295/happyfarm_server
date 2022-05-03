import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/UserRoutes.js'
import suball from './running/mqtt.js'
import dotenv from 'dotenv'
import userModel from './models/User.js'
import routineRouter from './routes/RoutineRoutes.js'
import mulCron from './running/cron.js'

const app = express()
let dotenvv = dotenv.config()
app.use(express.json()) // Make sure it comes back as json

//TODO - Replace you Connection String here
mongoose.connect(dotenvv.parsed.MONGODBLINK, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});


// mqtt.sub();
suball()

mulCron();


// const user = userModel.watch([],  { fullDocument : "updateLookup" }).on('change', change => {
//   // console.log(change.fullDocument.userid)
//   console.log(change.updateDescription.updatedFields.lowerboundhumid!= undefined)
//   // res.send(change);
// });
  



// app.use(employeeRouter)
app.use(userRouter) 
app.use(routineRouter) 




app.listen(8081, () => { console.log('Server is running...') });
