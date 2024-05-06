import { Injectable } from '@angular/core';
import * as ct from 'countries-and-timezones';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
  constructor() { }

  getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  getCountryByTimezone(timezone: string): { name: string, code: string } | undefined {
    const timezoneData = ct.getTimezone(timezone);
    if (!timezoneData || !timezoneData.countries.length) {
      console.error('No country data found for this timezone:', timezone);
      return undefined;
    }

    const countryCode = timezoneData.countries[0];
    const country = ct.getCountry(countryCode);
    if (!country) {
      console.error('Country not found for code:', countryCode);
      return undefined;
    }

    return { name: country.name, code: country.id };
  }
}
