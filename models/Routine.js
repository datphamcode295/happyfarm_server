import mongoose from 'mongoose'

const RoutineSchema = new mongoose.Schema({
    userid:{
        type:String
    },
    time: {
        type: Number
    },
    device: {
        type: String
    },
    status:{
        type: String
    }
})






RoutineSchema.pre('save', (next) => {
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

RoutineSchema.pre('findOneAndUpdate', (next) => {
  console.log("Before findOneAndUpdate")
  // let now = Date.now()
  // this.updatedat = now
  // console.log(this.updatedat)
  next()
});


RoutineSchema.post('init', (doc) => {
  console.log('%s has been initialized from the db', doc._id);
});

RoutineSchema.post('validate', (doc) => {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

RoutineSchema.post('save', (doc) => {
  console.log('%s has been saved', doc._id);
});

RoutineSchema.post('remove', (doc) => {
  console.log('%s has been removed', doc._id);
});

const routineModel = mongoose.model("Routine", RoutineSchema);
// module.exports = User;
export default routineModel