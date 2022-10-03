const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require('fs');

//TODO INSERT CONNECTIONN STRING
const connStr = "";
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

//TODO INSERT CONTAINER NAME
const containerName = "";

async function main() {

    let deletedFiles=0;
    const containerClient = blobServiceClient.getContainerClient(containerName); 
    let blobs = containerClient.listBlobsFlat({includeDeleted: false});
    for await (const blob of blobs) {
        if(blob.name.split('/')[2] && blob.name.split('/')[2]==='archive'){
            let now = new Date();
            let total_days_since_last_mod = Math.ceil((now.getTime() - blob.properties.lastModified.getTime()) / (1000 * 3600 * 24));
            console.log(total_days_since_last_mod);
            if(total_days_since_last_mod >= 30){
                console.log(blob.properties.lastModified);
                containerClient.deleteBlob(blob.name);
                deletedFiles++;
            }
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