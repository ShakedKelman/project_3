// import fs from 'fs';
// import path from 'path';
// import { deleteImage } from '../src/utils/helpers';

// // Mock fs.unlink to avoid actual file system changes
// jest.mock('fs', () => ({
//     ...jest.requireActual('fs'),
//     unlink: jest.fn(),
//     existsSync: jest.fn(),
// }));

// describe('deleteImage', () => {
//     const mockPath = path.join(appConfig.vacationsImagesPrefix, 'test-image.webp');

//     beforeEach(() => {
//         // Reset the mock functions before each test
//         jest.resetAllMocks();
//     });

//     it('should delete the image file if it exists', async () => {
//         const unlinkMock = jest.spyOn(fs, 'unlink').mockImplementation((path, callback) => callback(null));
//         (fs.existsSync as jest.Mock).mockReturnValue(true);
        
//         await deleteImage(mockPath);
        
//         expect(unlinkMock).toHaveBeenCalledWith(mockPath, expect.any(Function));
//         unlinkMock.mockRestore();
//     });

//     it('should not attempt to delete the file if it does not exist', async () => {
//         (fs.existsSync as jest.Mock).mockReturnValue(false);
//         const unlinkMock = jest.spyOn(fs, 'unlink');
        
//         await deleteImage(mockPath);
        
//         expect(unlinkMock).not.toHaveBeenCalled();
//         unlinkMock.mockRestore();
//     });

//     it('should handle errors during file deletion', async () => {
//         const unlinkMock = jest.spyOn(fs, 'unlink').mockImplementation((path, callback) => callback(new Error('Delete error')));
//         (fs.existsSync as jest.Mock).mockReturnValue(true);
        
//         await expect(deleteImage(mockPath)).rejects.toThrow('Failed to delete image at');
//         unlinkMock.mockRestore();
//     });
// });
