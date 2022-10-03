const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require('fs');

//TODO fill connection string
const connStr = "";
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

//TODO fill container name
const containerName = "";

async function main() {
    const containerClient = blobServiceClient.getContainerClient(containerName);
  
    let all = 0;
    let november=0;
    let october =0;
    let september =0;
    let august =0;
    let july =0;
    let rest =0;
    
    let size_all = 0;
    let size_november=0;
    let size_october =0;
    let size_september =0;
    let size_august =0;
    let size_july =0;

    let size_rest =0;

    let deleted =0;
    let deleted_size =0;

    let blobs = containerClient.listBlobsFlat();
    for await (const blob of blobs) {
        if(blob.deleted){
            deleted=deleted+1;
            deleted_size=deleted_size+blob.properties.contentLength.valueOf();
            console.log(blob.deleted)

        }else{
            all=all+1;
            size_all = blob.properties.contentLength.valueOf()+size_all;


            

            if(blob.properties.lastModified.getMonth().valueOf() === 10){
                size_november = blob.properties.contentLength.valueOf()+size_november;
                november=november+1;
                console.log(blob.properties.contentLength.valueOf())
            } else if (blob.properties.lastModified.getMonth().valueOf() === 9){
                size_october = blob.properties.contentLength.valueOf()+size_october;
                october = october+1;

            }else if (blob.properties.lastModified.getMonth().valueOf() === 8){
                size_september = blob.properties.contentLength.valueOf()+size_september;
                september = september+1;
            }else if (blob.properties.lastModified.getMonth().valueOf() === 7){
                size_august = blob.properties.contentLength.valueOf()+size_august;
                august = august+1;
            }else if (blob.properties.lastModified.getMonth().valueOf() === 6){
                size_july = blob.properties.contentLength.valueOf()+size_july;
                july = july+1;
            }else {
                size_rest = blob.properties.contentLength.valueOf()+size_rest;
                rest = rest+1;
            }
        }
        
    }
    let string = "Wyniki. \n November pliki: " + november+" November Size: "+size_november+" \n October pliki: " 
    + october+" October Size: "+size_october+" \n September pliki:" +september+" September Size: "+size_september
    +" \n August pliki:" +august+" August Size: "+size_august
    +" \n July pliki:" +july+" July Size: "+size_july+
    " \n Wszystkie pliki: " + all+" Wszystkie Size: "+size_all+" \n Reszta pliki: " + rest+" Reszta Size: "+size_rest+
    " \n Deleted pliki: " + deleted+" Deleted Size: "+deleted_size;

    fs.writeFile("wynik",string, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
  }
  

main();