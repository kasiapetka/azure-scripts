const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require('fs');

//TODO INSERT CONNECTIONN STRING
const connStr = ""

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

//TODO INSERT CONTAINER NAME
const containerName = "";

async function main() {

    let deletedFiles=0;
    const containerClient = blobServiceClient.getContainerClient(containerName); 
    let blobs = containerClient.listBlobsFlat();
    for await (const blob of blobs) {

        //THIS WILL WORK ONLY IF YOU HAVE A STRUCTURE LIKE: ContainerName/FolderName/FolderName/archive
        if(blob.name.split('/')[2] && blob.name.split('/')[2]==='archive'){

            //CHANGE THE DATE, EVERY FILE THAT WAS NOT MODIFIED SINCE PROVIDED DATE WILL BE DELETED
            let now = new Date('2022-01-01');
            
            if(now>blob.properties.lastModified){
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
  }codate
  

main();