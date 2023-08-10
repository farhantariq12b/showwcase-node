import mongoose from 'mongoose';
import { SignUpRequestBody, User } from '../../../interfaces/Auth';
import UserHandler from '../../../handlers/UserHandler';
import { AuthUtil } from '../../../utilities';
import AuthManager from '../AuthManager';
import { Exception, bcrypt } from '../../../helpers';

describe('AuthManager Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should call UserHandler.createUser with correct data', async () => {
    const data: SignUpRequestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
    };
    const userId = new mongoose.Types.ObjectId();

    const createdUser: User = {
      _id: userId.toJSON(),
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      accessToken: 'dummyToken',
      refreshToken: 'dummyToken',
    };

    console.log(createdUser, "created")
    UserHandler.findUserByEmail = jest.fn(() => Promise.resolve(null));
    UserHandler.createUser = jest.fn(() => Promise.resolve(createdUser));
    AuthUtil.createHashedPassword = jest.fn(() => Promise.resolve('hashedPassword'));
    AuthManager.setAccessToken = jest.fn(() =>
      Promise.resolve({
        ...createdUser,
        accessToken: 'dummyToken',
        refreshToken: 'dummyToken',
      })
    );

    const userHandlerSpy = {
      findUserByEmail: jest.spyOn(UserHandler, 'findUserByEmail').mockResolvedValue(null),
      createUser: jest.spyOn(UserHandler, 'createUser').mockResolvedValue(createdUser),
      setUserPassword: jest.spyOn(UserHandler, 'setUserPassword').mockResolvedValue({ nModified: 1 } as any),
    };

    (AuthUtil.createHashedPassword as jest.Mock).mockResolvedValue('hashedPassword');
    (AuthManager.setAccessToken as jest.Mock).mockResolvedValue({
      ...createdUser,
      accessToken: 'dummyToken',
      refreshToken: 'dummyToken',
    });

    const result = await AuthManager.signup(data);

    expect(result).toEqual({
      ...data,
      ...createdUser,
      password: 'hashedPassword',
    });
  }, 1000000);


  it('should handle signup error', async () => {
    const error = new Exception('Invalid data to sign up user', 400);

    const mockFindUserByEmail = jest.spyOn(UserHandler, 'findUserByEmail');
    mockFindUserByEmail.mockRejectedValue(error);

    await expect(AuthManager.signup({})).rejects.toThrowError(error);

    mockFindUserByEmail.mockRestore();
  });
  it('should login a user', async () => {
    const data = {
      email: 'test@example.com',
      password: 'password'
    };
    const user: User = {
      _id: (new mongoose.Types.ObjectId()).toJSON(),
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      accessToken: 'dummyToken',
      refreshToken: 'dummyToken'
    };

    const mockFindUserByEmail = jest.spyOn(UserHandler, 'findUserByEmail');
    mockFindUserByEmail.mockResolvedValue(user);

    const mockValidateLoginRequest = jest.spyOn(AuthUtil, 'validateLoginRequest');
    mockValidateLoginRequest.mockReturnValue();

    const mockCompare = jest.spyOn(bcrypt, 'compare');
    mockCompare.mockResolvedValue(true as never);

    const mockSetAccessToken = jest.spyOn(AuthManager, 'setAccessToken');
    mockSetAccessToken.mockResolvedValue({ ...user, accessToken: 'dummyToken', refreshToken: 'dummyToken' });

    const result = await AuthManager.login(data);

    expect(result).toEqual({ ...user, accessToken: 'dummyToken', refreshToken: 'dummyToken' });

    mockFindUserByEmail.mockRestore();
    mockValidateLoginRequest.mockRestore();
    mockSetAccessToken.mockRestore();
    mockCompare.mockRestore();
  });

  it('should handle login error', async () => {
    const error = new Exception('Invalid data to login', 401);

    const mockFindUserByEmail = jest.spyOn(UserHandler, 'findUserByEmail');
    mockFindUserByEmail.mockResolvedValue(null);

    await expect(AuthManager.login({})).rejects.toThrowError(error);

    mockFindUserByEmail.mockRestore();
  });

  it('should handle password mismatch during login', async () => {
    const data = {
      email: 'test@example.com',
      password: 'password'
    };
    const user: User = {
      _id: (new mongoose.Types.ObjectId()).toJSON(),
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      accessToken: 'dummyToken',
      refreshToken: 'dummyToken'
    };

    const mockFindUserByEmail = jest.spyOn(UserHandler, 'findUserByEmail');
    mockFindUserByEmail.mockResolvedValue(user);

    const mockValidateLoginRequest = jest.spyOn(AuthUtil, 'validateLoginRequest');
    mockValidateLoginRequest.mockReturnValue();

    const mockCompare = jest.spyOn(bcrypt, 'compare');
    mockCompare.mockResolvedValue(false as never);

    await expect(AuthManager.login(data)).rejects.toThrowError(new Exception('Invalid email or password'));

    mockFindUserByEmail.mockRestore();
    mockValidateLoginRequest.mockRestore();
    mockCompare.mockRestore();
  });

});
