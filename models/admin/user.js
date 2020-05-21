const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

adminUserSchema
  .virtual('password')
  .set(function (password) {
    this.password_hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  })
  .get(function () {
    return this.password_hash;
  });

adminUserSchema.methods = {
  comparePassword: function (password) {
    return bcrypt.compareSync(password, this.password_hash);
  },
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;
