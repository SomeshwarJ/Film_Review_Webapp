const mongoose=require('mongoose');

const coSchema=new mongoose.Schema({
    email:{
        type: String,
        required: 'This field is required'
    },
    comment:{
        type: String,
        required: 'This field is required'
    },
    mid:{
        type: String,
        required: 'This field is required'
    }
});

module.exports=mongoose.model("w", coSchema,"comments");