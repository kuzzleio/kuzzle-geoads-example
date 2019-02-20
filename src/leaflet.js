import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class Leaflet {
  constructor (defaultCenter) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
    
    this.map = L.map('map');
    const defaultZoom = 16;
    const basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    this.map.setView(defaultCenter, defaultZoom);
    
    basemap.addTo(this.map);

    this.onUserLocationChange = async () => {};
    this.map.on('click', async e => {
      this.map.removeLayer(this.marker);
      this.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      await this.onUserLocationChange({
        location: {
          lat: e.latlng.lat,
          lon: e.latlng.lng
        }
      });
    });

    this.ads = {};
  }

  setUserPosition (pos) {
    try {
      this.map.removeLayer(this.marker);
    } catch (e) {}
    this.marker = L.marker(pos).addTo(this.map);
  }

  addAdvertiser(location, radius) {
    L.circle(location, {
      radius
    }).addTo(this.map);
  }
};

export default Leaflet;