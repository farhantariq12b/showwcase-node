import { ErrorCodes, UserConstants } from "../../constants";
import UserHandler from "../../handlers/UserHandler";
import { Exception, Token, Validators, bcrypt } from "../../helpers";
import { LoginRequestBody, SignUpRequestBody, User } from "../../interfaces/Auth";
import AuthUtil from "../../utilities/AuthUtil";


class AuthManager {

  static async signup(data: SignUpRequestBody) {

    console.log(`signup:: Request to signup user. data:: `, data);

    AuthUtil.validateSignUpRequest(data);

    let user;

    if (!Validators.isValidateEmail(data.email)) {
      throw new Exception(UserConstants.MESSAGES.INVALID_EMAIL, 400, true);
    }

    user = await UserHandler.findUserByEmail(data.email);

    AuthUtil.validateUserForSignUp(user)

    const createdUser: User = await UserHandler.createUser(data);

    const password = await AuthUtil.createHashedPassword(data.password || '');

    await UserHandler.setUserPassword(createdUser._id || '', password);

    console.log(`signup:: User successfully signed up. data:: `, createdUser);

    const { accessToken, refreshToken } = await AuthManager.setAccessToken(createdUser);

    return { ...data, _id: createdUser._id, password, accessToken, refreshToken };

  }

  static async login(data: LoginRequestBody) {

    console.log(`login:: Request to login user. data:: `, data);

    let user;

    AuthUtil.validateLoginRequest(data);

    if (Validators.isValidateEmail(data.email)) {

      user = await UserHandler.findUserByEmail(data.email);

    }

    AuthUtil.validateUserToAuthenticate(user);

    const passwordMatched = await bcrypt.compare(data.password || '', user.password);

    if (!passwordMatched) {

      console.log(`login:: Password does not match. users:: ${JSON.stringify(user)} data:: `, data);

      throw new Exception(UserConstants.MESSAGES.PASSWORD_DOES_NOT_MATCH, ErrorCodes.UNAUTHORIZED, true);

    }

    console.log(`login:: User successfully login. data:: `, data);

    const { accessToken, refreshToken } = await AuthManager.setAccessToken(user);

    return { ...user, accessToken, refreshToken };

  }

  static async setAccessToken(user: User) {
    if (!user._id) return user;

    console.log(`setAccessToken:: Setting access token of user. user:: `, user);

    const accessToken = Token.getLoginToken(user);

    const refreshToken = Token.getRefreshToken(user);

    await UserHandler.setAccessToken(user._id, accessToken, refreshToken);

    console.log(`setAccessToken:: access token of user successfully set. user:: `, user);

    return { ...user, accessToken, refreshToken };

  }

  static async getUserDetails(email: string) {
    const user = await UserHandler.findUserByEmail(email);

    delete user.accessToken;
    delete user.refreshToken;
    delete user.password;

    return user;
  }

}

export default AuthManager;