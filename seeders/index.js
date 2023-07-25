// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const Admin = require('../models/model.admin');

Admin.destroy({
  where: {},
  truncate: true,
});

const ADMINS = [
  {
    name: 'admin1',
    email: 'admin1@gmail.com',
    password: 'admin1',
  },
];

ADMINS.forEach(async (admin) => {
  try {
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    // eslint-disable-next-line no-param-reassign
    admin.password = await bcrypt.hash(admin.password, salt);
    const savedData = Admin.build(admin);
    await savedData.save();
  } catch (error) {
    console.log(error);
  }
});
