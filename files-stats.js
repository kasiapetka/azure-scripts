const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require('fs');

const connStr = "DefaultEndpointsProtocol=https;AccountName=testeastusconnection;AccountKey=96ZsP8pbSobSLeoOZeEHrdz2U+w3oQ/l2I0R3/elSxuAnyFf/uWtX8YmHeI27CF8W9E1nklsGSdVs9viO9anNA==;EndpointSuffix=core.windows.net"
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerName = "snap-1624902165112-sys-master-images";

function monthToString(month){
    switch (month){
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";  
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
           return "December";
        default:
            "Month"
    }
}
//helper function that formats bytes 
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function main() {
    const containerClient = blobServiceClient.getContainerClient(containerName);
  
    let files={};
    let blobs = containerClient.listBlobsFlat();
    console.log(blobs)
    files["All files"]=0;
    files["All files size"]=0;

    for (let i=0;i<12;i++){
        files[monthToString(i)]=0;
        files[monthToString(i)+" size"]=0;
    }

    for await (const blob of blobs) {

        blob_size=blob.properties.contentLength.valueOf();
        
        files["All files"]=files["All files"] + 1; 
        files["All files size"]=files["All files size"] + blob_size;

        let currMonth=monthToString(blob.properties.lastModified.getMonth().valueOf());
        
        files[currMonth]=files[currMonth]+1;
        files[currMonth+" size"]= files[currMonth+" size"]+ blob_size;
        
    }

    for (let i=0;i<12;i++){
        let currMonth=monthToString(i);
        files[currMonth+" size"]=formatBytes(files[currMonth+" size"]);
    }
    files["All files size"]=formatBytes(files["All files size"]);

    const filesJSON = JSON.stringify(files);


    fs.writeFile("results",filesJSON, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  }
  

main();