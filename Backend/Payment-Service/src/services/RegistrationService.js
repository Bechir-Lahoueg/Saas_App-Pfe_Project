// const axios = require('axios');
//
// // Registration service URL from environment variables
// const REGISTRATION_SERVICE_URL = process.env.REGISTRATION_SERVICE_URL ;
//
// /**
//  * Handles tenant registration after successful payment
//  */
// const registerTenant = async (tenantData) => {
//   try {
//     console.log('Registering tenant with data:', tenantData);
//
//     // Call the Registration Service API to create a new tenant
//     const response = await axios.post(`${REGISTRATION_SERVICE_URL}/tenant/signup`, tenantData, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//
//     console.log('Tenant registration successful:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error registering tenant:', error.response ? error.response.data : error.message);
//     throw new Error(`Failed to register tenant: ${error.message}`);
//   }
// };
//
// module.exports = {
//   registerTenant,
// };
