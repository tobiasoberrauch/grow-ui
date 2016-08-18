"use strict";

const fs = require('fs');
const path = require('path');
const https = require('https');
const request = require('request');
const mkdir = require('mkdirp');

class RestClient {
  constructor(resource) {
    this.dataFilePath = __dirname + '/../../../data/' + resource + '.json';
    this.dataRootPath = path.dirname(this.dataFilePath);
    if (!fs.existsSync(this.dataRootPath)) {
      mkdir(this.dataRootPath);
    }

    this.options = {
      uri: 'https://one.opus-fashion.com/' + resource + '?sort(-id)',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, sdch, br',
        'Accept-Language': 'de,en-US;q=0.8,en;q=0.6,ar;q=0.4,es;q=0.2,fr;q=0.2,nl;q=0.2',
        'Cache-Control': 'no-cache',
        'Cookie': 'PHPSESSID=1hph20432i4j2jqsgtgm6ca183',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'DNT': 1,
        'Pragma': 'no-cache',
        'Range': 'items=0-499',
        'Referer': 'https://one.opus-fashion.com/',
        'token': '4196035ad45a1e5da320fdb867f73b34',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36',
        'X-Range': 'items=0-499'
      }
    };
  }

  run(cb) {
    var indents;

    if (fs.existsSync(this.dataFilePath)) {
      var body = fs.readFileSync(this.dataFilePath, 'utf8');
      indents = JSON.parse(body);
      return cb(null, indents);
    }

    request(this.options, (error, response, body) => {
      if (error) {
        return console.error(error);
      }

      indents = JSON.parse(body);

      //if (indentsBefore) {
      //  let differences = indents.filter(indent => indentsBefore.indexOf(indent) === -1);
      //  console.log('differences', differences);
      //}

      fs.writeFileSync(this.dataFilePath, JSON.stringify(indents, null, 4));

      cb(null, indents);
    });
  }
}

module.exports = RestClient;
