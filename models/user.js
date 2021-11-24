import mongoose from 'mongoose';
import pkg from 'validator';
import bcrypt from 'bcrypt';

const { isEmail } = pkg;

const userSchema = new mongoose.Schema({
  firstName: {
    type: 'string',
    required: [true, 'please enter first name'],
    lowercase: true,
    unique: false,
  },
  lastName: {
    type: 'string',
    required: [true, 'please enter last name'],
    lowercase: true,
    unique: false,
  },
  email: {
    type: 'string',
    required: [true, 'please enter email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'please enter a valid email'],
  },
  password: {
    type: 'string',
    required: [true, 'please enter password'],
    minlength: [6, 'Minimum length of password is 6 characters'],
  },
});

// fire a function after doc save to db
// userSchema.post('save', function (doc, next) {
//   console.log('new user created and saved', doc);
//   next();
// });

// fire a function before doc save to db
// hash the password
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error(`incorrect email`);
};

const User = mongoose.model('user', userSchema);

export default User;
