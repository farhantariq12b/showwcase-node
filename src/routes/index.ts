import express from 'express';
import authRouter from './auth';
import userRouter from './user';
import { Authentication, ErrorHandler, RequestLogger } from '../middleware';

const router = express.Router();

router.use(ErrorHandler.handleException);
router.use(RequestLogger.log);

router.get('/', Authentication.authenticate, (req, res, next) => {
  res.send({ title: 'Show Case' });
});

router.use('/api', authRouter)
router.use('/api', userRouter)

export default router;
 