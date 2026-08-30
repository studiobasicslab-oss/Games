/**
 * Geo Detective - Tactical Map & Recon Engine
 * Leaflet.js with Dark Matter, Satellite Imagery, Tactical Radar, and Google Maps Launchers.
 */

class GeoMapEngine {
    constructor() {
        this.map = null;
        this.markers = [];
        this.activeCase = null;
        this.currentLayer = 'dark';
        this.tileLayers = {};
        this.pingCircle = null;
        this.measureMode = false;
        this.measurePoints = [];
        this.measureLine = null;
    }

    init(containerId = 'recon-map', initialCoords = [48.8566, 2.3522], initialZoom = 5) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Base tile layers
        this.tileLayers = {
            dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://carto.com/">CARTO</a> | &copy; OpenStreetMap',
                maxZoom: 19,
                subdomains: 'abcd'
            }),
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                maxZoom: 18
            }),
            street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19
            }),
            topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap',
                maxZoom: 17
            })
        };

        this.map = L.map(containerId, {
            center: initialCoords,
            zoom: initialZoom,
            layers: [this.tileLayers.dark],
            zoomControl: false,
            attributionControl: false
        });

        // Add custom sleek zoom control in bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        // Update live coordinate HUD on mousemove
        this.map.on('mousemove', (e) => {
            const coordEl = document.getElementById('map-live-coords');
            if (coordEl) {
                coordEl.textContent = `${e.latlng.lat.toFixed(4)}° N, ${e.latlng.lng.toFixed(4)}° E`;
            }
        });

        // Click to measure or inspect
        this.map.on('click', (e) => {
            if (this.measureMode) {
                this.handleMeasureClick(e.latlng);
            }
        });

        // Ensure proper rendering if container resized
        setTimeout(() => {
            if (this.map) this.map.invalidateSize();
        }, 300);
    }

    setLayer(layerKey) {
        if (!this.map || !this.tileLayers[layerKey]) return;
        Object.values(this.tileLayers).forEach(layer => {
            if (this.map.hasLayer(layer)) {
                this.map.removeLayer(layer);
            }
        });
        this.tileLayers[layerKey].addTo(this.map);
        this.currentLayer = layerKey;
    }

    flyToLocation(lat, lng, zoom = 14) {
        if (!this.map) return;
        this.map.flyTo([lat, lng], zoom, {
            duration: 1.8,
            easeLinearity: 0.25
        });
    }

    // Add glowing tactical beacon marker
    addEvidenceMarker(lat, lng, title, subtitle = '', isSolved = false) {
        if (!this.map) return;

        const pulseColor = isSolved ? '#10b981' : '#f59e0b';
        const iconHtml = `
            <div class="tactical-pin-wrapper">
                <div class="tactical-radar-ring" style="border-color: ${pulseColor};"></div>
                <div class="tactical-pin-core" style="background: ${pulseColor}; box-shadow: 0 0 14px ${pulseColor};">
                    ${isSolved ? '✓' : '📍'}
                </div>
            </div>
        `;

        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'tactical-marker-custom',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18]
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
        marker.bindPopup(`
            <div class="tactical-popup">
                <div class="text-[10px] font-mono tracking-wider uppercase text-amber-400 font-bold">${isSolved ? 'VERIFIED EVIDENCE' : 'SURVEILLANCE SECTOR'}</div>
                <div class="font-bold text-slate-100 text-sm mt-0.5">${title}</div>
                ${subtitle ? `<div class="text-xs text-slate-400 mt-1">${subtitle}</div>` : ''}
                <div class="mt-2.5 pt-2 border-t border-slate-700 flex gap-2">
                    <button onclick="window.geoMapEngine.openGoogleMapsCoords(${lat}, ${lng})" class="text-[10px] font-mono px-2 py-1 bg-amber-500/20 text-amber-300 rounded hover:bg-amber-500/30 transition">
                        Google Maps ↗
                    </button>
                    <button onclick="window.geoMapEngine.openStreetView(${lat}, ${lng})" class="text-[10px] font-mono px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded hover:bg-cyan-500/30 transition">
                        Street View ↗
                    </button>
                </div>
            </div>
        `, { className: 'tactical-popup-container' });

        this.markers.push(marker);
        return marker;
    }

    clearMarkers() {
        this.markers.forEach(m => {
            if (this.map) this.map.removeLayer(m);
        });
        this.markers = [];
    }

    // Connect solved waypoints with forensic dashed line
    drawChainPolyline(points) {
        if (!this.map || points.length < 2) return;
        const latlngs = points.map(p => [p.lat, p.lng]);

        L.polyline(latlngs, {
            color: '#f59e0b',
            weight: 3,
            dashArray: '6, 8',
            opacity: 0.85
        }).addTo(this.map);
    }

    // Google Maps External Direct Launchers
    openGoogleMapsSearch(query) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    openGoogleMapsCoords(lat, lng) {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    openStreetView(lat, lng) {
        const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    openGoogleEarth(lat, lng) {
        const url = `https://earth.google.com/web/@${lat},${lng},150a,35y,0h,0t,0r`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    // Great circle haversine distance in kilometers
    static calculateDistanceKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    }
}

window.geoMapEngine = new GeoMapEngine();
