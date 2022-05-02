import Cron from 'cron'
import fetch from "node-fetch"
import routineModel from '../models/Routine.js'

const CronJob = Cron.CronJob


function cron(){
    let username = "vandat2000";
    let key = "aio_BeAO44q4M1PgbsmqsDVExuVVdeKU"
    const userid = '22222'
    let jobArray = []
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
                
                console.log('Cron ',i,'running...', time)
                fetch(`https://io.adafruit.com/api/v2/${username}/feeds/${res[i].device}/data?X-AIO-Key=${key}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({datum:{value:res[i].status}})
                })
                .then(res=>res.json())
                .then(res=>{
                    // console.log(res)
                    job.stop()
                })
                .catch(error => {
                    throw(error);
                })
                
                
                
            
            })
            job.start()
        }
    })
    .catch(error => {
        throw(error);
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
//     routineModel.watch([],{ fullDocument : "updateLookup" }).on('change', change =>{
//         console.log(change)
//         if(change.fullDocument.device == "light")
//             {
//                 console.log("vo ne")
//                 jobArray[0].stop()
//             }
// })

}

// module.exports =  {cron}
export default cron
