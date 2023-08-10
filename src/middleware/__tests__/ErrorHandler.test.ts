import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../../middleware/ErrorHandler'; 

describe('ErrorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnValue({ send: jest.fn() }) as jest.Mock,
    };
    mockNextFunction = jest.fn();
  });

  it('should handle an exception and send an error response', () => {
    const mockError = new Error('Test error');
    const mockStatusCode = 400;

    (mockError as any).status = mockStatusCode;

    ErrorHandler.handleException(mockError, mockRequest as Request, mockResponse as Response, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(mockStatusCode);
    expect((mockResponse as Response).status(mockStatusCode)?.send).toHaveBeenCalledWith({ error: mockError.message });
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

  it('should handle an exception without a specific status and send a 500 error response', () => {
    const mockError = new Error('Test error');

    ErrorHandler.handleException(mockError, mockRequest as Request, mockResponse as Response, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect((mockResponse as Response).status(500)?.send).toHaveBeenCalledWith({ error: mockError.message });
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

});
