const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require('fs');

//connect to the storage account via connection string
const connStr = "DefaultEndpointsProtocol=https;AccountName=v3c2pqtm70gany6oyh6a53u;AccountKey=a8AIC8JRVitQ7iyYwK9MoyHT3YzkHSW0b3pijKAnrr/dHq/9NhkWsyzRMhPTmz/yR/+Kgz6Oyvo/LiQWEmBzlQ==;EndpointSuffix=core.windows.net";
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

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
    let containers={};

    //lisst all containers in the storage account and iterate through them
    for await (const container of blobServiceClient.listContainers()) {
        //get blobs in one container
        const containerClient = blobServiceClient.getContainerClient(container.name);         
        let blobs = containerClient.listBlobsFlat();
        let size =0;
       
        //iterate through blobs to calculate its size
        for await (const blob of blobs) {
            size = size + blob.properties.contentLength.valueOf();
        }

        //write the result to an object
        containers[container.name] =  formatBytes(size);   
    }

    //convert object with results to JSON format
    const containersJSON = JSON.stringify(containers);

    //wirte results to file
    fs.writeFile("wynik",containersJSON, function(err) {
        if(err) {
            return console.log(err);
        }
            
        console.log("The file was saved!");
    }); 
  }
  
main();