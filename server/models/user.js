const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    email:{
        type:String,
        required:"This field is required"
    },
    pass:{
        type:String,
        required:"This field is required"
    },
    name:{
        type:String,
        required:'This field is required'
    }
});

module.exports=mongoose.model("y", categorySchema,"user");
