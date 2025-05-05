// src/rabbitmq.js
const amqp = require('amqplib');

const EXCHANGE = 'payment.events';
const COMPLETED_QUEUE = 'payment.completed.queue';
const FAILED_QUEUE    = 'payment.failed.queue';

let channel;

async function connectRabbit() {
    // 1) connect & create a channel
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await conn.createChannel();

    // 2) declare a direct, durable exchange
    await channel.assertExchange(EXCHANGE, 'direct', { durable: true });

    // 3) declare the two queues
    await channel.assertQueue(COMPLETED_QUEUE, { durable: true });
    await channel.assertQueue(FAILED_QUEUE,    { durable: true });

    // 4) bind them to the exchange with their routing keys
    await channel.bindQueue(COMPLETED_QUEUE, EXCHANGE, 'payment.completed');
    await channel.bindQueue(FAILED_QUEUE,    EXCHANGE, 'payment.failed');

}

function publish(routingKey, payload) {
    if (!channel) throw new Error('Rabbit channel not initialized – call connectRabbit() first');
    const buf = Buffer.from(JSON.stringify(payload));
    channel.publish(EXCHANGE, routingKey, buf, { persistent: true });
}

module.exports = { connectRabbit, publish };
