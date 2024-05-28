import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'myapp',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

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
};

run().catch(error => console.error('Error starting server:', error));
