import mongoose from "mongoose";
import { SignUpRequestBody } from "../interfaces/Auth";
import User from "../models/User";

class UserHandler {

  static findUserByEmail(email: string | undefined): Promise<any> {
    return User.findOne({ email }).lean()
  }

  static createUser(data: SignUpRequestBody): Promise<any> {
    const user = new User({
      ...data,
      _id: new mongoose.Types.ObjectId()
    })

    return user.save()
  }

  static setAccessToken(userId: string, accessToken: string, refreshToken: string) {

    return User.updateOne({
      _id: new mongoose.Types.ObjectId(userId)
    }, {
      accessToken,
      refreshToken,
    });
  }

  static getAuthenticateUser(userId: string, email = " ", authToken: string): Promise<any> {
    return User.findOne({
      email,
      _id: new mongoose.Types.ObjectId(userId),
      accessToken: authToken,
    }).lean()
  }

  static setUserPassword(userId: string, password: string) {

    return User.updateOne({ _id: new mongoose.Types.ObjectId(userId) }, { password })

  }

}

export default UserHandler;
