class CloudWatchService {
    constructor(aws, config) {
        this.aws = aws;
        this.client = new this.aws.CloudWatch({
            "accessKeyId": config.accessKeyId,
            "secretAccessKey": config.secretAccessKey,
            "region": config.region
        });
    }
}

module.exports = CloudWatchService;