import { Request, Response } from 'express';
import AuthController from '../AuthController';
import AuthManager from '../AuthManager';
import { LoginRequestBody, UserRequest } from '../../../interfaces/Auth';
import { Exception } from '../../../helpers';
import { ErrorCodes, UserConstants } from '../../../constants';

jest.mock('../AuthManager'); 
jest.mock('../../../handlers/UserHandler'); 

describe('AuthController Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login a user successfully', async () => {
    const mockLogin = AuthManager.login as jest.Mock;
    const loginData = {
      email: 'test@example.com',
      password: 'password',
    };
    const userResponse = {
      _id: 'mockUserId',
      name: 'Test User',
      email: 'test@example.com',
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };
    mockLogin.mockResolvedValue(userResponse);

    const mockReq = { body: loginData } as Request<{}, {}, LoginRequestBody>;
    const mockRes = { json: jest.fn() } as unknown as Response;

    await AuthController.login(mockReq, mockRes);

    expect(mockLogin).toHaveBeenCalledWith(loginData);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: userResponse,
    });
  });

  it('should handle login failure', async () => {
    const mockLogin = AuthManager.login as jest.Mock;
    const mockError = new Exception('Login failed', 401);
    mockLogin.mockRejectedValue(mockError);

    const mockReq = { body: {} } as Request<{}, {}, LoginRequestBody>;
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await AuthController.login(mockReq, mockRes);

    expect(mockLogin).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(ErrorCodes.UNAUTHORIZED);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: UserConstants.MESSAGES.LOGIN_FAILED,
    });
  });

  it('should get user details successfully', async () => {
    const mockGetUserDetails = AuthManager.getUserDetails as jest.Mock;
    const userRequest = {
      user: {
        _id: 'mockUserId',
        name: 'Test User',
        email: 'test@example.com',
      },
    };
    const userDetails = 'test@example.com';

    mockGetUserDetails.mockResolvedValue(userDetails);

    const mockReq = userRequest as UserRequest;
    const mockRes = { json: jest.fn() } as unknown as Response;

    await AuthController.getUserDetails(mockReq, mockRes);

    expect(mockGetUserDetails).toHaveBeenCalledWith(userRequest.user.email || '');
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: userDetails,
    });
  });

  it('should handle getUserDetails failure', async () => {
    const mockGetUserDetails = AuthManager.getUserDetails as jest.Mock;
    const mockError = new Exception('Failed to get user details', 500);
    mockGetUserDetails.mockRejectedValue(mockError);

    const mockReq = {} as UserRequest;
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await AuthController.getUserDetails(mockReq, mockRes);

    expect(mockGetUserDetails).toHaveBeenCalledWith(mockReq.user || '');
    expect(mockRes.status).toHaveBeenCalledWith(ErrorCodes.INTERNAL_SERVER_ERROR);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: UserConstants.MESSAGES.LOGIN_FAILED,
    });
  });
});
