import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'myapp',
    brokers: ['kafka:9092']
});

const producer = kafka.producer();

const run = async () => {
    await producer
        .connect()
        .catch((e) => console.error('error connecting to kafka', e));

    for(let i = 0; i < 10; i++){
        await producer.send({
            topic: 'my-topic',
            messages: [
                {key: i.toString(), value: JSON.stringify(`This is message number ${i}`) }
            ],
        });
    }
};

run().catch(error => console.error('Error starting server:', error));
