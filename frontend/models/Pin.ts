export interface Pin {
  id: number;
  type: string;
  title: string;
  description: string;
  x: number;
  y: number;
}

export interface DateSelection {
  arrival: string;
  departure: string;
}
