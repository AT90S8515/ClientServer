const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const statuses = {
  PENDING: 'PENDING',
  ACTIVATED: 'ACTIVATED',
  DEACTIVATED: 'DEACTIVATED'
};

const schema = new mongoose.Schema({
  email: {
    index: true,
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: [validate({validator: 'isEmail'})]
  },
  name: {required: true, trim: true, type: String},
  password: {required: true, select: false, type: String},
  status: {default: statuses.ACTIVATED, enum: Object.values(statuses), required: true, type: String}, // TODO: Change default status to pending when mailer ready
  activationToken: {select: false, type: String},
  activationDate: {select: false, type: Date},
  deleted: {default: false, required: true, type: Boolean}
}, {timestamps: true});

// Schema helpers
schema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

schema.methods.comparePassword = async function (password) {
  if (!this.password || !password) {
    throw new Error('No password');
  }

  return await bcrypt.compare(password, this.password);
};

schema.methods.isActivated = function () {
  return this.status === statuses.ACTIVATED;
};

schema.methods.toJWT = function () {
  return {
    access_token: this.toToken(),
    expires_in: process.env.JWT_EXPIRES,
    token_type: 'bearer'
  }
};

schema.methods.toToken = function () {
  return jwt.sign({
    id: this._id,
    email: this.email,
    name: this.name
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

module.exports = mongoose.model('User', schema);
