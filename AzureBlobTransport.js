const { Transport } = require('winston');
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

class AzureBlobTransport extends Transport {
    constructor(opts) {
        super(opts);

        const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        const storageAccountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
        const AZURE_STORAGE_CONNECTION_STRING = `DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccountKey};EndpointSuffix=core.windows.net`;
        const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

        if (!AZURE_STORAGE_CONNECTION_STRING) {
            throw new Error("Azure Storage Connection String not found");
        }

        if (!containerName) {
            throw new Error("Azure Storage Container Name not found");
        }

        this.client = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        this.containerClient = this.client.getContainerClient(containerName);
    }

    async log(info, callback) {
        setImmediate(() => this.emit('logged', info));

        const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
        const logLevel = info.level.toLowerCase(); // Lowercase log level
        const blobName = `${logLevel}-${date}.log`; // Unique file name based on log level and date
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

        const logEntry = `${new Date().toISOString()} - ${info.message}\n`; // Log message

        try {
            await this.containerClient.createIfNotExists(); // Ensure the container exists

            // Append the log entry to the existing log file or create a new one if it doesn't exist
            let existingContent = '';
            try {
                const downloadBlockBlobResponse = await blockBlobClient.download(0);
                existingContent = await streamToString(downloadBlockBlobResponse.readableStreamBody);
            } catch (error) {
                if (error.statusCode !== 404) {
                    throw error;
                }
            }
            const newContent = existingContent + logEntry;
            await blockBlobClient.upload(newContent, Buffer.byteLength(newContent), { overwrite: true });

            console.log(`Log entry uploaded to blob storage: ${blobName}`);
            callback();
        } catch (error) {
            console.error("Failed to upload log entry:", error);
            callback(error);
        }
    }
}

// Utility function to stream a block blob content to a string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}

module.exports = AzureBlobTransport;
