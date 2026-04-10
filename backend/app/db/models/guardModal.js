const mongoose = require('mongoose');

const guardSchema = new mongoose.Schema({
  //  Changed fullName to name to match User and Resident models
  name: {
    type: String,
    required: [true, 'Name is required'],
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
  email: {
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
  guardId: { // This is your internal ID (e.g., G-101)
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
  idProofType: { // Renamed for consistency with Resident model
    type: String,
    required: [true, 'ID type is required'],
    enum: ['Aadhar Card', 'PAN Card', 'Voter ID'],
    default: 'Aadhar Card'
  },
  idProofNumber: { // Renamed for consistency
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
  },
  // ADDED: Role for reference logic
  role: {
    type: String,
    default: 'guard'
  },
  monthlySalary: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

const Guard = mongoose.model('Guard', guardSchema);
module.exports = Guard;