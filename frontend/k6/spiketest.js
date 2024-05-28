import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    stages: [
        { duration: '5s', target: 400 }, // 400 users for 5 seconds
        { duration: '7s', target: 750 }, // 750 users for 7 seconds
        { duration: '6s', target: 1000 }, // 1200 users for 6 seconds
        { duration: '15s', target: 0 }, // ramp-down to 0 users
    ],
    thresholds: {
        'http_req_duration': ['p(93)<3000'], // 95% of requests must complete below 3s
    },
};

export default function () {
    let res = http.get('http://164.68.109.76/travel/1');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
