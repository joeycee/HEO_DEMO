export type ObjectStatus = "active" | "warning" | "offline";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface ApiResponse<T> {
  data: T;
  status: "success";
  message?: string;
}

export interface SpaceObject {
  id: string;
  name: string;
  status: ObjectStatus;
  altitude: number;
  lastUpdated: string;
  riskLevel: RiskLevel;
  imageUrl: string;
  imageHistory: ObjectImage[];
  description: string;
  category: string;
  velocity: string;
  inclination: string;
  owner: string;
  telemetryHealth: number;
  favourite: boolean;
  globe: GlobePosition;
  timeline: ActivityEvent[];
}

export interface ObjectImage {
  id: string;
  title: string;
  capturedAt: string;
  url: string;
}

export interface GlobePosition {
  latitude: number;
  longitude: number;
  orbitalRadius: number;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
}

export type SolarEventType = "FLR" | "CME" | "GST" | "SEP" | "RBE" | "HSS" | "Notification";

export type SolarEventRisk = "low" | "medium" | "high";

export interface SolarEvent {
  id: string;
  type: SolarEventType;
  title: string;
  occurredAt: string;
  source: string;
  risk: SolarEventRisk;
  summary: string;
  satelliteEffect: string;
  metricLabel: string;
  metricValue: string;
  link?: string;
}
