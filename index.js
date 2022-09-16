const fs = require("fs");
const path = require("path");
const ini = require("ini");
const readline = require("readline");
const { table } = require("console");

// path to 'saveactions' plugin geany configuration file
const geanyAutoSavePlagin =
  "/home/alex/.config/geany/plugins/saveactions/saveactions.conf";

// path to geany config
const geanyConfig = "/home/alex/.config/geany/geany.conf";

// array of files that are open in geany
const fileOpenInGeany = [];

// create a stream for reading the config file, which has a list of currently open files in the editor
const instream = fs.createReadStream(geanyConfig);

// read the path to the temporary directory
const configAutoSavePath = ini.parse(
  fs.readFileSync(geanyAutoSavePlagin, "utf-8")
);

// create an interface for the file
const readInterface = readline.createInterface({
  input: instream,
});

// read the stream line by line
// if we find that the string contains "FILE_NAME", then the string has an open file in geany
readInterface.on("line", function (line) {
  if (line.includes("FILE_NAME")) {
    // convert to normal and get the file name with the path from the configuration line
    let stringSplit = line.split("%2F").join("/").split(";");
    let fileName = stringSplit[stringSplit.length - 3];

    fileOpenInGeany.push(fileName);
  }
});

// configAutoSavePath.instantsave.target_dir - path to temporary files directory

// function to get all files in temporary folder
const getFiles = function (dir, files_) {
  files_ = files_ || [];
  let files = fs.readdirSync(dir);
  for (let i in files) {
    let name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
};

// file delete function
function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath);
    console.log(`Deleted ${filePath}`);
  } catch (error) {
    console.error(`Got an error trying to delete the file: ${error.message}`);
  }
}

// if we reach the end of the file, then we close the stream and process the array with our files open in the editor
instream.on("end", () => {
  readInterface.close(); // the stream was closed here and there are already all files open in the reactor

  // get all files in temporary folder
  const allFilesInTempDirectory = getFiles(
    configAutoSavePath.instantsave.target_dir
  );

  const filesForDelete = [];
  // select files that are NOT open in the editor
  allFilesInTempDirectory.forEach((line) => {
    if (!fileOpenInGeany.includes(line)) {
      filesForDelete.push(line);
    }
  });

  // delete all files NOT open in the editor
  filesForDelete.forEach((fileForDel) => {
    deleteFile(fileForDel);
  });
});
