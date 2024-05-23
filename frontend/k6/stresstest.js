import http from 'k6/http';
import { sleep, check } from 'k6';
import {environment} from "../environment/Environment";

export let options = {
    stages: [
        { duration: '1m', target: 50 }, // below normal load
        { duration: '90s', target: 50 },
        { duration: '2m', target: 100 }, // normal load
        { duration: '90s', target: 100 },
        { duration: '2m', target: 200 }, // around the breaking point
        { duration: '150s', target: 200 },
        { duration: '1m', target: 250 }, // beyond the breaking point
        { duration: '30s', target: 300 },
        { duration: '3m', target: 0 }, // scale down. Recovery stage.
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
