// Payment-Service/src/services/tenantRegistrationService.js
const axios = require('axios');
const EurekaServiceFinder = require('../utils/eurekaServiceFinder');

const REGISTER_SERVICE_NAME = 'register-service';

const registerTenant = async (tenantData) => {
    try {
        console.log('Registering tenant after successful payment:', tenantData);

        // Get service URL from Eureka
        const serviceUrl = await EurekaServiceFinder.getServiceUrl(REGISTER_SERVICE_NAME);
        const registrationEndpoint = `${serviceUrl}/register/tenant/signup`;
        console.log(`Using Eureka discovered endpoint: ${registrationEndpoint}`);

        // Call registration service
        const response = await axios.post(registrationEndpoint, tenantData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 60000 // 60-second timeout for the API call
        });

        console.log('Tenant registration successful:', response.data);
        return response.data;
    } catch (error) {
        // Better error handling with specific source
        if (error.message.includes('No instances found')) {
            console.error('Service discovery failed:', error.message);
        } else if (error.response) {
            console.error('Registration API error:', error.response.data);
        } else {
            console.error('Tenant registration failed:', error.message);
        }
        throw new Error(`Registration failed: ${error.message}`);
    }
};

module.exports = { registerTenant };