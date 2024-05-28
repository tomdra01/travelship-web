import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    vus:1000, // 1000 virtual users
    duration: '1m',
    thresholds: {
        'http_req_duration': ['p(90)<200'], // 90% of requests must complete below 200ms
    },
};

export default function () {
    let res = http.get("http://164.68.109.76/travel/1");
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
