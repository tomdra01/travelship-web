import http from 'k6/http';
import { sleep, check } from 'k6';
import {environment} from "../environment/Environment";

export let options = {
    stages: [
        { duration: '15s', target: 20 },  // Ramp up to 20 users over 2 minutes
        { duration: '2m', target: 20 },  // Stay at 20 users for 1 hour
        { duration: '15s', target: 0 },   // Ramp down to 0 users over 2 minutes
    ],
    thresholds: {
        'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    },
};

export default function () {
    let response = http.get(environment.httpUrl + '/travel/52');

    check(response, {
        'is status 200': (r) => r.status === 200,
    });

    // Think time
    sleep(1);
}
