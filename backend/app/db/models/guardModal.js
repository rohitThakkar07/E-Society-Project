const mongoose = require('mongoose');

const guardSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  alternativeNumber: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
    default: null
  },
  emailAddress: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    default: null
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  guardId: {
    type: String,
    required: [true, 'Guard ID is required'],
    unique: true,
    trim: true
  },
  shift: {
    type: String,
    required: [true, 'Shift is required'],
    enum: ['Day', 'Night', 'Rotating', 'Reliever'],
    default: 'Day'
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required'],
    default: Date.now
  },
  idType: {
    type: String,
    required: [true, 'ID type is required'],
    enum: ['Aadhar Card']
  },
  idNumber: {
    type: String,
    required: [true, 'ID number is required']
},
  idImage: {
    type: String, 
    required: false 
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  }
  
  /* --- COMMENTED OUT FIELDS --- */
  
  // contractor: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Contractor', 
  //   required: [true, 'Contractor reference is required']
  // }
  
}, {
  timestamps: true 
});

const Guard = mongoose.model('Guard', guardSchema);

module.exports = Guard;