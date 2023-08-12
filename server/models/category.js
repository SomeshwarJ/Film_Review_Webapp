const mongoose=require('mongoose');

const cSchema=new mongoose.Schema({
    genere:{
        type: String,
        required: 'This field is required'
    },
    img:{
        type: String,
        required: 'This field is required'
    },
});

module.exports=mongoose.model("z", cSchema,"categories");