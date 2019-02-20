import Leaflet from './leaflet';
import {Kuzzle, WebSocket} from 'kuzzle-sdk';

const leaflet = new Leaflet([43.6108, 3.8767]);

// Connect to Kuzzle
const kuzzle = new Kuzzle(new WebSocket("localhost"));;

async function main () {
  await kuzzle.connect();
  // Create index and collection if needed
  createFixtures();

  // Create our new potential customer
  leaflet.setUserPosition([43.6108, 3.8767]);
  await kuzzle.document.createOrReplace('geoads', 'customers', 'user01', {
    location: {
      lat: 43.6108,
      lon: 3.8767
    }
  });

  // To simulate the change of the position of our user we click on the map
  // so let's add a listener to update the position of our user in Kuzzle
  leaflet.onUserLocationChange = async location => {
    await kuzzle.document.update('geoads', 'customers', 'user01', location);
  };

  // Add ads on the map
  leaflet.addAdvertiser([43.609620, 3.873612], 100);
  // Subscribe to it to know if we enter the zone
  kuzzle.realtime.subscribe('geoads', 'customers', {
    geoDistance: {
      location: {
        lat: 43.609620,
        lon: 3.873612
      },
      distance: '100m'
    }
  }, notif => {
    if (notif.scope === 'in') {
      showAd('caco-calo');
    } else {
      hideAd('caco-calo');
    }
  });

  leaflet.addAdvertiser([43.608590, 3.872460], 90);
  // Subscribe to it to know if we enter the zone
  kuzzle.realtime.subscribe('geoads', 'customers', {
    geoDistance: {
      location: {
        lat: 43.608590,
        lon: 3.872460
      },
      distance: '90m'
    }
  }, notif => {
    if (notif.scope === 'in') {
      showAd('moc-danold');
    } else {
      hideAd('moc-danold');
    }
  });


  leaflet.addAdvertiser([43.610354, 3.881771], 50);
  // Subscribe to it to know if we enter the zone
  kuzzle.realtime.subscribe('geoads', 'customers', {
    geoDistance: {
      location: {
        lat: 43.610354,
        lon: 3.881771
      },
      distance: '50m'
    }
  }, notif => {
    if (notif.scope === 'in') {
      showAd('nyk');
    } else {
      hideAd('nyk');
    }
  });
}

function showAd(name) {
  document.getElementById(name).style.visibility = 'visible';
}

function hideAd(name) {
  document.getElementById(name).style.visibility = 'hidden';
}

async function createFixtures() {
  try {
    await kuzzle.index.create('geoads');
  } catch (e) {}
  try {
    await kuzzle.collection.create('geoads', 'customers');
  } catch (e) {}
}

main();
