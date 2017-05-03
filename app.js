#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var recursive = require('recursive-readdir');
var commander = require('commander');
var exec = require('child_process').exec;


function unzipSketch(sketchPath) {
  var directoryPath = path.dirname(sketchPath) + '/' + path.basename(sketchPath, '.sketch');
  var blankReplacedDirectoryPath = directoryPath.split(' ').join('\\ ');
  sketchPath = sketchPath.split(' ').join('\\ ');
  var commandString = "unzip -o " + sketchPath + " -d " + blankReplacedDirectoryPath;
  console.log('$ ', commandString);
  exec(commandString, function (error, stdout, stderr) {
    console.log(stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    recursive(directoryPath, ['*.png'], function (err, filesPaths) {
      filesPaths.forEach(function (filePath) {
        if (path.extname(filePath) == '.json') {
          fs.readFile(filePath, "utf-8", function (err, data) {
            fs.writeFile(filePath, JSON.stringify(JSON.parse(data), null, 2));
          });
        }
      });
      console.log(sketchPath + ' unzip in ' + directoryPath + ' and all json file reformatting.');
    });
  })
}

function zipSketch(drectoryPath) {
  var basename = path.basename(drectoryPath);
  drectoryPath = drectoryPath.split(' ').join('\\ ');
  var commandString = "cd " + drectoryPath + "\n zip -r -X '../" + basename + ".sketch' * \n";
  console.log('$ ', commandString);
  exec(commandString, function (error, stdout, stderr) {
    console.log(stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    console.log('generate sketch file from ' + drectoryPath);
  });
}


commander
  .arguments('<sketch-zipper>')
  .option('-u, --unzip <path>', 'path of sektch file.', unzipSketch)
  .option('-z, --zip <path>', 'path of unzipped sketch directory.', zipSketch)
  .parse(process.argv);