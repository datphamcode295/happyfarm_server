import Cron from 'cron'
import fetch from "node-fetch"
import routineModel from '../models/Routine.js'
import userModel from '../models/User.js'
import dotenv from 'dotenv'

const CronJob = Cron.CronJob
const dotenvv = dotenv.config()

function deleteRoutine(id){
    fetch(`http://localhost:8081/routine/${id}`, {
                        method: 'DELETE'
                        })
                        .then(res1=>res1.json())
                        .then(console.log)
}

function cron(username, key, userid){
    let jobArray = []
    let idArray = []
    fetch(`http://localhost:8081/routine/${userid}`)
        .then(res=>res.json())
        .then(res=>{

        for(let i =0; i< res.length; i++){
        //     //thieu fix loi time qua r
        console.log(res[i])

            const x = new Date(res[i].time)
            
            let time = x.getSeconds() + " " + x.getMinutes() + " " + x.getHours() + " " + x.getDate() + " " + x.getMonth() + " *"
            console.log(time)

            const job = new CronJob(time, function() {
                // chua xu li khi request qua han
              
                
                console.log('Cron ',i,'running...', time, res[i].device)
                fetch(`https://io.adafruit.com/api/v2/${username}/feeds/${res[i].device}/data?X-AIO-Key=${key}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({datum:{value:res[i].status}})
                })
                .then(res1=>res1.json())
                .then(finalres=>{
       
                    job.stop()
                    const id = res[i]._id
                    jobArray.splice(idArray.findIndex(e=>e==id),1)
                    idArray.splice(idArray.findIndex(e=>e==id),1)
                    deleteRoutine(id)
                    console.log(idArray)
                    console.log(jobArray)

                })
                .catch(error => {
                    throw(error);
                })
            })
            jobArray.push(job)
            idArray.push(res[i]._id)
            console.log(idArray)
            console.log(jobArray)
            job.start()
        }
    })
    .catch(error => {
        throw(error);
    })

    routineModel.watch([],{ fullDocument : "updateLookup" }).on('change', change =>{
        // let stringid = change.fullDocument._id
        // a.push(change.documentKey.match(/\".*\"/g)[0].replaceAll('"',''))
        // console.log(stringid.toString())
            
                if(change.operationType == 'insert' && change.fullDocument.userid == userid){
                    const x = new Date(change.fullDocument.time)
            
                    let time = x.getSeconds() + " " + x.getMinutes() + " " + x.getHours() + " " + x.getDate() + " " + x.getMonth() + " *"
                    console.log(time)
                    const job = new CronJob(time, function() {
                        // chua xu li khi request qua han
                        // chua xu li delete khi hoan thanh request
                        
                        console.log('Cron insert ','running...', time, change.fullDocument.device)
                        fetch(`https://io.adafruit.com/api/v2/${username}/feeds/${change.fullDocument.device}/data?X-AIO-Key=${key}`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({datum:{value:change.fullDocument.status}})
                        })
                        .then(res1=>res1.json())
                        .then(finalres=>{
                            // console.log(res)
                            job.stop()
                            const id = change.fullDocument._id.toString()
                            jobArray.splice(idArray.findIndex(e=>e==id),1)
                            idArray.splice(idArray.findIndex(e=>e==id),1)
                            deleteRoutine(id)
                            console.log(idArray)
                            console.log(jobArray)
        
                        })
                        .catch(error => {
                            throw(error);
                        })
                        })
                        jobArray.push(job)
                        idArray.push(change.fullDocument._id.toString())
                        console.log(idArray)
                        console.log(jobArray)
                        job.start()
                }else if(change.operationType=='delete'){
                    const id = change.documentKey._id.toString()

                    if(jobArray[idArray.findIndex(e=>e==id)]){
                        jobArray[idArray.findIndex(e=>e==id)].stop()
                        jobArray.splice(idArray.findIndex(e=>e==id),1)
                        idArray.splice(idArray.findIndex(e=>e==id),1)
                        console.log(idArray)
                        console.log(jobArray)
                    }
                }
            
                
        })


 

}

async function mulCron(){
    const users =  await userModel.find({});
    for(let user of users){

      cron(user.adaUsername, user.adaPassword, user.userid)
    }

  }


export default mulCron
