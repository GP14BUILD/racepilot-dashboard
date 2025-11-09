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

export interface Maneuver {
  id: number;
  session_id: number;
  maneuver_type: string;  // 'tack', 'gybe', 'turn'
  start_ts: string;
  end_ts: string;
  angle_change_deg: number;
  entry_sog_kn: number;
  min_sog_kn: number;
  time_through_sec: number;
  speed_loss_kn: number;
  score_0_100: number;
  start_lat: number;
  start_lon: number;
  end_lat: number;
  end_lon: number;
  twd: number | null;
}

export interface ManeuverStats {
  session_id: number;
  total_maneuvers: number;
  tacks: number;
  gybes: number;
  turns: number;
  avg_tack_score: number | null;
  avg_gybe_score: number | null;
  avg_tack_time: number | null;
  avg_speed_loss: number | null;
  best_tack: {
    id: number;
    score: number;
    time: number;
    timestamp: string;
  } | null;
  worst_tack: {
    id: number;
    score: number;
    time: number;
    timestamp: string;
  } | null;
}

export interface PerformanceAnomaly {
  id: number;
  ts: string;
  lat: number;
  lon: number;
  actual_sog: number;
  expected_sog: number;
  deviation_kts: number;
  z_score: number;
  severity: 'minor' | 'moderate' | 'severe';
  possible_causes: string[];
  wind_speed?: number;
  wind_angle?: number;
}

export interface AnomalyDetectionResult {
  session_id: number;
  anomalies_detected: number;
  anomalies: PerformanceAnomaly[];
}

export interface CoachingRecommendation {
  id: number;
  ts: string;
  type: string;  // 'sail_higher', 'sail_lower', 'tack_now', 'wind_shift_detected', 'speed_mode', 'maneuver_review'
  priority: 'low' | 'medium' | 'high' | 'critical';
  text: string;
  confidence: number;  // 0-100
  reasoning: string;
  context: Record<string, any>;
  was_followed: number | null;
  dismissed: boolean;
}

export interface CoachingAnalysisResult {
  session_id: number;
  analyzed_at: string;
  current_conditions: {
    sog: number;
    tws: number;
    twa: number;
    vmg: number;
    sailing_mode: 'upwind' | 'downwind';
  };
  recommendations_count: number;
  recommendations: Array<{
    type: string;
    priority: string;
    text: string;
    confidence: number;
    reasoning: string;
  }>;
}

export interface WindShift {
  id: number;
  start_ts: string;
  end_ts: string;
  magnitude: number;
  direction: 'left' | 'right';
  type: 'persistent' | 'oscillating' | 'transient';
  confidence: number;
  twd_before: number;
  twd_after: number;
  avg_tws_before: number;
  avg_tws_after: number;
}

export interface WindPattern {
  session_id: number;
  analyzed_at: string;
  dominant_pattern: 'persistent_right' | 'persistent_left' | 'oscillating' | 'unstable' | 'stable';
  pattern_strength: number;
  is_oscillating: boolean;
  avg_oscillation_period: number | null;
  oscillation_amplitude: number | null;
  next_shift_prediction: 'left' | 'right' | 'stable' | null;
  prediction_confidence: number | null;
  total_shifts_detected: number;
  avg_shift_magnitude: number;
  wind_stability_score: number;
}
