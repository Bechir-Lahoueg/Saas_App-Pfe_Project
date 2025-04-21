require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./src/config/db');
const eurekaClient    = require('./src/utils/eurekaClient');
const paymentRoutes = require('./src/routes/paymentRoutes');

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
app.use('/payment', paymentRoutes);

// webhook endpoint
app.post('/payments/webhook', require('./controllers/webhookController'));

app.listen(process.env.PORT, () => {
  console.log(`Payment Service on port ${process.env.PORT}`);
  eurekaClient.register();

});