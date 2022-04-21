const mqtt = require('mqtt')



async function sub(){
    const connectUrl = `https://io.adafruit.com:1883`
    const clientID = `subcriber1` //random but unique
    const topic = 'vandat2000/feeds/temp'//fill your topic link

    const client = await mqtt.connect(connectUrl, {
        clientID,
        clean: true,
        connectTimeout: 4000,
        username: 'vandat2000', //username in adafruit io key (My Key)
        password: '',//active key in adafruit io key (My Key)
        reconnectPeriod: 1000,
      })
      
      
      //subscribe to the topic
      await client.on('connect', () => {
        console.log('Connected')
        client.subscribe([topic], () => {
          console.log(`Subscribe to topic '${topic}'`)
          // client.on('message', (topic, payload) => {
          //     console.log('Received Message:', topic, payload.toString())
          //   })
          client.on('message', (topic, payload) => {
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
}



module.exports =  {sub}

