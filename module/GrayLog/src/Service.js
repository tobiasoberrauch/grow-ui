class GrayLogService {
    constructor(config) {
        let grayLogClientFactory = require('./Client');

        this.grayLogClient = grayLogClientFactory.connect(config);
    }

    getClient() {
        return this.grayLogClient;
    }

    getDashboards(cb) {
        this.grayLogClient.getDashboards(cb);
    }

    getDashboard(dashboardId, cb) {
        this.grayLogClient.getDashboard({
            dashboardId: dashboardId
        }, cb);
    }

    getStreams(cb) {
        this.grayLogClient.getStreams(cb);
    }

    getClusterHealth(cb) {
        this.grayLogClient.getClusterHealth(cb);
    }

    getStream(streamId, cb) {
        this.grayLogClient.getStream({
            streamId: streamId
        }, cb);
    }

    getStreamThroughput(streamId, cb) {
        this.grayLogClient.getStreamThroughput({
            streamId: streamId
        }, cb);
    }

    getAlarmCallbacks(streamId, cb) {
        this.grayLogClient.getAlarmCallbacks({
            streamId: streamId
        }, cb);
    }

    getAlarmCallbacksAvailable(streamId, cb) {
        this.grayLogClient.getAlarmCallbacksAvailable({
            streamId: streamId
        }, cb);
    }

    getAlerts(streamId, cb) {
        this.grayLogClient.getAlerts({
            streamId: streamId
        }, cb);
    }

    getAlertsCheck(streamId, cb) {
        this.grayLogClient.getAlertsCheck({
            streamId: streamId
        }, cb);
    }

    getAlertConditions(streamId, cb) {
        this.grayLogClient.getAlertConditions({
            streamId: streamId
        }, cb);
    }
}

module.exports = GrayLogService;