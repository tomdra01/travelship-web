import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    vus:500, // 500 virtual users
    duration: '1m',
    thresholds: {
        'http_req_duration': ['p(89)<1000'], // 89% of requests must complete below 1s
    },
};

export default function () {
    let res = http.get("http://164.68.109.76/travel/1");
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
