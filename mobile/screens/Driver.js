import React, { useState, useEffect } from 'react';
import {
    Platform,
    StyleSheet,
    PermissionsAndroid,
    Image,
    View,
    Alert,
    Text,
    TextInput,
    Linking,
    ActivityIndicator,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import Geolocation from '@react-native-community/geolocation';
import BottomButton from "../components/BottomButton";
import PolyLine from '@mapbox/polyline';
import KEY from '../google_api_key';
import IO from 'socket.io-client';

const Driver = () => {
    const apiKey = KEY;
    let endMarker = null;
    let startMarker = null;
    let findingPassengerActIndicator = null;
    let passengerSearchText = "FIND PASSENGERS 👥";

    const [lat, setLatitude] = useState({ latitude: null });
    const [long, setLongitude] = useState({ longitude: null });
    const [error, setError] = useState({ error: null });
    const [point, setPointCoords] = useState({ pointCoords: [] });
    const [passenger, setPassenger] = useState({ lookingForPassenger: false });
    const [pass, setPassengerFound] = useState({ passengerFound: false });

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

        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 50,
            debug: false,
            startOnBoot: false,
            stopOnTerminate: true,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            stopOnStillActivity: false,
        });

        BackgroundGeolocation.on('authorization', (status) => {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
            if (status !== BackgroundGeolocation.AUTHORIZED) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(() =>
                    Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
                        { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
                        { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
                    ]), 1000);
            }
        });

        return () => {
            // unregister all event listeners
            BackgroundGeolocation.removeAllListeners();
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

    getRouteDirections = async (destinationPlaceId) => {
        try {
            const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat.latitude},${long.longitude}&destination=place_id:${destinationPlaceId}&key=${apiKey}`;
            const response = await fetch(apiUrl);
            const responseJson = await response.json();
            const points = PolyLine.decode(responseJson.routes[0].overview_polyline.points);
            const pointCoords = points.map(point => { return { latitude: point[0], longitude: point[1] } });
            setPointCoords({ pointCoords })
            Driver.map.fitToCoordinates(pointCoords, {
                edgePadding: { top: 140, bottom: 20, left: 20, right: 20 }
            });
        } catch (error) {
            console.log('driver', error);
        }
    }

    lookForPassengers = async () => {
        setPassenger({ lookingForPassenger: true });
        Driver.socket = IO('http://192.168.0.85:3000'); // 192.168.43.240  192.168.0.114
        Driver.socket.on('connect', () => {
            console.log('driver connected');
            Driver.socket.emit('lookingForPassenger');
        });
        Driver.socket.on('taxiRequest', routeResponse => {
            console.log('driver', routeResponse);
            getRouteDirections(routeResponse.geocoded_waypoints[0].place_id);
            setPassenger({ lookingForPassenger: false });
            setPassengerFound({ passengerFound: true });
        });
    }

    acceptPassengerRequest = () => { // 
        const passengerLocation = point.pointCoords[
            point.pointCoords.length - 1
        ];

        BackgroundGeolocation.on("location", location => {

            //   Send driver location to passenger
            Driver.socket.emit("driverLocation", {
                latitude: location.latitude,
                longitude: location.longitude
            });

        });

        BackgroundGeolocation.checkStatus(status => {
            // you don't need to check status before start (this is just the example)
            if (!status.isRunning) {
                BackgroundGeolocation.start(); //triggers start on start event
            }
        });

        if (Platform.OS === "ios") {
            // maps://app?saddr=100+101&daddr=100+102
            Linking.openURL(
                `http://maps.apple.com/?daddr=${passengerLocation.latitude},${
                passengerLocation.longitude
                }`
            );
        } else {
            Linking.openURL(
                `google.navigation:q=${
                passengerLocation.latitude
                },${passengerLocation.longitude}`
            );
        }
    }


    if (point.pointCoords.length > 1) {
        endMarker = (
            <Marker
                coordinate={point.pointCoords[point.pointCoords.length - 1]}
            >
                <Image
                    style={{ width: 40, height: 40 }}
                    source={require("../images/person-marker.png")}
                />
            </Marker>
        );
    }

    let bottomButtonFunction = lookForPassengers;
    if (pass.passengerFound) {
        passengerSearchText = "FOUND PASSENGER! ACCEPT RIDE?";
        bottomButtonFunction = acceptPassengerRequest;
    }

    if (passenger.lookingForPassenger) {
        passengerSearchText = "FINDING PASSENGERS..."
        findingPassengerActIndicator = (
            <ActivityIndicator
                size="large"
                animating={passenger.lookingForPassenger}
            />
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
                ref={map => Driver.map = map}
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
                {endMarker}
                {startMarker}
            </MapView>
            <BottomButton
                onPressFunction={bottomButtonFunction}
                buttonText={passengerSearchText}
            >
                {findingPassengerActIndicator}
            </BottomButton>
        </View>
    );

}

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

export default Driver;
