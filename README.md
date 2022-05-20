# MongoDB + NodeJS + ExpressJs + MQTT adafruit
## User APIs

### Get all users(Get)
&emsp; http://localhost:8081/users

### Get user by id(Get)
&emsp; http://localhost:8081/user?userid=2222

### Add new user(Post)
&emsp; http://localhost:8081/user

```
{
      "userid":"33333",
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
```

### Add history by user(Patch)
&emsp; http://localhost:8081/user/history/:userid

```
  {
    "time":"15234324324",
    "notification": "nóng quá trời nè"
  }
```

### Update lower bound temp
&emsp; http://localhost:8081/user/lowertemp/:userid

```
{
    "value":"10"
}
```

### Update upper bound temp
&emsp; http://localhost:8081/user/uppertemp/:userid

```
{
    "value":"10"
}
```

### Update lower bound humid
&emsp; http://localhost:8081/user/lowerhumid/:userid

```
{
    "value":"10"
}
```

### Update upper bound humid
&emsp; http://localhost:8081/user/upperhumid/:userid

```
{
    "value":"10"
}
```


## Routine

### Get all routines(Get)
&emsp; http://localhost:8081/routines

### Get routine by id(Get)
&emsp; http://localhost:8081/routine/:id

### Add new routine(Post)
&emsp; http://localhost:8081/routine

```
{
        "userid":"22222",
        "time": 1651543154486,
        "device": "pump",
        "status": "ON"
}
```

### Delete routine(Delete)
&emsp; http://localhost:8081/routine/:id

## User interface github link
https://github.com/datphamcode295/happyfarm.git

Note: add file .env: MONGODBLINK = 'mongodb+srv://datbk:123456789dat@cluster0.punaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' before running

  
  

