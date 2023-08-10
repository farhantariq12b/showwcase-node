import { config } from '../../../helpers';
import { RandomUserResponse } from '../../../interfaces/User';
import ApiClient from '../../../services/ThirdPartyService';
import UserManager from '../UserManager';

jest.mock('../../../services/ThirdPartyService');

const RANDOM_USER_API_URL = config.randomApiUrl

describe('UserManager Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get a random user successfully', async () => {
    const mockApiResponse: RandomUserResponse = {
      results: [
        {
          "gender": "female",
          "name": {
            "title": "Ms",
            "first": "Brittany",
            "last": "Reynolds"
          },
          "location": {
            "street": {
              "number": 5524,
              "name": "Victoria Road"
            },
            "city": "Nottingham",
            "state": "Dorset",
            "country": "United Kingdom",
            "postcode": "T22 7FF",
            "coordinates": {
              "latitude": "-9.0783",
              "longitude": "113.1034"
            },
            "timezone": {
              "offset": "+5:45",
              "description": "Kathmandu"
            }
          },
          "email": "brittany.reynolds@example.com",
          "login": {
            "uuid": "2ccb8e94-7629-49d1-8bd5-f1b117c0898e",
            "username": "goldenzebra166",
            "password": "starcraf",
            "salt": "AiJL2hGR",
            "md5": "d98a30e9d22c2043a88f9b03d2c543cf",
            "sha1": "2eeeadce3ebae1513cfd35dfcd4b626a84ea3422",
            "sha256": "c411660e2619642006e9c3fd25ff6445a9b4d8286443993150079ce8e6c739a7"
          },
          "dob": {
            "date": "1984-03-14T01:54:55.875Z",
            "age": 39
          },
          "registered": {
            "date": "2004-05-10T04:36:05.089Z",
            "age": 19
          },
          "phone": "015242 85901",
          "cell": "07925 721418",
          "id": {
            "name": "NINO",
            "value": "TB 49 32 48 W"
          },
          "picture": {
            "large": "https://randomuser.me/api/portraits/women/10.jpg",
            "medium": "https://randomuser.me/api/portraits/med/women/10.jpg",
            "thumbnail": "https://randomuser.me/api/portraits/thumb/women/10.jpg"
          },
          "nat": "GB"
        }
      ],
    };
    const mockApiClientGet = ApiClient.get as jest.Mock;
    mockApiClientGet.mockResolvedValue(mockApiResponse);

    const result = await UserManager.getRandomUser();

    expect(result).toEqual(mockApiResponse);
    expect(mockApiClientGet).toHaveBeenCalledWith(RANDOM_USER_API_URL, {});
  });

  it('should handle getRandomUser failure', async () => {
    const mockError = new Error('API error');
    const mockApiClientGet = ApiClient.get as jest.Mock;
    mockApiClientGet.mockRejectedValue(mockError);

    await expect(UserManager.getRandomUser()).rejects.toThrowError(mockError);

    expect(mockApiClientGet).toHaveBeenCalledWith(RANDOM_USER_API_URL, {});
  });
});
