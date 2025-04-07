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
        console.log(`Calling registration service at: ${registrationEndpoint}`);

        // Call registration service
        const response = await axios.post(registrationEndpoint, tenantData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000 // 30-second timeout is sufficient
        });

        console.log('Tenant registration successful:', response.data);
        return response.data;
    } catch (error) {
        // Improved error handling
        if (error.response) {
            console.error('Registration API error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('No response received from registration service');
        } else {
            console.error('Tenant registration failed:', error.message);
        }
        throw new Error(`Registration failed: ${error.message}`);
    }
};

module.exports = { registerTenant };