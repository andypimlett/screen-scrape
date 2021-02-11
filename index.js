'use strict';
const captureWebsite = require('capture-website');
const fs = require('fs');
const xml2js = require('xml2js');
const rimraf = require("rimraf");

const parser = new xml2js.Parser();

const options = {
    fullPage: true,
};

var dest = './screenshots';

if (fs.existsSync(dest)){
    rimraf.sync(dest);
    console.log('Removed old screenshots');
}

fs.mkdirSync(dest);

fs.readFile(__dirname + '/sitemap.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        const sitemap = result.urlset.url;
        const urls = sitemap.map(a => a.loc);

        let offset = 0;
        urls.map(url => {
          setTimeout(() => {
          (async () => {
            let string = url[0].substring(url[0].lastIndexOf('/') + 1) || 'index'; 
            await captureWebsite.file(url[0], `./screenshots/${string}.png`, options);
            console.log(`${string}.png created`);
          })();
          }, 10000 + offset);
          offset += 10000;
        })
    });
});