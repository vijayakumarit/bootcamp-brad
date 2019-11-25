const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

CourseSchema.statics.GetAverageCost = async function (bootcampId){

  const obj = await this.aggregate([
    {
      $match:{bootcamp:bootcampId}
    },
    {
      $group:{
        _id:'$bootcamp',
        averageCost:{ $avg:'$tuition'}
      }
    }
  ])

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }

}



//after save the value calculate the average cost
CourseSchema.post('save',function(){
this.constructor.GetAverageCost(this.bootcamp);
})


//Before remove the value calculate the average cost
CourseSchema.pre('remove',function(){

  this.constructor.GetAverageCost(this.bootcamp);

})
module.exports = mongoose.model('Course', CourseSchema);