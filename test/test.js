/*
eslint-disable 
  @typescript-eslint/no-var-requires,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/restrict-template-expressions
*/
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const fontscan = require('../dist/index');
const { FontDescriptor } = require('../dist/fontDescriptor');
const expected = require('./expected.json');

const isFontDescriptor = (fd) => {
  assert.ok(fs.existsSync(fd.path));
  assert.equal(typeof fd.path, 'string');
  assert.equal(typeof fd.postscriptName, 'string');
  assert.equal(typeof fd.family, 'string');
  assert.equal(typeof fd.width, 'number');
  assert.equal(typeof fd.weight, 'number');
  assert.equal(typeof fd.style, 'string');
  assert.equal(typeof fd.italic, 'boolean');
  assert.equal(typeof fd.monospace, 'boolean');
};

// todo: 各関数の型エラーチェックをする

/*
global
  describe: false
  it: false
*/
describe('FontDescriptor', function () {
  it('should have a static function', () => {
    assert.equal(typeof FontDescriptor.createFromPath, 'function');
  });
  it('should have a constructor', () => {
    assert.equal(typeof FontDescriptor.constructor, 'function');
  });

  describe('#createFromPath', function () {
    expected.fonts.map((fontdata) => {
      it(`should return correct status ${fontdata.name}`, () => {
        const fd = FontDescriptor.createFromPath(
          path.join('test', fontdata.path)
        );
        isFontDescriptor(fd);
        fontdata.path = path.join(__dirname, fontdata.path);
        assert.deepEqual(fd, fontdata);
      });
    });
  });
});

describe('fontscan', function () {
  it('shoud have a function', () => {
    assert.equal(typeof fontscan.getFontList, 'function');
  });

  describe('#getFontList', function () {
    this.timeout(10 * 1000);
    it('should return fontdescriptor array', () => {
      return fontscan.getFontList().then((fdList) => {
        assert.ok(Array.isArray(fdList));
        fdList.forEach((fd) => isFontDescriptor(fd));
      });
    });

    it('should return only test data', () => {
      return fontscan
        .getFontList({
          customDirectories: ['./test/data'],
          onlyCustomDirectories: true,
        })
        .then((fdList) => {
          assert.equal(fdList.length, 5);
        });
    });
  });
});
