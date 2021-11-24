const { BlobServiceClient } = require("@azure/storage-blob");

//TODO INSERT CONNECTIONN STRING
const connStr = "connectionSting";
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
//TODO INSERT CONTAINER NAME
const containerName = "containerName";

async function main() {
    //get container 
    const containerClient = blobServiceClient.getContainerClient(containerName);

    //get blobs in the container
    let blobs = containerClient.listBlobsFlat();

    //TODO DELETE IF YOU DONT WANT UPDATE BLOBS CONTENT TYPES
    //THIS LOOP ITERATES THROUGH ALL BLOBS IN THE CONTAINER AND CHANGES CONTENT TYPE OF FILES WOTH .STP EXTENSION TO 'application/octet-steram'
    //iterate through all blobs in the container
    for await (const blob of blobs) {
    
        //regex to get the file extension
        let r=new RegExp("\.([^\.]+)$");

        //if extension is .STP -> do something
        if(blob.name.match(r)[1]==='STP'){

            //get block blob client
            const blobclient=containerClient.getBlockBlobClient(blob.name);

            //update the file content type
            blobclient.setHTTPHeaders({ blobContentType: 'application/octet-steram' });
        }
    }


    //TODO DELETE IF YOU DONT WANT TO UPLOAD FILES
    //THIS FRAGMENT SHOWS HOW TO UPLOAD A NEW FILE TO STORAGE ACCOUNT WITH A SET CONTENT TYPE
    let filePath = "filePath"
    const blobclient=containerClient.getBlockBlobClient("newFileName");
    //to upload file with specific content type use: 
    await blobclient.uploadFile(filePath, {
        blobHTTPHeaders: {
          blobContentType: 'application/octet-steram',
        }
      });
  }
  


main();