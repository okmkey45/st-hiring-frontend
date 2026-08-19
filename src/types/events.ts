import { PaginatedResponse } from "./pagination";

export interface Event {
  id: number;
  name: string;
  date: Date;
  location: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PaginatedEvents = PaginatedResponse<Event>;
