import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    stages: [
        { duration: '7s', target: 20 },  // 20 users for 7 seconds
        { duration: '15s', target: 60 },  // 60 users for 15 seconds
        { duration: '7s', target: 100 },  // 100 users for 15 seconds
        { duration: '15s', target: 5 },   // 5 users for 15 seconds
    ],
    thresholds: {
        'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    },
};

export default function () {
    let response = http.get('http://164.68.109.76/travel/1');

    check(response, {
        'is status 200': (r) => r.status === 200,
    });

    // Think time
    sleep(1);
}
