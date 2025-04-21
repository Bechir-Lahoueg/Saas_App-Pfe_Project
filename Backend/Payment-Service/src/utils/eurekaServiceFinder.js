// src/utils/eurekaServiceFinder.js
const eurekaClient = require('./eurekaClient').client;

class EurekaServiceFinder {
    static async getServiceUrl(serviceName) {
        return new Promise((resolve, reject) => {
            try {
                const eurekaServiceName = serviceName.toUpperCase();
                const instances = eurekaClient.getInstancesByAppId(eurekaServiceName);

                if (!instances || instances.length === 0) {
                    return reject(new Error(`No instances found for ${serviceName}`));
                }

                // Sélectionner la première instance
                const instance = instances[0];
                const serviceUrl = `http://${instance.ipAddr}:${instance.port.$}`;

                resolve(serviceUrl);
            } catch (err) {
                console.error(`Error finding service ${serviceName}:`, err);
                reject(err);
            }
        });
    }
}

module.exports = EurekaServiceFinder;