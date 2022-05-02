import express from 'express'
import routineModel from '../models/Routine.js';

const app = express();

//Read ALL
//http://localhost:8081/routines
app.get('/routines', async (req, res) => {
    const routines = await routineModel.find({});
    try {
      console.log(routines)
      res.status(200).send(routines);
    } catch (err) {
      res.status(500).send(err);
    }
});

//Read ALL
//http://localhost:8081/routine/11111
app.get('/routine/:userid', async (req, res) => {
    const routines = await routineModel.find({});
    try {
      console.log(routines)
      const result = routines.filter(e=>e.userid==req.params.userid)
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err);
    }
});
app.post('/routine', async (req, res) => {

    console.log(req.body)
    const routine = new routineModel(req.body);

    try {
        await routine.save((err) => {
        if(err){
            res.send(err)
        }else{
            res.send(routine);
        }
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

//Delete Record by ID
//http://localhost:8081/employee/5d1f6c3e4b0b88fb1d257237
app.delete('/routine/:id', async (req, res) => {
    try {
      const routine = await routineModel.findByIdAndDelete(req.params.id)

      if (!routine) 
      {
        res.status(404).send(JSON.stringify({status: false, message:"No item found"}))
      }else{
        res.status(200).send(JSON.stringify({status: true, message:"Record Deleted Successfully"}))
      }
    } catch (err) {
      res.status(500).send(err)
    }
  })


export default app

