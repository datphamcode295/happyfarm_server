const express = require('express');
const userModel = require('../models/User');
const app = express();

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
    const user = await userModel.findOne({userid: req.query.userid}).select("lowerboundtemp upperboundtemp lowerboundhumid upperboundhumid routine1 routine2 history");
  
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
      "userid":"65634",
	    "lowerboundtemp":"125",
    	"upperboundtemp":"320",
    	"lowerboundhumid":"135",
    	"upperboundhumid":"340",
    	"routine1":[
      		{
      			"starttime":"143243243243",
      			"endtime":"193434432334",
      			"divice":"fan"
      		}
    	],
    	"routine2":[
      		{
      			"time":"1343532342",
      			"divece":"fan",
      			"status": "1" 
      		}
      	],
      "history":[
      		{
      			"time":"15234324324",
      			"notification": "qua nhiet"
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





module.exports = app
