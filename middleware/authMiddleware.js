import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// require authentication
export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if token exist and is valid
  if (token) {
    jwt.verify(token, 'the jason web tokens secrets', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
export const checkCurrentUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      'the jason web tokens secrets',
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.locals.user = null;
          next();
        } else {
          console.log(decodedToken);
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};
