import express from 'express'
import userModel from '../models/User.js'

const app = express()

//Read ALL
//http://localhost:8081/users
app.get('/users', async (req, res) => {
  const users = await userModel.find({});
  try {
    console.log(users[0].userid)
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

//read by userid
// http://localhost:8081/user?userid=13234324
app.get('/user', async (req, res) => {
    const user = await userModel.findOne({userid: req.query.userid}).select("lowerboundtemp upperboundtemp lowerboundhumid upperboundhumid adaUsername adaPassword routine1 routine2 history");
  
    try {
        // const newuser = JSON.parse(user);
        // user[0].lowerboundtemp = 200;
        // console.log(user)
      res.send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  });



//create new collection
/*http://localhost:8081/user
  
{
      "userid":"11111",
	    "lowerboundtemp":"13",
    	"upperboundtemp":"22",
    	"lowerboundhumid":"23",
    	"upperboundhumid":"24",
        "adaUsername":"vandat2000",
        "adaPassword":"aio_c",
    	"routine1":[
      		{
      			"starttime":"332443243",
      			"endtime":"2243443322334",
      			"divice":"fan"
      		}
    	],
    	"routine2":[
      		{
      			"time":"13433532342",
      			"divece":"fan",
      			"status": "1" 
      		}
      	],
      "history":[
      		{
      			"time":"15234324324",
      			"notification": "hông ẩm gì hết trơn á"
      		}
      ]
  }
*/
  app.post('/user', async (req, res) => {
  
    console.log(req.body)
    const user = new userModel(req.body);
    
    try {
      await user.save((err) => {
        if(err){
          res.send(err)
        }else{
          res.send(user);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });


//add history
/* 
  http://localhost:8081/user/history/65634
  {
    "time":"15234324324",
    "notification": "nóng quá trời nè"
  }
*/
  app.patch('/user/history/:userid', async (req, res) => {
    
    try{
        let olduser = await userModel.findOne({userid: req.params.userid}).select("userid lowerboundtemp upperboundtemp lowerboundhumid upperboundhumid routine1 routine2 history");
        let oldarray = olduser.history;
        let newarray = new Array(req.body);

        Array.prototype.push.apply(newarray,oldarray);
        olduser.history = newarray;
        const user = new userModel(olduser);
        const response =  await userModel.findOneAndUpdate({ userid: req.params.userid}, user, {new: true})
        res.send(response)
        
    }catch (err){
        res.status(500).send(err);
    }
  });

//add Routine1
/*
  http://localhost:8081/user/routine1/22222
  {
      "starttime":"15234324324",
      "endtime": "22434432334",
      "divice": "pump"
  }
*/
  app.patch('/user/routine1/:userid', async (req, res) => {
      
    try{
        let olduser = await userModel.findOne({userid: req.params.userid}).select("userid lowerboundtemp upperboundtemp lowerboundhumid upperboundhumid routine1 routine2 history");
        let oldarray = olduser.routine1;
        let newarray = new Array(req.body);

        Array.prototype.push.apply(newarray,oldarray);
        olduser.routine1 = newarray;
        const user = new userModel(olduser);
        const response =  await userModel.findOneAndUpdate({ userid: req.params.userid}, user, {new: true})
        res.send(response)
        
    }catch (err){
        res.status(500).send(err);
    }
  });


//delete routine1
/*http://localhost:8081/user/routine1/22222
{
    "starttime": 15234324324,
    "endtime": 22434432334,
    "divice": "pump"

}
*/
  app.get('/user/routine1/:userid', async (req, res) => {
    try {
      let olduser = await userModel.findOne({userid: req.params.userid}).select("userid lowerboundtemp upperboundtemp lowerboundhumid upperboundhumid routine1 routine2 history");
      let oldarray = olduser.routine1;
      let deleteo = req.body;
      // console.log(deleteo);
      const index = oldarray.findIndex( a =>  a.starttime === deleteo.starttime && 
                                            a.endtime === deleteo.endtime &&
                                            a.divice === deleteo.divice);
      console.log(index);
      if(index > -1){
        olduser.routine1 = oldarray.filter((e) => e.starttime !== deleteo.starttime && 
                                                  e.endtime !== deleteo.endtime &&
                                                  e.divice !== deleteo.divice);
        const user = new userModel(olduser);
        const response =  await userModel.findOneAndUpdate({ userid: req.params.userid}, user, {new: true});
        res.status(200).send(JSON.stringify({status: true, message:"Routine1 Deleted Successfully"}))
      }
      else{
        res.status(404).send(JSON.stringify({status: false, message:"No Routine1 found"}))
      }
    
    } catch (err) {
      res.status(500).send(err)
    }
  });

// add Routine2
/*  http://localhost:8081/user/routine2/22222
  {
      "time": "15234324324",
      "divice":"pump",
      "status":"0"
  }
*/
app.patch('/user/routine2/:userid', async (req, res) => {
      
  try{
      let olduser = await userModel.findOne({userid: req.params.userid}).select("userid lowerboundtemp upperboundtemp lowerboundhumid upperboundhumid routine1 routine2 history");
      let oldarray = olduser.routine2;
      let newarray = new Array(req.body);

      Array.prototype.push.apply(newarray,oldarray);
      olduser.routine2 = newarray;
      const user = new userModel(olduser);
      const response =  await userModel.findOneAndUpdate({ userid: req.params.userid}, user, {new: true})
      res.send(response)
      
  }catch (err){
      res.status(500).send(err);
  }
});

//delete routine2
/*http://localhost:8081/user/routine2/22222
{
    "time": 15234324324,
    "divice":"pump",
    "status":"0"

}
*/
app.get('/user/routine2/:userid', async (req, res) => {
  try {
    let olduser = await userModel.findOne({userid: req.params.userid}).select("userid lowerboundtemp upperboundtemp lowerboundhumid upperboundhumid routine1 routine2 history");
    let oldarray = olduser.routine2;
    let deleteo = req.body;
    // console.log(deleteo);
    const index = oldarray.findIndex( a =>  a.time === deleteo.time && 
                                            a.divice === deleteo.divice &&
                                            a.status === deleteo.status);
    console.log(index);
    if(index > -1){
      olduser.routine2 = oldarray.filter((e) => e.time !== deleteo.time && 
                                                e.divice !== deleteo.divice &&
                                                e.status !== deleteo.status);
      const user = new userModel(olduser);
      const response =  await userModel.findOneAndUpdate({ userid: req.params.userid}, user, {new: true});
      res.status(200).send(JSON.stringify({status: true, message:"Routine2 Deleted Successfully"}))
    }
    else{
      res.status(404).send(JSON.stringify({status: false, message:"No Routine2 found"}))
    }
  
  } catch (err) {
    res.status(500).send(err)
  }
});
export default app
