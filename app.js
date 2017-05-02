#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var recursive = require('recursive-readdir');
var JSZip = require('jszip');
var unzip = require('unzip2');
var commander = require('commander');

function unzipSketch(sketchPath) {
  var parsePath = path.parse(sketchPath);
  var dirPath = path.dirname(sketchPath) + '/' + parsePath.name;
  console.log(sketchPath + ' unzip in ' + dirPath + ' and all json file reformatting.');
  fs.createReadStream(sketchPath).pipe(unzip.Extract({ path: dirPath }))
    .on('close', function () {
      // json reformatting
      recursive(dirPath, ['*.png'] ,function (err, filesPaths) {
        filesPaths.forEach(function (filePath) {
          if(path.extname(filePath) == '.json'){
            fs.readFile(filePath, "utf-8", function (err, data) {
              fs.writeFile(filePath, JSON.stringify(JSON.parse(data), null, 2));
            });
          }
        });
      })
    });
}

function zipSketch(dirPath) {
  console.log(dirPath + ' generate sketch file.');
  recursive(dirPath, function (err, newFilesPaths) {

    // read dummy sketch file
    fs.readFile(__dirname + '/sketch.sketch', function(err, data) {
      JSZip.loadAsync(data).then(function(zip) {

        var files = Object.keys(zip.files);

        // write all new file
        newFilesPaths.forEach(function (path) {
          var zipPath = path.split('/').splice(1).join('/');
          var newFile = fs.readFileSync(path);
          zip.file(zipPath, newFile);
        });

        // sketch generate
        zip
          .generateNodeStream({ type:'nodebuffer', streamFiles:true })
          .pipe(fs.createWriteStream(dirPath + '.sketch'))
          .on('close', function () {
            console.log('done');
          })

      })
    });

  });
}

commander
  .arguments('<sketch-zipper>')
  .option('-u, --unzip <path>', 'path of sektch file.', unzipSketch)
  .option('-z, --zip <path>', 'path of unzipped sketch directory.', zipSketch)
  .parse(process.argv);