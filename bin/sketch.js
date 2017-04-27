#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var recursive = require('recursive-readdir');
var JSZip = require('jszip');
var unzip = require('unzip2');
var commander = require('commander');

function zipSketch(url) {
  console.log(url + '폴더를 압축해' + url + '.sketch 파일로 만듭니다.');
  recursive(url, function (err, newFilesPaths) {

    fs.readFile(__dirname + '/sketch.sketch', function(err, data) {
      JSZip.loadAsync(data).then(function(zip) {

        var files = Object.keys(zip.files);

        // remove all file
        files.forEach(function (filePath) {
          zip.remove(filePath);
        });

        // write all new file
        newFilesPaths.forEach(function (path) {
          var zipPath = path.split('/').splice(1).join('/');
          var newFile = fs.readFileSync(path);
          zip.file(zipPath, newFile);
        });

        // sketch generate
        zip
          .generateNodeStream({ type:'nodebuffer', streamFiles:true })
          .pipe(fs.createWriteStream(url + '.sketch'))
          .on('close', function () {
            console.log('done');
          })

      })
    });

  });
}

function unzipSketch(url) {
  var parsePath = path.parse(url);
  var dirPath = path.dirname(url) + '/' + parsePath.name;
  console.log(url + '파일을' + dirPath + '폴더에 압축해제하고 모든 json파일을 리포맷팅합니다.');
  fs.createReadStream(url).pipe(unzip.Extract({ path: dirPath }))
    .on('close', function () {
      recursive(dirPath, ['*.png'] ,function (err, filesPaths) {
        filesPaths.forEach(function (fileUrl) {
          if(path.extname(fileUrl) == '.json'){
            fs.readFile(fileUrl, "utf-8", function (err, data) {
              fs.writeFile(fileUrl, JSON.stringify(JSON.parse(data), null, 2));
            });
          }
        });
      })
    });
}


commander
  .arguments('<sketch>')
  .option('-z, --zip <url>', '압축할 폴더의 url을 입력하세요.', zipSketch)
  .option('-u, --unzip <url>', '압축을 풀 sketch파일의 url을 입력하세요.', unzipSketch)
  .parse(process.argv);