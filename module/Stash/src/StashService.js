import config from "../../config.json";
import stashRestApi from "stash-rest-api";

export default class StashService {
    constructor(config) {
        this.client = new stashRestApi.Client(
            config.atlassian.bitbucket.url,
            config.atlassian.user,
            config.atlassian.pass
        );

        this.repositories = this.client.repos.getCombined().then(function () {
            console.log('success',arguments);
        }, function () {
            console.log('error',arguments);
        });
    }

    getRepositories() {
        return this.repositories;
    }

    getClient() {
        return this.client;
    }
}
