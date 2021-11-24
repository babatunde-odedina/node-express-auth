import express from 'express';
import {
  SIGNUP_GET,
  SIGNUP_POST,
  LOGIN_GET,
  LOGIN_POST,
  LOGOUT_GET,
} from '../controllers/authControllers.js';

const router = express.Router();

router.get('/signup', SIGNUP_GET);
router.post('/signup', SIGNUP_POST);
router.get('/login', LOGIN_GET);
router.post('/login', LOGIN_POST);
router.get('/logout', LOGOUT_GET);

export default router;
