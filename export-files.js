const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require('fs');

async function main() {
    const arg = process.argv[2].toString();
    const connStr = process.argv[3].toString();
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

    for await (const container of blobServiceClient.listContainers()) {

        if(container.name===""){
            console.log(`Skip ${container.name}`);   
        }

        else{

        
        console.log(`---------------------------------------------------`);   
        console.log(`Starting download of ${container.name}`);   

        const containerClient = blobServiceClient.getContainerClient(container.name);         
        let blobs = containerClient.listBlobsFlat();
        let dir = arg  + container.name.toString() + "/";

        try{
             for await (const blob of blobs) {
            const blobClient = await containerClient.getBlobClient(blob.name);

            let fileNameWithPath =  dir + blob.name; 
            let path = fileNameWithPath.substr(0, fileNameWithPath.lastIndexOf("/"));

            if (!fs.existsSync(path)){
                fs.mkdirSync(path, { recursive: true });
            }

           await blobClient.downloadToFile(fileNameWithPath);          
        }
        }catch(e){
            console.log(e);   

        }
       

        console.log(`Download of ${container.name} finished successfully`);   
    }
}
    console.log("")
    console.log(`All containers successfully downloaded!`);   
  }
  
main();