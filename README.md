# Clear_temp_Geany add-on for saveactions plugin

### Clearing the temporary folder from all files, except for files opened in the Geany editor

Because the "saveactions" plugin/module for the Geany editor says the following:

```
If you set the Instant Save directory to a directory which is not automatically cleared,
you will need to cleanup instantly saved files manually. The Instant Save plugin will not delete the created files.
```

We get that we have a temporary folder in which files are stored that are already closed in Geany, but have not been deleted on disk.

At the same time, there are some files in the same folder that are still open in Geany and are autosaved and still needed.

In order not to manually clear the temporary folder each time, choosing there and saving the necessary files, such a program was written.

#### She does the following:

See what files are in the temporary directory for the "saveactions" module, and also see what files in the same temporary folder are still open in the Geany editor. It will delete all files in the temporary folder, except for autosaved files opened in Geany.

#### Setting

Don't forget to fix the paths:

1. `before 'saveactions' plugin geany config file`

2. `to geany config` 

Installation:

**git clone**

**npm install**

Then add to autorun by cron: `node index.js`

---

RUS:

# Geany дополнение для плагина saveactions

### Очистка временной папки от всех файлов, кроме файлов открытых в редакторе Geany

Так как в плагине/модуле "saveactions" для редактора Geany указано следующее:

```
If you set the Instant Save directory to a directory which is not automatically cleared,
you will need to cleanup instantly saved files manually. The Instant Save plugin will not delete the created files.
```

Мы получаем что у нас есть временная папка, в которой копятся файлы, которые уже закрыты в Geany, но на диске не удалены.

В то же время в этой же папке находятся некоторые файлы, которые все еще открыты в Geany и автосохраняются и они все еще нужны.

Чтобы в ручную не очищать каждый раз временную папку, выбирая там и сохраняя нужные файлы, была написана вот такая программа.

#### Она делает следующее:

Смотрит, какие файлы вообще есть во временной папке для модуля "saveactions", а так же смотрит, какие файлы в этой же временной папке все еще открыты в редакторе Geany. Она удалит все файлы во временной папке, кроме автосохраненных файлов открытых в Geany.

#### Настройка

Не забыть поправить пути:

1. `до файла конфигурации geany плагина saveactions`

2. `до конфига geany`

Установка:

**git clone**

**npm install**

Потом добавить в автозапуск по крону: `node index.js`
