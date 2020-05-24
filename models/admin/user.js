const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { addIdField, filterByProps } = require('../../helpers/helpers');

const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    superadmin: {
      type: Boolean,
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
adminUserSchema.statics = {
  get: function ({ search, count, skip, sort, order }) {
    return AdminUser.find({ email: new RegExp('^' + search, 'i') })
      .sort({ [sort]: order })
      .limit(count)
      .skip(skip)
      .lean()
      .then(async res => {
        res = addIdField(res);
        res = filterByProps(res, [
          '_id',
          'id',
          'email',
          'createdAt',
          'updatedAt',
        ]);
        const total = await AdminUser.countDocuments({
          email: new RegExp('^' + search, 'i'),
        });

        return { data: res, total };
      });
  },
  getUser: async function ({ id }) {
    let product = await AdminUser.findById(id);
    return filterByProps(addIdField(product._doc), [
      '_id',
      'id',
      'email',
      'createdAt',
      'updatedAt',
    ]);
  },
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;
