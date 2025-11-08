import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'

export default function App(){
  const mapRef = useRef(null)
  const [metrics, setMetrics] = useState({twd:230, tws:12, sog:6.8, ttl:0, bias:0, bestEnd:'—'})
  const [track, setTrack] = useState([])

  useEffect(()=>{
    const map = L.map('map').setView([50.763,-1.297], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map)
    mapRef.current = map
    return ()=> map.remove()
  }, [])

  useEffect(()=>{
    // demo track (client-side mock)
    let pts = []
    let lat = 50.763, lon = -1.297
    for(let i=0;i<200;i++){
      const hdg = 220 + i*0.5
      const sog = 6.5 + 0.2*Math.sin(i/10)
      const dms = sog * 0.514444
      lat += (dms * Math.cos(hdg*Math.PI/180)) / 111320
      lon += (dms * Math.sin(hdg*Math.PI/180)) / (111320*Math.cos(lat*Math.PI/180))
      pts.push([lat,lon])
    }
    setTrack(pts)
  }, [])

  useEffect(()=>{
    if(!mapRef.current || track.length===0) return
    const line = L.polyline(track, {weight:3}).addTo(mapRef.current)
    mapRef.current.fitBounds(line.getBounds())
    return ()=> { mapRef.current.removeLayer(line) }
  }, [track])

  return (
    <div>
      <div className="bar">
        <strong>RacePilot — Live Dashboard</strong>
      </div>
      <div className="panel">
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12}}>
          <Metric label="TWD" value={`${metrics.twd}°`} />
          <Metric label="TWS" value={`${metrics.tws} kn`} />
          <Metric label="SOG" value={`${metrics.sog.toFixed(1)} kn`} />
          <Metric label="Start Bias" value={`${metrics.bias.toFixed(1)}° (${metrics.bestEnd})`} />
        </div>
      </div>
      <div id="map"></div>
      <div className="panel">
        <p>This web dashboard shows a demo track. Hook it up to the backend for live analytics.</p>
      </div>
    </div>
  )
}

function Metric({label, value}){
  return (
    <div style={{background:'#f4f7fb', borderRadius:12, padding:12, color:'#000'}}>
      <div style={{opacity:0.6}}>{label}</div>
      <div style={{fontSize:24, fontWeight:700}}>{value}</div>
    </div>
  )
}
