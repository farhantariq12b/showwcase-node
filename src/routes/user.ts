import express from 'express';
import { Authentication } from '../middleware';
import UserController from '../app/user/UserController';
const PREFIX = "/users"
const router = express.Router();

router.get(`${PREFIX}/random`, Authentication.authenticate, UserController.getRandomUser);

export default router;
