const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require("fs");
require("dotenv").config();

//helper function that formats bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

async function main() {
  var argv = require("minimist")(process.argv.slice(2));
  try {
    if (!argv.D || !argv.M || !argv.Y) {
      throw "Please provide all arguments:\n -D for day, \n -M for month, \n -Y for year";
    }
    if (
      argv.Y >= 1990 &&
      argv.Y <= new Date().getFullYear() &&
      argv.M >= 1 &&
      argv.M <= 12 &&
      argv.D >= 1 &&
      argv.D <= 31
    ) {
    } else {
      throw `Please provide all arguments in ranges:\n -D for day (1-31), \n -M for month (1-12), \n -Y for year (1990-${new Date().getFullYear()}).`;
    }

    if (argv.M === 2 && argv.Y % 4 === 0 && argv.D > 29) {
      throw `This month has only 29 days!`;
    }

    if (argv.M === 2 && argv.Y % 4 !== 0 && argv.D > 28) {
      throw `This month has only 28 days!`;
    }

    if (argv.M % 2 === 0 && argv.D > 30) {
      throw `This month has only 30 days!`;
    }
  } catch (err) {
    console.log(err);
    return;
  }

  console.log(
    `Provided date is ${argv.D}-${argv.M}-${argv.Y}, Connection string is ${process.env.CONNECTION_STRING}`
  );

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.CONNECTION_STRING.toString()
  );

  const containerClient = blobServiceClient.getContainerClient(
    process.env.CONTAINER_NAME.toString()
  );

  let blobs = containerClient.listBlobsFlat();

  let count = 0;
  let size = 0;

  fs.promises.mkdir('/logs').catch(console.error);

  fs.writeFile("logs/results.txt", "Starting going through the blobs... \n", function (err) {
    if (err) {
      return console.log(err);
    }
  });

  console.log("Starting going through the blobs...");

  for await (const blob of blobs) {
    let month = blob.properties.lastModified.getMonth().valueOf() + 1;
    if (
      blob.properties.lastModified.getFullYear() === argv.Y &&
      month === argv.M &&
      blob.properties.lastModified.getDate() === argv.D
    ) {
      count++;
      size = blob.properties.contentLength.valueOf() + size;
      let log = `One file from ${argv.D}-${argv.M}-${argv.Y} added, with name ${
        blob.name
      } and with size ${formatBytes(blob.properties.contentLength.valueOf())}. \n`;
      console.log(log);

      fs.appendFile("logs/results.txt", log, function (err) {
        if (err) {
          return console.log(err);
        }
      });
    }
  }
  let string = `Results from date ${argv.D}-${argv.M}-${
    argv.Y
  } are ${count} files. Their added size is ${formatBytes(size)}.`;

  console.log(string);
  fs.appendFile("logs/results.txt", string, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

main();
