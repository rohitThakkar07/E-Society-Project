import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    full_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
})

const usersModel = mongoose.model('Users',UserSchema);
