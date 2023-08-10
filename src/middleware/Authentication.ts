import { NextFunction, Request, Response } from "express";
import { User, UserRequest } from "../interfaces/Auth";
import { Exception, Validators, config, jwt } from "../helpers";
import { ErrorCodes, UserConstants } from "../constants";
import UserHandler from "../handlers/UserHandler";

class Authentication {

  static async authenticate(req: Request, res: Response, next: NextFunction) {

    try {
      const { authorization = '' } = req.headers;


      const tokenSplitted = Validators.isValidStr(authorization) ? authorization.split(' ') : null;

      if (!Array.isArray(tokenSplitted) || tokenSplitted.length < 1) {

        console.log(tokenSplitted?.length);

        console.log(`authenticate:: Token is invalid. token:: `, tokenSplitted);

        throw new Exception(UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED, ErrorCodes.CONFLICT_WITH_CURRENT_STATE, true);

      }

      const token = tokenSplitted[1];

      const decoded = jwt.verify(token, config.secretKey) as User;

      if (!decoded || !decoded._id || !decoded.email) {

        console.log(`authenticate:: Token is invalid or expired. token:: ${token} decoded:: `, decoded);

        throw new Exception(UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED, ErrorCodes.CONFLICT_WITH_CURRENT_STATE, true);

      }



      const user: User = await UserHandler.getAuthenticateUser(decoded._id, decoded.email, token);

      if (!user) {

        console.log(`authenticate:: Token is invalid, no user found. token:: ${token} decoded:: `, decoded);

        throw new Exception(UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED, ErrorCodes.CONFLICT_WITH_CURRENT_STATE, true);

      }

      (req as UserRequest).user = user;

      next();

    } catch (error) {

      return res.status(ErrorCodes.UNAUTHORIZED).json({
        message: UserConstants.MESSAGES.INVALID_AUTHENTICATION_TOKEN
      });

    }

  }

}

export default Authentication;
