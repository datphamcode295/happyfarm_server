const mqtt = require('mqtt')
const dotenv = require('dotenv').config()
const userModel = require('../models/User')




async function sub(userid,adaUsername, adaPassword,lowerboundtemp, upperboundtemp,lowerboundhumid,upperboundhumid ){//userid
  const connectUrl = `https://io.adafruit.com:1883`
  const clientID = `subcriber12` //random but unique
  const topic1 = adaUsername + '/feeds/temp'//fill your topic link
  const topic2 = adaUsername + '/feeds/humid'


  //watch mongodb to update constraint
  userModel.watch([],  { fullDocument : "updateLookup" }).on('change', change => {
    if(change.fullDocument.userid && change.fullDocument.userid == userid)
    {
      if(change.updateDescription.updatedFields.lowerboundhumid != undefined){
        lowerboundhumid = change.updateDescription.updatedFields.lowerboundhumid;
        console.log('update lowerboundhumid ',userid, ' ',lowerboundhumid);
      }
      if(change.updateDescription.updatedFields.lowerboundtemp != undefined){
        lowerboundtemp = change.updateDescription.updatedFields.lowerboundtemp;
        console.log('update lowerboundtemp ',userid, ' ',lowerboundtemp);
      }
      if(change.updateDescription.updatedFields.upperboundhumid != undefined){
        upperboundhumid = change.updateDescription.updatedFields.upperboundhumid;
        console.log('update upperboundhumid ',userid, ' ',upperboundhumid);
      }
      if(change.updateDescription.updatedFields.upperboundtemp != undefined){
        upperboundtemp = change.updateDescription.updatedFields.upperboundtemp;
        console.log('update upperboundtemp ',userid, ' ',upperboundtemp);
      }
    }
      
  });

  //connect adafruit
  const client = mqtt.connect(connectUrl, {
    clientID,
    clean: true,
    connectTimeout: 4000,
    username: adaUsername, //username in adafruit io key (My Key)
    password: adaPassword,//active key in adafruit io key (My Key)
    reconnectPeriod: 1000,
  })
    


  client.on('connect', () => {
    console.log('Connected client 2 ', userid)
    client.subscribe([topic1], () => {
      console.log(`Subscribe to topic '${topic1}'`)
      //TRIGGER WHWN NEW VALUE COME
      client.subscribe([topic2], () => {
        console.log(`Subscribe to topic '${topic2}'`)
        //TRIGGER WHWN NEW VALUE COME
        client.on('message', (topic, payload) => {
          console.log('Received Message:', topic, payload.toString(), 'lower humid : ', lowerboundhumid)
          if(payload > 35){
            console.log("so qua")
            let val = 30;
            client.publish(topic, val.toString(), { qos: 0, retain: false }, (error) => {
              if (error) {
                console.error(error)  
              }
              else{
                console.log("Done: ", val)
        
              }
            })
          }
        })
      })
    })
  })
}

async function suball(){
  const users =  await userModel.find({});
  let arrusers = []
  for(user of users){
    arrusers.push(user.userid)
    sub(user.userid, user.adaUsername, user.adaPassword, user.lowerboundtemp, user.upperboundtemp, user.lowerboundhumid, user.upperboundhumid )
  }
  console.log(arrusers)
  return arrusers
}




module.exports =  {sub,suball}

