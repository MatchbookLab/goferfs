import { Gofer } from './.';

describe('Gofer', () => {
  let warnSpy: jest.SpyInstance;

  beforeAll(() => {
    warnSpy = jest.spyOn(console, 'warn');
    warnSpy.mockImplementation(() => {});
  });

  beforeEach(() => {
    warnSpy.mockClear();
  });

  describe('versionCheck', () => {
    it('should enforce "<major>.<minor>"', () => {
      expect(() => Gofer.versionCheck('1.2.3', '1.2.3')).toThrowError(`Adapter's target version must be in the form for "<major>.<minor>"`);
    });

    it('should throw an error if Adapter major version is newer', () => {
      expect(() => Gofer.versionCheck('2.2', '1.1.1')).toThrowError(/Please upgrade your version of "goferfs"/);
    });

    it('should throw an error if Adapter major version is older', () => {
      expect(() => Gofer.versionCheck('0.6', '1.2.3')).toThrowError(/Please upgrade your adapter to match/);
    });

    it('should only warn if target minor is too high', () => {
      Gofer.versionCheck('1.3', '1.2.3');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching('The adapter may have some extra features that may not be available'));
    });

    it('should only warn if target minor is too low', () => {
      Gofer.versionCheck('1.1', '1.2.3');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching('Some features may not be available'));
    });

    it('should do nothing if versions are compatible', () => {
      Gofer.versionCheck('1.0', '1.0.2');
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should work with pre-release versions', () => {
      Gofer.versionCheck('1.0', '1.0.0-0.beta');
      expect(warnSpy).not.toHaveBeenCalled();
    });

    test('clean path cleans path', () => {
      expect(Gofer.cleanPath('path/to/file.txt')).toEqual('path/to/file.txt');
      expect(Gofer.cleanPath('/path/to/file.txt')).toEqual('path/to/file.txt');
      expect(Gofer.cleanPath('./path/to/file.txt')).toEqual('path/to/file.txt');
    });

    test('clean path handles root', () => {
      expect(Gofer.cleanPath('')).toEqual('');
      expect(Gofer.cleanPath('/')).toEqual('');
      expect(Gofer.cleanPath('./')).toEqual('');
    });
  });
});
