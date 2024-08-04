import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadToS3 = async (originalname: string, buffer: Buffer, mimetype: string) => {
    try {
         const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: `${Date.now()}_${originalname}`,
            Body: buffer,
            ContentType: mimetype,
            ACL: 'public-read',
          };
    
          const s3Response = await s3.upload(params).promise();

          return s3Response;
    } catch (error) {
        console.log(error);
    }
}


export const deleteFromS3 = async (Key: string) => {
  try {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key,
    };

    await s3.deleteObject(params).promise();
    return true;
    
  } catch (error) {
    console.log(error);
    return false;
  }
};
