import {beforeEach, expect, test, beforeAll} from '@jest/globals';
import {pageLoader, makeFileNameFromUrl} from '../src/page-loader.js';

import {mkdtemp, readFile} from 'node:fs/promises';
import {join, dirname, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';

import nock from 'nock';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let tmpDir = '';
const getFilePath = (filename) => join(tmpDir, filename);

beforeAll(() => {
  nock.disableNetConnect();
});

beforeEach(async () => {
  tmpDir = await mkdtemp(join(tmpdir(), 'page-loader-'));
});

describe('page-loader', () => {
  test('should scrap page with correct path', async () => {
    const filename = 'books-toscrape-com.html';
    nock(/books\.toscrape\.com/)
        .get('/')
        .reply(200, '<html></html>');
    await pageLoader('https://books.toscrape.com/', tmpDir);
    const actualFile = await readFile(
        getFilePath(filename),
        {encoding: 'utf8'});
    const expectedFile = '<html></html>';
    expect(actualFile).toEqual(expectedFile);
    const actualPath = resolve(__dirname, tmpDir, filename);
    expect(actualPath).toBe(tmpDir + '/' + filename);
  });

  test('should return correct filename from path', () => {
    const actual = makeFileNameFromUrl('https://example.com/advice.php?blow=apparel&breath=anger');
    const expected = 'example-com-advice-php-blow-apparel-breath-anger.html';
    expect(actual).toBe(expected);
  });
});
