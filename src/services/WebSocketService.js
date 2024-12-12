import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client;

export function connect(onConnectCallback) {
    console.log("entry connect func");
    client = new Client({
        webSocketFactory: () => new SockJS('http://MindBalancer-1357167474.us-east-1.elb.amazonaws.com/ws'),
        onConnect: () => {
            console.log('Connected');
            onConnectCallback();
        },
        onStompError: (error) => {
            console.error('STOMP error', error);
        }
    });

    client.activate();
}


export function sendMessage(destination, body) {
    if (client && client.connected) {
        client.publish({ destination, body });
    } else {
        console.error('STOMP client not connected, retrying...');
        setTimeout(() => {
            if (client && client.connected) {
                client.publish({ destination, body });
            }
        }, 1000); // Reintenta después de 1 segundo
    }
}

export function subscribeToTopic(destination, callback) {
    if (client && client.connected) {
        client.subscribe(destination, callback);
    } else {
        console.error('STOMP client not connected, retrying subscription...');
        setTimeout(() => {
            if (client && client.connected) {
                client.subscribe(destination, callback);
            }
        }, 1000); // Reintenta después de 1 segundo
    }
}

