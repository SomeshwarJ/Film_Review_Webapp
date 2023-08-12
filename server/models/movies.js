const mongoose=require('mongoose');

const mSchema=new mongoose.Schema({
    name:{
        type:String,
        required: 'This field is required'
    },
    genere:{
        type: String,
        required: 'This field is required'
    },
    des:{
        type:String,
        required: 'This field is required'
    },
    cast:{
        type:[String],
        required: 'This field is required'
    },
    img:{
        type: String,
        required: 'This field is required'
    },
});

mSchema.index({name:'text', des:'text', cast:'text'});
module.exports=mongoose.model("u", mSchema,"movies");