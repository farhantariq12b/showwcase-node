import { Request, Response } from 'express';
import AuthManager from './UserManager';
import { Validators } from '../../helpers';
import { ErrorCodes, UserConstants } from '../../constants';
import { Exception } from '../../interfaces/Exception';
import { RandomUser } from '../../interfaces/User';

class UserController {

  static async getRandomUser(req: Request, res: Response) {
    try {
      const response = await AuthManager.getRandomUser();

      const users = response.results as RandomUser[]; 

      res.json({
        success: true,
        data: users.find((user: RandomUser) => user)
      });
    } catch (err) {
      const error = err as Exception;

      console.log(`login:: Request to login user failed. data:: `, req.body, err);

      return res
        .status(Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: error.reportError ? error.message : UserConstants.MESSAGES.LOGIN_FAILED,
        });
    }
  }
}

export default UserController;
