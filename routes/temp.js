const express = require('express');
const userModel = require('../models/User');
const app = express();

//Read ALL
//http://localhost:8081/Users
app.get('/Users', async (req, res) => {
  const Users = await userModel.find({});
  //Sorting
  //use "asc", "desc", "ascending", "descending", 1, or -1
  //const Users = await userModel.find({}).sort({'firstname': -1});
  
  //Select Specific Column
  //const Users = await userModel.find({}).select("firstname lastname salary").sort({'salary' : 'desc'});  
  
  try {
    console.log(Users[0].surname)
    res.status(200).send(Users);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Read By ID
//http://localhost:8081/User?id=60174acfcde1ab2e78a3a9b0
app.get('/User', async (req, res) => {
  //const Users = await userModel.find({_id: req.query.id});
  //const Users = await userModel.findById(req.query.id);
  const Users = await userModel.find({_id: req.query.id}).select("firstname lastname salary");

  try {
    res.send(Users);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Search By First Name - PATH Parameter
//http://localhost:8081/Users/firstname/pritesh
app.get('/Users/firstname/:name', async (req, res) => {
  const name = req.params.name
  const Users = await userModel.find({firstname : name});
  
  //Using Virtual Field Name
  //console.log(Users[0].fullname)

  //Using Instance method
  //console.log(Users[0].getFullName())

  //Using Static method
  //const Users = await userModel.getUserByFirstName(name)
  
  //Using Query Helper
  //const Users = await userModel.findOne().byFirstName(name)
  
  try {
    if(Users.length != 0){
      res.send(Users);
    }else{
      res.send(JSON.stringify({status:false, message: "No data found"}))
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//Search By First Name OR Last Name
//http://localhost:8081/Users/search?firstname=pritesh&lastname=patel
app.get('/Users/search', async (req, res) => {
  //console.log(req.query)
  if(Object.keys(req.query).length != 2){
    res.send(JSON.stringify({status:false, message: "Insufficient query parameter"}))
  }else{
    const fname = req.query.firstname
    const lname = req.query.lastname
    //{ $or: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }] },
    //const Users = await userModel.find({ $and: [{firstname : fname}, {lastname : lname}]});
    const Users = await userModel.find({ $or: [{firstname : fname}, {lastname : lname}]});
    ///Use below query for AND condition
    //const Users = await userModel.find({firstname : fname, lastname : lname});

    try {
      if(Users.length != 0){
        res.send(Users);
      }else{
        res.send(JSON.stringify({status:false, message: "No data found"}))
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});


//Search By salary > 1000
//http://localhost:8081/Users/salary?value=1000
app.get('/Users/salary', async (req, res) => {
  //console.log(req.query)
  if(Object.keys(req.query).length != 1){
    res.send(JSON.stringify({status:false, message: "Insufficient query parameter"}))
  }else{
    const salary = req.query.value
  
    //const Users = await userModel.find({salary : {$gte : salary}});
    const Users = await userModel.find({}).where("salary").gte(salary);
    // <= 10000
    //const Users = await userModel.find({salary : {$lte : salary }});
    
    try {
      if(Users.length != 0){
        res.send(Users);
      }else{
        res.send(JSON.stringify({status:false, message: "No data found"}))
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

//Some more test queries
//http://localhost:8081/Users/test
app.get('/Users/test', async (req, res) => {
  try {
    const Users = userModel.
                        find({})
                        .where('lastname').equals('patel')
                        .where('salary').gte(1000.00).lte(10000.00)
                        .where('firstname').in(['pritesh', 'moksh'])
                        .limit(10)
                        .sort('-salary')
                        .select('firstname lastname salary')
                        .exec((err, data) => {
                          if (err){
                              res.send(JSON.stringify({status:false, message: "No data found"}));
                          }else{
                              res.send(data);
                          }
                        });
    } catch (err) {
      res.status(500).send(err);
    }
});

//Create New Record
/*
    //Sample Input as JSON
    //application/json as Body
    {
      "firstname":"Pritesh",
      "lastname":"Patel",
      "email":"p@p.com",
      "gender":"Male",
      "city":"Toronto",
      "designation":"Senior Software Engineer",
      "salary": 10000.50
    }
*/
//http://localhost:8081/User
app.post('/User', async (req, res) => {
  
    console.log(req.body)
    const User = new userModel(req.body);
    
    try {
      await User.save((err) => {
        if(err){
          //Custome error handling
          //console.log(err.errors['firstname'].message)
          //console.log(err.errors['lastname'].message)
          //console.log(err.errors['gender'].message)
          //console.log(err.errors['salary'].message)
          res.send(err)
        }else{
          res.send(User);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });

//Update Record
//http://localhost:8081/User/60174acfcde1ab2e78a3a9b0
app.patch('/User/:id', async (req, res) => {
  try {
    console.log(req.body)
    const User =  await userModel.findOneAndUpdate({ _id: req.params.id}, req.body, {new: true})
    //const User =  await userModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.send(User)
  } catch (err) {
    res.status(500).send(err)
  }
})

//Delete Record by ID
//http://localhost:8081/User/5d1f6c3e4b0b88fb1d257237
app.delete('/User/:id', async (req, res) => {
    try {
      const User = await userModel.findByIdAndDelete(req.params.id)

      if (!User) 
      {
        res.status(404).send(JSON.stringify({status: false, message:"No item found"}))
      }else{
        res.status(200).send(JSON.stringify({status: true, message:"Record Deleted Successfully"}))
      }
    } catch (err) {
      res.status(500).send(err)
    }
  })

  //Delete Record using findOneAndDelete()
//http://localhost:8081/User/delete?emailid=5d1f6c3e4b0b88fb1d257237
app.get('/User/delete', async (req, res) => {
  try {
    const User = await userModel.findOneAndDelete({email: req.query.emailid})

    if (!User) 
    {
      res.status(404).send(JSON.stringify({status: false, message:"No item found"}))
    }else{
      //User.remove() //Update for Mongoose v5.5.3 - remove() is now deprecated
      res.status(200).send(JSON.stringify({status: true, message:"Record Deleted Successfully"}))
    }
  } catch (err) {
    res.status(500).send(err)
  }
})
module.exports = app

//Insert Multiple Records
/*
userModel.create(
  [{"firstname":"Keriann","lastname":"Qualtro","email":"kqualtro3@mediafire.com","gender":"Female","city":"Ulricehamn","designation":"Nurse Practicioner","salary":"9288.95"},
  {"firstname":"Bette","lastname":"Elston","email":"belston4@altervista.org","gender":"Female","city":"Xinhang","designation":"Staff Accountant III","salary":"3086.99"},
  {"firstname":"Editha","lastname":"Feasby","email":"efeasby5@ovh.net","gender":"Female","city":"San Francisco","designation":"Mechanical Systems Engineer","salary":"1563.63"},
  {"firstname":"Letizia","lastname":"Walrond","email":"lwalrond6@ibm.com","gender":"Male","city":"Ricardo Flores Magon","designation":"Research Associate","salary":"6329.05"},
  {"firstname":"Molly","lastname":"MacTrustrie","email":"mmactrustrie7@adobe.com","gender":"Female","city":"Banjarejo","designation":"Quality Control Specialist","salary":"4059.61"}]
)
*/