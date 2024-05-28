import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    stages: [
        { duration: '5s', target: 150 }, // 150 users for 5 seconds
        { duration: '6s', target: 300 }, // 300 users for 6 seconds
        { duration: '8s', target: 500 }, // 500 users for 8 seconds
        { duration: '15s', target: 0 }, // ramp-down to 0 users
    ],
    thresholds: {
        'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    },
};

export default function () {
    let res = http.get('http://164.68.109.76/travel/1');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
