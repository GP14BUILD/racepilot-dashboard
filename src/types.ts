export interface TrackPoint {
  ts: string;
  lat: number;
  lon: number;
  sog: number;
  cog: number;
  awa: number;
  aws: number;
  hdg: number;
  tws?: number;
  twa?: number;
}

export interface Session {
  id: number;
  user_id: number;
  boat_id: number;
  title: string;
  start_ts: string;
  end_ts?: string;
  created_at: string;
  points?: TrackPoint[];
}

export interface SessionStats {
  duration: string;
  distance: number;
  avgSpeed: number;
  maxSpeed: number;
  pointCount: number;
}

export interface RaceMark {
  id: number;
  course_id: number;
  name: string;
  lat: number;
  lon: number;
  mark_type: string;
  color: string;
  sequence: number;
  shape: string;
}

export interface RaceCourse {
  id: number;
  name: string;
  description: string | null;
  created_by: number;
  created_at: string;
  config_json: Record<string, any>;
  marks: RaceMark[];
}
