import {writeFile} from 'node:fs/promises';
import axios from 'axios';
/* eslint-disable require-jsdoc */
// 'https://books.toscrape.com/'
const makeFileNameFromUrl = (url) => {
  return url
      .trim()
      .split('://')[1]
      .replace(/[^A-Za-z0-9]/g, '-')
      .replace(/-$/, '')
      .concat('.html');
};

const pageLoader = async (url, outputDir = './') => {
  const response = await axios.get(url);
  const filename = makeFileNameFromUrl(url);
  await writeFile(`${outputDir}/${filename}`, response.data);
};

export {
  makeFileNameFromUrl,
  pageLoader,
};

