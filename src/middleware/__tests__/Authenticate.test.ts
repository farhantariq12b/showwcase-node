import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedUser, User, UserRequest } from '../../interfaces/Auth';
import UserHandler from '../../handlers/UserHandler';
import Authentication from '../Authentication';
import { ErrorCodes, UserConstants } from '../../constants';

jest.mock('jsonwebtoken');
jest.mock('../../handlers/UserHandler');

describe('Authentication Middleware', () => {
  const mockRequest = {} as UserRequest;
  const mockResponse = {} as Response;

  const mockNextFunction = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.headers = {};
    mockResponse.status = jest.fn().mockReturnValue(mockResponse);
    mockResponse.json = jest.fn();
  
    mockRequest.user = undefined;

  });

  it('should call next function if authentication is successful', async () => {
    const mockToken = 'mockToken';
    const mockDecoded: DecodedUser = { _id: 'userId', email: 'user@example.com' };
    const mockUser: DecodedUser = { _id: 'userId', email: 'user@example.com' };

    (mockRequest.headers.authorization as string) = `Bearer ${mockToken}`;
    (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);
    (UserHandler.getAuthenticateUser as jest.Mock).mockResolvedValue(mockUser);

    await Authentication.authenticate(mockRequest, mockResponse, mockNextFunction);

    expect(UserHandler.getAuthenticateUser).toHaveBeenCalledWith(
      mockDecoded._id,
      mockDecoded.email,
      mockToken
    );
    expect(mockRequest.user).toEqual(mockUser);
    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    (mockRequest.headers.authorization as string) = 'InvalidToken';
    const mockResponseStatus = jest.fn(() => mockResponse);
    mockResponse.status = mockResponseStatus;

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await Authentication.authenticate(mockRequest, mockResponse, mockNextFunction);

    expect(UserHandler.getAuthenticateUser).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
    expect(mockResponseStatus).toHaveBeenCalledWith(ErrorCodes.UNAUTHORIZED);
    expect(mockResponseStatus().json).toHaveBeenCalledWith({
      message: UserConstants.MESSAGES.INVALID_AUTHENTICATION_TOKEN
    });
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not found', async () => {
    const mockToken = 'mockToken';
    const mockDecoded: DecodedUser = { _id: 'userId', email: 'user@example.com' };

    (mockRequest.headers.authorization as string) = `Bearer ${mockToken}`;
    (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);
    (UserHandler.getAuthenticateUser as jest.Mock).mockResolvedValue(null);

    const mockResponseStatus = jest.fn(() => mockResponse);
    mockResponse.status = mockResponseStatus;

    await Authentication.authenticate(mockRequest, mockResponse, mockNextFunction);

    expect(UserHandler.getAuthenticateUser).toHaveBeenCalledWith(
      mockDecoded._id,
      mockDecoded.email,
      mockToken
    );
    expect(mockRequest.user).toBeUndefined();
    expect(mockResponseStatus).toHaveBeenCalledWith(ErrorCodes.UNAUTHORIZED);
    expect(mockResponseStatus().json).toHaveBeenCalledWith({
      message: UserConstants.MESSAGES.INVALID_AUTHENTICATION_TOKEN
    });
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

});
