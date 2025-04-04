// Payment-Service/src/utils/eurekaServiceFinder.js
const eurekaClient = require('./eurekaClient').client;

class EurekaServiceFinder {
    static async getServiceUrl(serviceName) {
        return new Promise((resolve, reject) => {
            try {
                console.log(`Looking for service: ${serviceName}`);
                const eurekaServiceName = serviceName.toUpperCase();

                // Get instances directly
                const instances = eurekaClient.getInstancesByAppId(eurekaServiceName);

                if (!instances || instances.length === 0) {
                    console.error(`No instances of ${serviceName} found`);
                    return reject(new Error(`No instances found for ${serviceName}`));
                }

                console.log(`Found ${instances.length} instances of ${serviceName}`);

                // Always select the first instance
                const instance = instances[0];
                const serviceUrl = `http://${instance.ipAddr}:${instance.port.$}`;

                console.log(`Selected service URL: ${serviceUrl}`);
                resolve(serviceUrl);
            } catch (err) {
                console.error(`Error finding service ${serviceName}:`, err);
                reject(err);
            }
        });
    }
}

module.exports = EurekaServiceFinder;