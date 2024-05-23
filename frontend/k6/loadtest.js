import http from 'k6/http';
import { sleep, check } from 'k6';
import {environment} from "../environment/Environment";

export let options = {
    vus:50, // 50 virtual users
    duration: '3m', // duration of the test is 3 minutes
    thresholds: {
        'http_req_duration': ['p(90)<200'], // 90% of requests must complete below 200ms
    },
};

export default function () {
    let res = http.get(environment.httpUrl + '/travel/52');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
