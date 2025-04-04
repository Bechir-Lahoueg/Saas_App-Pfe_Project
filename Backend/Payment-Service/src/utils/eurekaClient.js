// Payment-Service/src/utils/eurekaClient.js
const { Eureka } = require('eureka-js-client');

// Eureka client configuration
const eurekaClient = new Eureka({
  instance: {
    app: 'Payment-Service',
    instanceId: `payment-service`,
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: `http://localhost:${process.env.PORT}`,
    port: {
      '$': process.env.PORT,
      '@enabled': 'true'
    },
    vipAddress: 'payment-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/'
  }
});

// Start the Eureka client
const registerWithEureka = () => {
  eurekaClient.start((error) => {
    if (error) {
      console.error('Eureka registration failed:', error);
    } else {
      console.log('Successfully registered with Eureka');
    }
  });
};

// Export both the function and the client
module.exports = {
  register: registerWithEureka,
  client: eurekaClient
};