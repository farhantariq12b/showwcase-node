import express from 'express';
import AuthController from '../app/auth/AuthController';
import { Authentication } from '../middleware';
import { UserRequest } from '../interfaces/Auth';
const PREFIX = "/auth"
const router = express.Router();

router.post(`${PREFIX}/login`, AuthController.login);
router.post(`${PREFIX}/register`, AuthController.signup);
router.get(`${PREFIX}/profile`, Authentication.authenticate, (req, res) => AuthController.getUserDetails(req as UserRequest, res));

export default router;
