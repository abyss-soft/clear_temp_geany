const fs = require("fs");
const path = require("path");
const ini = require("ini");
const readline = require("readline");
const { table } = require("console");

// путь до файла конфигурации geany плагина saveactions
const geanyAutoSavePlagin =
  "/home/alex/.config/geany/plugins/saveactions/saveactions.conf";

// путь до конфига geany
const geanyConfig = "/home/alex/.config/geany/geany.conf";

// массив файлов, которые открыты в geany
const fileOpenInGeany = [];

// создаем поток для чтения конфиг-файла, в котором есть список текущих открытых файлов в редакторе
const instream = fs.createReadStream(geanyConfig);

// считываем путь до временного каталога
const configAutoSavePath = ini.parse(
  fs.readFileSync(geanyAutoSavePlagin, "utf-8")
);

// создаем интерфейс для файла
const readInterface = readline.createInterface({
  input: instream,
});

// читаем построчно поток
// если находим, что строка содержит "FILE_NAME", значит в строке есть открытый файл в geany
readInterface.on("line", function (line) {
  if (line.includes("FILE_NAME")) {
    
    // let tmpLine = line.slice(0, line.length - 4); // уберем последнии 4 символа
    // let startPosition = tmpLine.lastIndexOf(";"); // ищем последний символ ";", который находится перед именем файла открытым в редакторе
    // if (startPosition != -1) {
      // если позиция найдена, получаем имя файла, который существует в редакторе
      // let fileNameWithExistEditor = tmpLine.slice(startPosition + 1);
      // fileNameWithExistEditor = fileNameWithExistEditor.split("%2F").join("/");

// преобразуем к нормальному виду и получаем имя файла с путем из строки конфигурации
      let stringSplit = line.split("%2F").join("/").split(';');
      let fileName = stringSplit[stringSplit.length-3];


      fileOpenInGeany.push(fileName);
    // }
  }
});

// путь до каталого временных файлов
//console.log(configAutoSavePath.instantsave.target_dir);

// функция получения всех файлов во временной папки
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

// функция удаления файла
function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath);
    console.log(`Deleted ${filePath}`);
  } catch (error) {
    console.error(`Got an error trying to delete the file: ${error.message}`);
  }
}

// если дошли до конца файла, то закрываем поток и обрабатываем массив с нашими открытыми в редакторе файлами
instream.on("end", () => {
  readInterface.close(); // тут закрыли поток и уже есть все файлы открытые в реакторе
  
  // получаем все файлы во временной папке
  const allFilesInTempDirectory = getFiles(
    configAutoSavePath.instantsave.target_dir
  );
  // console.table(allFilesInTempDirectory);
  //fileOpenInGeany
  // console.table(fileOpenInGeany);
  const filesForDelete = [];
  // выбираем файлы которые НЕ открыты в редакторе
  allFilesInTempDirectory.forEach((line) => {
    if (!fileOpenInGeany.includes(line)) {
      filesForDelete.push(line);
    }
  });
  // console.table(filesForDelete);

  // удаляем все файлы НЕ открытые в редакторе
  filesForDelete.forEach((fileForDel) => {
    deleteFile(fileForDel);
  });
});
