const fs = require("fs");
const ini = require("ini");
const readline = require("readline");

// путь до файла конфигурации geany плагина saveactions
const geanyAutoSavePlagin =
  "/home/alex/.config/geany/plugins/saveactions/saveactions.conf";

// путь до конфига geany
const geanyConfig = "/home/alex/.config/geany/geany.conf";

// массив файлов, которые открыты в geany
const fileOpenInGeany = [];

// создаем поток для чтения файла
const instream = fs.createReadStream(geanyConfig);

// считываем путь до временного файла
const configAutoSavePath = ini.parse(
  fs.readFileSync(geanyAutoSavePlagin, "utf-8")
);

// считываем путь да конфиг-файла, в котором есть список текщих открытых файлов в редакторе
const configPath = ini.parse(fs.readFileSync(geanyConfig, "utf-8"));

// создаем интерфейс для файла
const readInterface = readline.createInterface({
  input: instream,
});

// читаем построчно поток
// если находим, что строка содержит "FILE_NAME", значит в строке есть открытый файл в geany
readInterface.on("line", function (line) {
  if (line.includes("FILE_NAME")) {
    // преобразуем к нормальному виду
    let tmpLine = line.slice(0, line.length - 4);
    let startPosition = tmpLine.lastIndexOf(";");
    if (startPosition != -1) {
      // если позиция найдена, получаем имя файла, который существует в редакторе
      let fileNameWithExistEditor = tmpLine.slice(startPosition + 1);
      fileNameWithExistEditor = fileNameWithExistEditor.split("%2F").join("/");

      fileOpenInGeany.push(fileNameWithExistEditor);
    }
  }
});

// если дошли до конца файла, то закрываем поток и обрабатываем массив с нашими открытыми в редакторе файлами
instream.on("end", () => {
  console.log("END");
  readInterface.close();
  fileOpenInGeany.forEach((line) => {
    console.log(line);
  });
});
