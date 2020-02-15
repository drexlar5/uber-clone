/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import Passenger from './screens/Passenger';
import Driver from './screens/Driver';

const App = () => {
  
  const [passenger, setPassenger] = useState({isPassenger: false});
  const [driver, setDriver] = useState({isDriver: false});

  if (passenger.isPassenger) {
    return <Passenger />
  }

  if (driver.isDriver) {
    return <Driver />
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setPassenger({isPassenger: true})} style={styles.btn}>
        <View>
          <Text style={styles.text}>Passenger</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setDriver({isDriver: true})} style={styles.btn}>
        <View>
          <Text style={styles.text}>Driver</Text>
        </View>
      </TouchableOpacity>
   </View>
  );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   paddingTop: 50
  },
  btn: {
    marginTop: 10,
    height: 35
  }, 
  text: {
    fontSize: 25,
    alignSelf: 'center',
    color: 'blue'
  }
});

export default App;
