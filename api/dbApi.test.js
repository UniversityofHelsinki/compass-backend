const dbService = require('../services/dbService');
const { saveAnswer } = require('../api/dbApi');
const messageKeys = require('../utils/message-keys');

jest.mock('../services/dbService');

describe('dbApi.saveAnswer', () => {
    const mockReq = {
        body: { id: '', assignmentid: 1, userid: 'mansikka', courseid: 'A1234', value: 'fwefwe', order_nbr: '4' },
        user: { eppn: 'mansikka' }
    };
    const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    let consoleErrorSpy;

    beforeAll(() => {
        // Mock console.error to suppress console output in tests
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        // Restore console.error after all tests
        consoleErrorSpy.mockRestore();
    });

    it('should respond with JSON on success', async () => {
        const mockResponse = {"message":"answer-saved"};
        dbService.saveAnswer.mockResolvedValue(mockResponse);

        await saveAnswer(mockReq, mockRes);

        expect(dbService.saveAnswer).toHaveBeenCalledWith(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should respond with error message on failure', async () => {
        const mockError = new Error('Failed to save');
        dbService.saveAnswer.mockRejectedValue(mockError);

        await saveAnswer(mockReq, mockRes);

        expect(dbService.saveAnswer).toHaveBeenCalledWith(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith([{ message: messageKeys.ERROR_MESSAGE_FAILED_TO_SAVE_ANSWER }]);
        expect(console.error).toHaveBeenCalledWith(`Error POST /saveAnswer ${mockError} USER ${mockReq.user.eppn}`);
    });
});
