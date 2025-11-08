# RacePilot - World-Class Features Roadmap

## ✅ Completed Features

### Backend (FastAPI + SQLite + Railway)
- [x] Session management with GPS tracking
- [x] Telemetry data ingestion (real-time)
- [x] Database models for:
  - Users, Boats, Sessions, TrackPoints
  - **NEW:** RaceCourse, RaceMark, StartLine
  - **NEW:** WeatherData, TacticalEvent
  - Polar diagrams for performance
- [x] API endpoints for race courses and marks
- [x] Start line bias calculation
- [x] CORS enabled for cross-origin requests

### Mobile App (React Native + Expo)
- [x] GPS tracking with background support
- [x] Bluetooth wind sensor integration (AWS, AWA, TWS, TWA)
- [x] Real-time telemetry streaming to backend
- [x] Session start/stop controls
- [x] Telemetry buffering and batch uploads
- [x] Permissions handling (Location, Bluetooth)

### Dashboard (React + Vite + Leaflet + Vercel)
- [x] Session list with search/filter
- [x] GPS track visualization on Leaflet map
- [x] Speed-over-time charts (Recharts)
- [x] Distance, avg/max speed statistics
- [x] TypeScript types for all data models
- [x] **NEW:** Tactical analytics utilities:
  - VMG (Velocity Made Good) calculator
  - Layline projection
  - Tack detection and analysis
  - Wind shift detection
  - Start line bias calculator
  - Performance percentage vs polars
  - Optimal tacking angle calculator

## 🚧 In Progress

### Dashboard Enhancements
- [x] Enhanced SessionPage with race marks overlay
- [x] Wind visualization layer
- [x] Laylines display (port/starboard)
- [x] Tactical overlay toggle controls
- [x] Course selection dropdown
- [x] API integration for race courses
- [ ] Tack markers on map
- [ ] VMG graph alongside speed graph
- [ ] Race replay with animation controls
- [ ] AI insights integration

### Mobile App Enhancements
- [x] Course Setup Screen - sail to marks and record GPS
- [ ] Integration into main App navigation
- [ ] GitHub repository creation and deployment

## 📋 Planned Features

### Professional Racing Features
1. **Race Course Management**
   - Create custom race courses
   - Add/edit marks with colors and shapes
   - Windward-leeward, triangle, and custom courses
   - Mark rounding detection
   - Course templates library

2. **Advanced Tactics Display**
   - Real-time laylines with wind shifts
   - VMG polar diagram
   - Tacking angles and efficiency
   - Optimal route suggestions
   - Wind gradient visualization
   - Current flow overlay

3. **Start Line Analysis**
   - Line bias calculator with visualization
   - Time-to-line countdown
   - Favored end indicator
   - Distance to line tracker
   - Start sequence timer

4. **Performance Analytics**
   - Speed vs. polar comparison
   - VMG upwind/downwind tracking
   - Tacking efficiency scores
   - Pointing angle analysis
   - Speed loss in maneuvers
   - Trim optimization hints

5. **Race Replay & Analysis**
   - Animated playback with speed control
   - Tactical decision markers
   - Gain/loss heatmap
   - Wind shift annotations
   - Split times at marks
   - Comparison with competitors

6. **Weather Integration**
   - Real-time wind forecast
   - Weather routing
   - Tide and current data
   - Wave height/period
   - Historical weather overlay

7. **AI Race Coach**
   - Start strategy recommendations
   - Tactical call-outs (tack/hold)
   - Wind shift predictions
   - Optimal layline timing
   - Post-race debrief insights
   - Performance improvement tips

8. **Multi-Boat Features**
   - Fleet tracking on same race
   - Competitor comparison
   - Relative positioning
   - Crossing situations
   - Overlap detection
   - Protest flagging

9. **Social & Sharing**
   - Share race replays
   - Leaderboards
   - Club/regatta integration
   - Race reports with PDF export
   - Social media integration
   - Achievement badges

10. **Advanced Data Viz**
    - 3D race course visualization
    - Polar speed diagrams
    - Wind rose charts
    - Performance spider graphs
    - Time-series analytics
    - Custom dashboard widgets

## 🎯 Next Immediate Steps

1. **Complete Dashboard Enhancement** (Current Sprint)
   - Finish RaceMarksOverlay component
   - Add wind visualization
   - Implement laylines display
   - Create race replay controls
   - Integrate AI insights panel

2. **Deploy & Test**
   - Deploy backend updates to Railway
   - Deploy dashboard to Vercel
   - Test with real sailing data
   - Gather user feedback

3. **Mobile App Enhancements**
   - Add live map view
   - Display laylines in real-time
   - Start line countdown timer
   - Tactical alerts (vibration/sound)

4. **Performance Optimization**
   - Add database indexes
   - Implement data caching
   - Optimize map rendering
   - Reduce API call frequency

## 🏆 Differentiators (World-Class Features)

What makes RacePilot world-class:

1. **Real-time Tactical Guidance** - Live laylines, wind shifts, VMG optimization
2. **AI-Powered Coaching** - Machine learning recommendations during and after races
3. **Bluetooth Wind Integration** - Direct sensor support for true wind data
4. **Professional Analytics** - Tools used by Olympic sailors
5. **Multi-Platform** - Mobile tracking + Web analysis
6. **Open Data Format** - Export to industry-standard formats
7. **Offline-First Mobile** - Works without cellular connection
8. **Race Committee Tools** - Course setup, fleet management
9. **Community Features** - Share, compare, learn from others
10. **Affordable Access** - Pro-level tools at grassroots pricing

## 📊 Tech Stack

- **Backend:** FastAPI (Python), SQLAlchemy, SQLite → PostgreSQL
- **Mobile:** React Native, Expo, Bluetooth LE
- **Dashboard:** React, TypeScript, Vite, Leaflet, Recharts
- **AI/ML:** OpenAI GPT-4 for insights, custom ML models for predictions
- **Hosting:** Railway (backend), Vercel (dashboard), Expo (mobile dist)
- **Maps:** OpenStreetMap (Leaflet), future: Mapbox for custom layers

## 🔐 Security & Privacy

- User authentication (JWT tokens)
- Data encryption at rest and in transit
- GDPR compliant data handling
- Option for private/public sessions
- No tracking without consent

## 💰 Monetization Strategy

- Free tier: Basic tracking and analysis
- Pro tier: Advanced tactics, AI coaching, unlimited history
- Club tier: Fleet management, regatta tools
- API access for third-party integrations

---

**Last Updated:** November 8, 2025
**Version:** 0.2.0 (Major Feature Update)
