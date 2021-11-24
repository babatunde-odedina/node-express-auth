import User from '../models/user.js';
import jwt from 'jsonwebtoken';

// handle errors
const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { firstName: '', lastName: '', email: '', password: '' };

  // incorrect email address
  if (err.message === 'incorrect email') {
    errors.email = 'email not registered';
  }
  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'password incorrect';
  }
  // duplication errors
  if (err.code === 11000) {
    errors.email = 'email already exists';
    return errors;
  }
  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// create auth
const maxAge = 3 * 24 * 60 * 60;
const createAuthToken = (id) => {
  return jwt.sign({ id }, 'the jason web tokens secrets', {
    expiresIn: maxAge,
  });
};

// controller functions
export const SIGNUP_GET = (req, res) => {
  res.render('signup');
};

export const LOGIN_GET = (req, res) => {
  res.render('login');
};

export const SIGNUP_POST = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(firstName, lastName, email, password);

  try {
    const user = await User.create({ firstName, lastName, email, password });
    const token = createAuthToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
    console.log(errors);
  }
};

export const LOGIN_POST = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createAuthToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
    console.log(errors);
  }
};

export const LOGOUT_GET = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
