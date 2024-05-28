const express = require('express');
const { Kafka } = require('kafkajs');

app = express();

const kafka = new Kafka({
    clientId: 'myapp',
    brokers: ['kafka:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', 
(req, res) => res.send('Dockerizing Node Application'))

app.post('/send-message', async (req, res) => {
    const { message } = req.body;
  
    try {
      await producer.send({
        topic: 'my-topic',
        messages: [{ value: message }],
      });
  
      res.send('Message sent to Kafka topic');
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
      res.status(500).send('Error sending message to Kafka');
    }
});

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value.toString(),
        });
      },
    });
};

const run = async () => {
    await runConsumer();
    await producer.connect();
  
    // Start the Express server
    app.listen(8000, () => console.log(`[bootup]: Server is running at port: 8000`));
};

run().catch(error => console.error('Error starting server:', error));
