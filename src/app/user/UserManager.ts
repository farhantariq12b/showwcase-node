import { config } from "../../helpers";
import { RandomUserResponse } from "../../interfaces/User";
import ApiClient from "../../services/ThirdPartyService";

const RANDOM_USER_API_URL = config.randomApiUrl;

class UserManager {
  static async getRandomUser(): Promise<RandomUserResponse> {
    const response = await ApiClient.get(RANDOM_USER_API_URL, {});

    return response as RandomUserResponse;
  }

}

export default UserManager;