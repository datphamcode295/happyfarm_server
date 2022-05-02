import Cron from 'cron'
import fetch from "node-fetch"
import routineModel from '../models/Routine.js'
import dotenv from 'dotenv'

const CronJob = Cron.CronJob
const dotenvv = dotenv.config()

function cron(){
    let username = "vandat2000";
    let key = dotenvv.parsed.ADAFRUIT_PASSWORD
    const userid = '22222'
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
                // chua xu li delete khi hoan thanh request
                
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
                    // console.log(res)
                    job.stop()
                    const id = res[i]._id
                    jobArray.splice(idArray.findIndex(e=>e==id),1)
                    idArray.splice(idArray.findIndex(e=>e==id),1)
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
        //         console.log(change)
        
                if(change.operationType == 'insert'){
                    const x = new Date(change.fullDocument.time)
            
                    let time = x.getSeconds() + " " + x.getMinutes() + " " + x.getHours() + " " + x.getDate() + " " + x.getMonth() + " *"
                    console.log(time)
                    const job = new CronJob(time, function() {
                        // chua xu li khi request qua han
                        // chua xu li delete khi hoan thanh request
                        
                        console.log('Cron ','running...', time, change.fullDocument.device)
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
                }
        })

    


//     const time1 = "* * * " +"* * *"
//     const time2 = '* * * * * *'
//     const time = []
//     const device=['pump', 'light']
//     time.push(time1)
//     time.push(time2)
//     for(let i =0; i<time.length;i++){
//         const job = new CronJob(time[i], function() {
//             // fetch(`https://io.adafruit.com/api/v2/${username}/feeds/fan/data?X-AIO-Key=${key}`, {
//             // method: 'POST',
//             // headers: {
//             //     'Accept': 'application/json',
//             //     'Content-Type': 'application/json'
//             // },
//             // body: JSON.stringify({datum:{value:"ON"}})
//             // }).then(res=>res.json())
//             // .then(console.log);
//             console.log('Cron '+i+' here...',Math.random())
//             // jobArray.splice(jobArray.findIndex(e=>e===job),1)
//             // console.log(jobArray)
//             // job.stop()
//         })
//         jobArray.push(job)
//         }

//         for(let i=0;i<jobArray.length;i++){
//             jobArray[i].start()
//         }

//         /*
//         const job2 = new CronJob(, function(){
//             console.log('Cron2 here...',Math.random())

//         })
//         jobArray.push(job2)
//         const job = new CronJob(time, function() {
//             // fetch(`https://io.adafruit.com/api/v2/${username}/feeds/fan/data?X-AIO-Key=${key}`, {
//             // method: 'POST',
//             // headers: {
//             //     'Accept': 'application/json',
//             //     'Content-Type': 'application/json'
//             // },
//             // body: JSON.stringify({datum:{value:"ON"}})
//             // }).then(res=>res.json())
//             // .then(console.log);
//             console.log('Cron1 here...',Math.random())
//             jobArray.splice(jobArray.findIndex(e=>e===job),1)
//             console.log(jobArray)
//             job.stop()
//         })
        
//         jobArray.push(job)
//         console.log('Cron running...',Date())
//         // Use this if the 4th param is default value(false)
//         job.start()
//         job2.start()
//         // console.log(typeof(job.start))
//         // job()*/
 

}

// module.exports =  {cron}
export default cron
