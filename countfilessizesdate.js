const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require("fs");
require("dotenv").config();
const validateDate = require("validate-date");
const path = require('path');

//helper function that formats bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function checkDate(day, month,year){
  if(day<10){
    day='0'+day.toString();
  }
  return validateDate(`${day}/${month}/${year}`, responseType="boolean", dateFormat="dd/mm/yyyy"); // returns "Valid Date"
}

async function main() {
  var argv = require("minimist")(process.argv.slice(2));
  try {
    if (!argv.D || !argv.M || !argv.Y) {
      throw "Please provide all arguments:\n -D for day, \n -M for month, \n -Y for year";
    }
    if (!checkDate(argv.D,argv.M,argv.Y)) {
      throw `Please provide a valid date. ${argv.D}/${argv.M}/${argv.Y} is invalid`;
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

  try {
    await fs.promises.mkdir(path.join(__dirname, 'logs'));
    await fs.promises.writeFile("logs/results.txt", "Starting going through the blobs... \n");

  } catch (err) {
    console.error('Error occurred', err);
  }

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


      try {
        await fs.promises.appendFile("logs/results.txt", log)
      } catch (err) {
        console.error('Error occurred', err);
      }
  
    }
  }
  let string = `Results from date ${argv.D}-${argv.M}-${
    argv.Y
  } are ${count} files. Their added size is ${formatBytes(size)}.`;

  console.log(string);

  try {
    await fs.promises.appendFile("logs/results.txt", string)
  } catch (err) {
    console.error('Error occurred', err);
  }
}

main();
