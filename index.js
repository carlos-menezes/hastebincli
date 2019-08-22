#!/usr/bin/env node

const axios = require('axios');
const yargs = require('yargs');
const fs = require('fs');

const HASTEBIN_URL = 'https://hastebin.com/documents';

const options = yargs
  .usage('Usage: <option> <data>')
  .option('t', { alias: 'text', describe: 'The text to write to Hastebin', type: 'string' })
  .option('f', { alias: 'file', describe: 'The file to read and write to Hastebin', type: 'string' })
  .argv;

if (process.argv.length < 3) { // Change
  return yargs.showHelp();
}

if (options.text) {
  const data = process.argv.slice(3).join(' ');
  postData(data);
  return ;
} else if (options.file) {
  let data;

  try {
    data = fs.readFileSync(process.argv[3]);
  } catch (error) {
    console.error('ERROR: The specified file does not exist.');
    return;
  }

  const splitFile = options.file.split('.');
  const fileExt = splitFile[splitFile.length - 1];
  
  postData(data, fileExt);
  return;
}

function postData(data, extension = false) {
  axios.post(HASTEBIN_URL, data)
    .then((res) => {
      if (!extension) {
        console.log(`PASTE CREATED | URL: https://hastebin.com/${res.data.key}`);
        console.log(`TIP: You can append any short programming language name to the url to enable syntax highlighting. e.g. https://hastebin.com/${res.data.key}.js`)
      } else {
        console.log(`PASTE CREATED | URL: https://hastebin.com/${res.data.key}.${extension}`);
      }
    });
}