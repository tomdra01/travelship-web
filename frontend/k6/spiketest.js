import http from 'k6/http';
import { sleep, check } from 'k6';
import {environment} from "../environment/Environment";

export let options = {
    stages: [
        { duration: '1m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 1 minute.
        { duration: '2m', target: 150 }, // stay at 150 users for 2 minutes
        { duration: '1m', target: 0 }, // ramp-down to 0 users
    ],
    thresholds: {
        'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    },
};

export default function () {
    let res = http.get(environment.httpUrl + '/travel/52');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
