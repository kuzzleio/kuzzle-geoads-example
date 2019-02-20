const {Kuzzle, WebSocket} = require('kuzzle-sdk');

//Connect to Kuzzle
var kuzzle;

async function test() {
  kuzzle = new Kuzzle(new WebSocket("localhost"));
  await kuzzle.connect();
  subscribe();
}

async function publish() {
  //Create the user's location: they are inside the circular area
  var bigBen = {
      lat: 51.510357,
      lon: -0.116773
  };
  var currentLocation = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      location: bigBen
  };

  return await kuzzle
    .document
    .create('my-index', 'my-collection', currentLocation, '326c8f08-63b0-429f-8917-b782d30930e9', {ifExist:"replace"})
    .then(async () => {
      var hydePark = {
          lat: 51.507268,
          lon: -0.165730
      };

      var newLocation =  {location: hydePark};

      //Update the user's location: now they are outside the circular area -> This will trigger the notification
      return kuzzle
        .document
        .update('my-index', 'my-collection', '326c8f08-63b0-429f-8917-b782d30930e9', newLocation);
    });
}

async function subscribe() {
  //Create a filter that defines the circular area around Big Ben
  var bigBen = {
      lat: 51.510357,
      lon: -0.116773
  };
  var filter = {
      geoDistance: {
      location: bigBen,
      distance: '2km'
    }
  };

  //Create a subscription that triggers a notification when a user the circular area
  await kuzzle
    .realtime
    .subscribe('my-index', 'my-collection', filter, (error, result) => {
      // triggered each time the user leaves the circular area around Big Ben
      if (error) {
          // Handle error
          console.error(error);
      }
      else {
        // Do something with result
        console.log('User has left Big Ben', result);
      }
    }, {scope: "out"});
    publish();
}

test();

