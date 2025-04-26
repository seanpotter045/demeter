const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const newUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    dateOfCreation: {
      type: Date,
      default: Date.now,
    },
    savedLocations: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Location'
    }],
  },
  { collection: "users" }
);

// ✅ Hash the password before saving
newUserSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// ✅ Method to compare passwords
newUserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', newUserSchema);
