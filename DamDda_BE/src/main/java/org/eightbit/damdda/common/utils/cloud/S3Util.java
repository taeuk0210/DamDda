package org.eightbit.damdda.common.utils.cloud;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.Date;

@Component
@NoArgsConstructor
public class S3Util {

    private AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Autowired
    public S3Util(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public void uploadFileToS3(String fileName, String fileType, File file) {
        // Validate AmazonS3 instance
        if (amazonS3 == null) {
            throw new IllegalStateException("[S3Util] AmazonS3 client is not initialized.");
        }

        // Upload the file to S3
        amazonS3.putObject(bucketName, fileName + fileType, file);
    }

    public String generatePresignedUrlWithExpiration(String fileName, String fileType, int expirationInMinutes) {
        Date expiration = new Date(System.currentTimeMillis() + 1000L * 60 * expirationInMinutes);
        return amazonS3.generatePresignedUrl(
                new GeneratePresignedUrlRequest(bucketName, fileName + fileType)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiration)
        ).toString();
    }
}
