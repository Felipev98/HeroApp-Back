
if (process.env.NODE_ENV === 'test' && !process.env.TEST_WITH_DB) {
  jest.mock('../config/database', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.resolve()),
  }));
}

