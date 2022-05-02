import mqtt from 'mqtt'
import userModel from '../models/User.js'
import fetch from "node-fetch";

function updateFan(status, adaUsername, adaPassword){
  fetch(`https://io.adafruit.com/api/v2//${adaUsername}/feeds/fan/data?X-AIO-Key=${adaPassword}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({datum:{value:status}})
    }).then(res=>res.json())
    .then(console.log);
}

function updatePump(status, adaUsername, adaPassword){
  fetch(`https://io.adafruit.com/api/v2//${adaUsername}/feeds/pump/data?X-AIO-Key=${adaPassword}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({datum:{value:status}})
    }).then(res=>res.json())
    .then(console.log);
}

async function sub(userid,adaUsername, adaPassword,lowerboundtemp, upperboundtemp,lowerboundhumid,upperboundhumid ){//userid
  const connectUrl = `https://io.adafruit.com:1883`
  const clientID = `subcriber12` //random but unique
  const topic1 = adaUsername + '/feeds/temp'//fill your topic link
  const topic2 = adaUsername + '/feeds/humid'

  //watch mongodb to update constraint
  // routineModel.watch([],{ fullDocument : "updateLookup" }).on('change', change =>{
  //   console.log(change)
  // })

  //watch mongodb to update constraint
  userModel.watch([],  { fullDocument : "updateLookup" }).on('change', async (change) => {
    console.log(change)
    if(change.fullDocument.userid && change.fullDocument.userid == userid)
    {
      if(change.updateDescription.updatedFields.lowerboundhumid != undefined){
        lowerboundhumid = change.updateDescription.updatedFields.lowerboundhumid;
        console.log('update lowerboundhumid ',userid, ' ',lowerboundhumid);
        const rawResponse = await fetch(`https://io.adafruit.com/api/v2/${adaUsername}/feeds/humid/data?X-AIO-Key=${adaPassword}`);
        const content = await rawResponse.json();
      
        if(content[0].value<lowerboundhumid){
          updatePump('ON',adaUsername,adaPassword)
        }
      }
      if(change.updateDescription.updatedFields.lowerboundtemp != undefined){
        lowerboundtemp = change.updateDescription.updatedFields.lowerboundtemp;
        console.log('update lowerboundtemp ',userid, ' ',lowerboundtemp);
        const rawResponse = await fetch(`https://io.adafruit.com/api/v2/${adaUsername}/feeds/temp/data?X-AIO-Key=${adaPassword}`);
        const content = await rawResponse.json();
      
        if(content[0].value<lowerboundtemp){
          updateFan('OFF',adaUsername,adaPassword)
        }
      }
      if(change.updateDescription.updatedFields.upperboundhumid != undefined){
        upperboundhumid = change.updateDescription.updatedFields.upperboundhumid;
        console.log('update upperboundhumid ',userid, ' ',upperboundhumid);
        const rawResponse = await fetch(`https://io.adafruit.com/api/v2/${adaUsername}/feeds/humid/data?X-AIO-Key=${adaPassword}`);
        const content = await rawResponse.json();
      
        if(content[0].value>upperboundhumid){
          updatePump('OFF',adaUsername,adaPassword)
        }
      }
      if(change.updateDescription.updatedFields.upperboundtemp != undefined){
        upperboundtemp = change.updateDescription.updatedFields.upperboundtemp;
        console.log('update upperboundtemp ',userid, ' ',upperboundtemp);
        const rawResponse = await fetch(`https://io.adafruit.com/api/v2/${adaUsername}/feeds/temp/data?X-AIO-Key=${adaPassword}`);
        const content = await rawResponse.json();
      
        if(content[0].value>upperboundtemp){
          updateFan('ON',adaUsername,adaPassword)
        }
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
          if(topic == topic1){//temp
            if(payload > upperboundtemp){
              //turn on fan
              updateFan('ON',adaUsername,adaPassword)
            }
            if(payload < lowerboundtemp){
              //turn off fan
              updateFan('OFF',adaUsername,adaPassword)
            }
          }else{
            if(payload > upperboundhumid){
              //turn off pump
              updatePump('OFF',adaUsername,adaPassword)
            }
            if(payload < lowerboundhumid){
              //turn on pump
              updatePump('ON',adaUsername,adaPassword)
            }
          }
          // if(payload > 35){
          //   console.log("so qua")
          //   let val = 30;
          //   client.publish(topic, val.toString(), { qos: 0, retain: false }, (error) => {
          //     if (error) {
          //       console.error(error)  
          //     }
          //     else{
          //       console.log("Done: ", val)
        
          //     }
          //   })
          // }
        })
      })
    })
  })
}

async function suball(){
  const users =  await userModel.find({});
  let arrusers = []
  for(let user of users){
    arrusers.push(user.userid)
    sub(user.userid, user.adaUsername, user.adaPassword, user.lowerboundtemp, user.upperboundtemp, user.lowerboundhumid, user.upperboundhumid )
  }
  console.log(arrusers)
  return arrusers 
}




// module.exports =  {sub,suball}
export default suball

