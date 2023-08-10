import mongoose, { Query } from 'mongoose';
import UserHandler from '../UserHandler';
import User from '../../models/User';

jest.mock('../../models/User'); 

describe('UserHandler Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a user by email', async () => {
    const mockFindOne = jest.spyOn(User, 'findOne') as jest.MockedFunction<typeof User.findOne>;
    mockFindOne.mockReturnValue({ lean: jest.fn().mockReturnValue('mockedUser') } as unknown as Query<any, any, {}>);

    const result = await UserHandler.findUserByEmail('test@example.com');

    expect(result).toEqual('mockedUser');
    expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('should create a user', async () => {
    const mockSave = jest.fn().mockResolvedValue('createdUser');
    jest.spyOn(User.prototype, 'save').mockImplementation(mockSave);

    const result = await UserHandler.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
    });

    expect(result).toEqual('createdUser');
    expect(mockSave).toHaveBeenCalled();
  });

  it('should set access token for a user', async () => {
    const mockUpdateOne = jest.spyOn(User, 'updateOne');
    mockUpdateOne.mockResolvedValue({ nModified: 1 } as any); 
    const userId = new mongoose.Types.ObjectId();

    await UserHandler.setAccessToken(userId.toJSON(), 'accessToken', 'refreshToken');

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: userId },
      { accessToken: 'accessToken', refreshToken: 'refreshToken' }
    );
  });

  it('should get an authenticated user', async () => {
    const mockFindOne = jest.spyOn(User, 'findOne');
    mockFindOne.mockReturnValue({ lean: jest.fn().mockReturnValue('mockedUser') } as unknown as Query<any, any, {}>);
    const userId = new mongoose.Types.ObjectId();

    const result = await UserHandler.getAuthenticateUser(userId.toJSON(), 'test@example.com', 'authToken');

    expect(result).toEqual('mockedUser');
    expect(mockFindOne).toHaveBeenCalledWith({
      email: 'test@example.com',
      _id: userId,
      accessToken: 'authToken',
    });
  });

  it('should set password for a user', async () => {
    const mockUpdateOne = jest.spyOn(User, 'updateOne');
    mockUpdateOne.mockResolvedValue({ nModified: 1 } as any); 
    const userId = new mongoose.Types.ObjectId();

    await UserHandler.setUserPassword(userId.toJSON(), 'newPassword');

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: userId },
      { password: 'newPassword' }
    );
  });

  
});
