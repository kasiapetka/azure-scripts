const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require('fs');

//TODO INSERT CONNECTIONN STRING
const connStr = "connectionSting"

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

//TODO INSERT CONTAINER NAME
const containerName = "containerName";

async function main() {

    //TODO SET THE MONTH NUMBER (0-January, 1-February, 3-March, ..., 11-November, 12-December)
    let month = 0;

    let deletedFiles=0;
    const containerClient = blobServiceClient.getContainerClient(containerName); 
    let blobs = containerClient.listBlobsFlat({includeDeleted: true});
    for await (const blob of blobs) {
        if(blob.properties.lastModified.getMonth().valueOf() === month){
            containerClient.deleteBlob(blob.name);
            deletedFiles++;
        }
    }
    
    let deletedFilesString="Deleted "+deletedFiles.toString()+" files.";
    
    fs.writeFile("results",deletedFilesString, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  }
  

main();