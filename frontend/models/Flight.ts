export interface FlightData {
  day: string;
  group: string;
  price: number;
}

export interface FlightResponse {
  data: FlightData[];
  status: boolean;
  message: string;
}
