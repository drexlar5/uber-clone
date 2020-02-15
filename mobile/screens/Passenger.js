import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Platform,
  TextInput,
  PermissionsAndroid,
  Image,
  ActivityIndicator,
  Text,
  Keyboard,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import BottomButton from "../components/BottomButton";
import PolyLine from '@mapbox/polyline';
import KEY from '../google_api_key';
import IO from 'socket.io-client';

const Passenger = () => {
  const apiKey = KEY;
  let marker = null;
  let getDriver = null;
  let findingDriverActIndicator = null;
  let driverMarker = null;
  // let driverButton = null;

  const [lat, setLatitude] = useState({ latitude: null });
  const [long, setLongitude] = useState({ longitude: null });
  const [error, setError] = useState({ error: null });
  const [dest, setDestination] = useState({ destination: '' });
  const [pos, setPosition] = useState({ position: '' });
  const [predict, setPredictions] = useState({ predictions: [] });
  const [point, setPointCoords] = useState({ pointCoords: [] });
  const [route, setRouteResponse] = useState({ routeResponse: {} });
  const [driver, setDriver] = useState({ lookingForDriver: false });
  const [drivercoming, setDriverComing] = useState({ driverIsOnTheWay: false });
  const [location, setDriverlocation] = useState({ driverLocation: {} });
  const [loc, setLocationFound] = useState({ noLocationFound: false });

  useEffect(() => {
    let that = this;

    if (Platform.OS === 'ios') {
      this.callLocation(that);
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            'title': 'Location Access Required',
            'message': 'This App needs to Access your location'
          }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            this.callLocation(that);
          } else {
            alert("Permission Denied");
          }
        } catch (err) {
          // alert("err", err);
          console.warn(err)
        }
      }
      requestLocationPermission();
    }

    return () => {
      Geolocation.clearWatch(this.watchId);
    }
  }, []);

  callLocation = (that) => {
    //alert("callLocation Called");
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        //Setting state Longitude to re re-render the Longitude Text
        setLatitude({
          latitude: position.coords.latitude
        });
        //Setting state Latitude to re re-render the Longitude Text
        setLongitude({
          longitude: position.coords.longitude
        });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    that.watchID = Geolocation.watchPosition((position) => {
      //Will give you the location on location change
      console.log(position);
      //Setting state Longitude to re re-render the Longitude Text
      setLatitude({
        latitude: position.coords.latitude
      });
      //Setting state Latitude to re re-render the Longitude Text
      setLongitude({
        longitude: position.coords.longitude
      });
    });
  }

  getRouteDirections = async (destinationPlaceId, destinationName) => {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat.latitude},${long.longitude}&destination=place_id:${destinationPlaceId}&key=${apiKey}`;
      const response = await fetch(apiUrl);
      const responseJson = await response.json();
      const points = PolyLine.decode(responseJson.routes[0].overview_polyline.points);
      const pointCoords = points.map(point => { return { latitude: point[0], longitude: point[1] } });
      setPointCoords({ pointCoords });
      setPredictions({ predictions: [] });
      setDestination({ destination: destinationName });
      setRouteResponse({ routeResponse: responseJson });
      Keyboard.dismiss();
      Passenger.map.fitToCoordinates(pointCoords, {
        edgePadding: { top: 140, bottom: 20, left: 20, right: 20 }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onChangeDestination = async (destination) => {
    setDestination({ destination })
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${destination}&location=${lat.latitude},${long.longitude}&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      setPredictions({ predictions: json.predictions })
    } catch (error) {
      console.log(error)
    }
  }

  requestDriver = async () => {
    setDriver({ lookingForDriver: true });
    try {
      const socket = IO('http://192.168.0.85:3000');
      socket.on('connect', () => {
        console.log('user connected');
        // Request Taxi
        socket.emit('taxiRequest', route.routeResponse)
      });

      socket.on("driverLocation", driverLocation => {
        console.log('getting driver location')
        const pointCoords = [...point.pointCoords, driverLocation];
        Passenger.map.fitToCoordinates(pointCoords, {
          edgePadding: { top: 140, bottom: 20, left: 20, right: 20 }
        });
        setDriver({ lookingForDriver: false })
        setDriverComing({ driverIsOnTheWay: true })
        setDriverlocation({ driverLocation })
      });
    } catch (error) {
      console.log(error)
    }
  }

  const predictionsText = predict.predictions ? predict.predictions.map(
    prediction =>
      <TouchableHighlight
        style={{
          width: '95%',
          marginRight: 5,
        }}
        key={prediction.id}
        onPress={() => getRouteDirections(prediction.place_id, prediction.structured_formatting.main_text)}
      >
        <Text
          style={styles.suggestions}
        >

          {/* incase you want to use this {prediction.description} */}
          {prediction.structured_formatting.main_text}
        </Text>
      </TouchableHighlight>) : null

  if (driver.lookingForDriver) {
    findingDriverActIndicator = (
      <ActivityIndicator
        size="large"
        animating={driver.lookingForDriver}
      />
    );
  }

  if (point.pointCoords.length > 1) {
    marker = (
      <Marker
        coordinate={point.pointCoords[point.pointCoords.length - 1]}
      />
    );
    getDriver = (
      <BottomButton
        onPressFunction={() => requestDriver()}
        buttonText="REQUEST 🚗"
      >
        {findingDriverActIndicator}
      </BottomButton>
    );
  }

  if (drivercoming.driverIsOnTheWay) {
    driverMarker = (
      <Marker
        coordinate={{
          latitude: location.driverLocation.latitude ? Number(location.driverLocation.latitude) : 0,
          longitude: location.driverLocation.longitude ? Number(location.driverLocation.longitude) : 0
        }}>
        <Image
          source={require("../images/carIcon.png")}
          style={{ width: 40, height: 40 }}
        />
      </Marker>
    );
  }

  const blankView = (
    <View>
      <Text
        style={{
          fontSize: 26,
          textAlign: 'center',
          marginBottom: 10
        }}>
        Getting current location...
        </Text>
      <Text
        style={{
          fontSize: 18,
          textAlign: 'center'
        }}>
        If you have not enabled your location please enable it now
        </Text>
      <ActivityIndicator
        size="large"
        animating={true}
      />
    </View>
  );

  if (!lat.latitude || !long.longitude) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 9
        }}
      >
        {blankView}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={map => Passenger.map = map}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        initialRegion={{
          latitude: lat.latitude,
          longitude: long.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
      >
        <Polyline
          coordinates={point.pointCoords}
          strokeWidth={4}
          strokeColor="red"
        />
        {marker}
        {driverMarker}
      </MapView>
      <TextInput
        placeholder='Enter destination...'
        style={styles.destinationInput}
        clearButtonMode="always"
        value={dest.destination}
        onChangeText={destination => onChangeDestination(destination)}
      />
      <View style={styles.sugestionsView}>{predictionsText}</View>
      {getDriver}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  destinationInput: {
    position: 'absolute',
    top: 0,
    height: 40,
    borderWidth: 1,
    width: '98%',
    padding: 5,
    borderRadius: 10,
    marginTop: 48,
    marginHorizontal: 5,
    backgroundColor: 'white',
  },
  suggestions: {
    backgroundColor: 'white',
    padding: 5,
    width: '95%',
    fontSize: 18,
    marginHorizontal: 5,
    borderWidth: 0.5
  },
  sugestionsView: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    marginTop: 88,
    paddingLeft: 9,
  },
  buttomButton: {
    backgroundColor: 'black',
    margin: 20,
    padding: 15,
    paddingHorizontal: 30
  },
  buttomButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Passenger;
