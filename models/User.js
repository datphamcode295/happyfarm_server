import mongoose from 'mongoose'

const Routine1Schema = new mongoose.Schema({
    starttime: {
        type: Number
      },
    endtime: {
        type: Number
    },
    divice: {
        type: String
    },
})

const Routine2Schema = new mongoose.Schema({
    time: {
        type: Number
      },
    divice: {
        type: String
    },
    status:{
        type: String
    }
})

const HistorySchema = new mongoose.Schema({
    time: {
        type: Number
      },
    notification: {
        type: String
    },
})

const UserSchema = new mongoose.Schema({
    userid: {
      type: String
    },
    lowerboundtemp: {
      type: Number
    },
    upperboundtemp: {
      type: Number
    },
    lowerboundhumid: {
      type: Number
    },
    upperboundhumid: {
      type: Number
    },
    adaUsername:{
      type: String
    },
    adaPassword: {
      type: String
    },
    routine1:[Routine1Schema],
    routine2:[Routine2Schema],
    history:[HistorySchema]
  
});

//Declare Virtual Fields


//Custom Schema Methods
//1. Instance Method Declaration


//2. Static method declararion


//Writing Query Helpers



UserSchema.pre('save', (next) => {
  console.log("Before Save")
  // let now = Date.now()
   
  // this.updatedat = now
  // // Set a value for createdAt only if it is null
  // if (!this.created) {
  //   this.created = now
  // }
  
  // Call the next function in the pre-save chain
  next()
});

UserSchema.pre('findOneAndUpdate', (next) => {
  console.log("Before findOneAndUpdate")
  // let now = Date.now()
  // this.updatedat = now
  // console.log(this.updatedat)
  next()
});


UserSchema.post('init', (doc) => {
  console.log('%s has been initialized from the db', doc._id);
});

UserSchema.post('validate', (doc) => {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

UserSchema.post('save', (doc) => {
  console.log('%s has been saved', doc._id);
});

UserSchema.post('remove', (doc) => {
  console.log('%s has been removed', doc._id);
});

const userModel = mongoose.model("User", UserSchema);
// module.exports = User;
export default userModel