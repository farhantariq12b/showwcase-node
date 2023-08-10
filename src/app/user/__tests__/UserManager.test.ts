import axios from 'axios';
import ApiClient from '../../../services/ThirdPartyService';

jest.mock('axios');

describe('ApiClient Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should perform a GET request successfully', async () => {
    const mockData = { success: true };
    const mockAxiosGet = axios.get as jest.Mock;
    mockAxiosGet.mockResolvedValue({ data: mockData });

    const result = await ApiClient.get<any>('https://example.com/api', {});

    expect(result).toEqual(mockData);
    expect(mockAxiosGet).toHaveBeenCalledWith('https://example.com/api', { params: {} });
  });

  it('should handle GET request failure', async () => {
    const mockError = new Error('Request failed');
    const mockAxiosGet = axios.get as jest.Mock;
    mockAxiosGet.mockRejectedValue(mockError);

    await expect(ApiClient.get('https://example.com/api', {})).rejects.toThrowError(mockError);

    expect(mockAxiosGet).toHaveBeenCalledWith('https://example.com/api', { params: {} });
  });
});
