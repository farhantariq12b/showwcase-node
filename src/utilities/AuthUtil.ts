import { ErrorCodes, UserConstants } from "../constants";
import { Exception, Validators, bcrypt } from "../helpers";
import { LoginRequestBody, SignUpRequestBody, User } from "../interfaces/Auth";


class AuthUtil {

  static validateUser (user: User) {

    if (!user) {

      console.log(`validateUser:: User does not exist. user:: `, user);

      throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.UNAUTHORIZED, true);

    }

  }

  static validateSignUpRequest(data: SignUpRequestBody) {

    if (!data || !data.email) {

      console.log(`validateSignUpRequest:: Invalid data to sign up user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_SIGNUP_USER, ErrorCodes.BAD_REQUEST, true);

    }

    if (data.email && !Validators.isValidateEmail(data.email)) {

      console.log(`validateSignUpRequest:: Email is not valid. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.BAD_REQUEST, true);

    }


    if (!Validators.isValidStr(data.password)) {

      console.log(`validateSignUpRequest:: Password is not valid. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_PASSWORD, ErrorCodes.BAD_REQUEST, true);

    }

  }

  static async createHashedPassword (password: string) {

    password = await bcrypt.hash(password, 10);

    return password;

  }

  static validateUserForSignUp (user: User) {

    if (user) {

      console.log(`validateUserForSignUp:: User already exist against this email user:: `, user);

      throw new Exception(UserConstants.MESSAGES.USER_ALREADY_REGISTERED, ErrorCodes.BAD_REQUEST, true);

    }

  }

  static validateUserToAuthenticate (user: User) {

    if (!user) {

      console.log(`validateUserToAuthenticate:: User does not exist. user:: `, user);

      throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.BAD_REQUEST, true);

    }

  }



  static validateLoginRequest (data: LoginRequestBody) {

    if (!data || (!data.email)) {

      console.log(`validateLoginRequest:: Invalid data to login user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_LOGIN, ErrorCodes.UNAUTHORIZED, true);

    }

    if (data.email && !Validators.isValidateEmail(data.email)) {

      console.log(`validateLoginRequest:: Invalid email to login user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.UNAUTHORIZED, true);

    }

    if (!Validators.isValidStr(data.password)) {

      console.log(`validateLoginRequest:: Invalid password to login user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_PASSWORD, ErrorCodes.UNAUTHORIZED, true);

    }

  }


}

export default AuthUtil;
