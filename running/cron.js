import Cron from 'cron'
import fetch from "node-fetch"

const CronJob = Cron.CronJob
const cron = ()=>{
    
    let username = "vandat2000";
    let key = "aio_wDVH64hjfRvSnizfd4nqAY1D0W7m"
    const job = new CronJob('00 56 21 * * *', function() {
        fetch(`https://io.adafruit.com/api/v2/${username}/feeds/fan/data?X-AIO-Key=${key}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({datum:{value:"ON"}})
        }).then(res=>res.json())
        .then(console.log);
    })
    console.log('Cron running...',Date())
    // Use this if the 4th param is default value(false)
    job.start()
    // console.log(typeof(job.start))
    // job()
}

// module.exports =  {cron}
export default cron
