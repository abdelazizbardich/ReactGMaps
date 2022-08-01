/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView,  StyleSheet} from 'react-native';
import MapView,{Marker} from 'react-native-maps';
import { io } from "socket.io-client";
import axios from 'axios';
import GetLocation from 'react-native-get-location';
const baseUrl = 'http://192.168.1.131:3000';
const socket = io('ws://192.168.1.131:3000');

// App start
const App = () => {
  const [users, setUsers] = React.useState([])
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  // watch for user localization changes and update the users list
  socket.on("newMapData", (args) => {
    const newUsers = users.map(user => {
      // if the user is in the list, update the user's location
      if (user.id === args.id) {
        user.localization = args.localization;
      }
      return user;
    });
    // update the users list
    setUsers(newUsers);
  });

  React.useEffect( () => {
    const fetchData = async () => {
      // Get current user location
      const getLocationData = await GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 15000});
      setLatitude(getLocationData.latitude);
      setLongitude(getLocationData.longitude);
      // Get users from server
      const usersData = await axios.get(`${baseUrl}/users`);
      setUsers(usersData.data);
      
    }
    fetchData().catch(err => console.log(err));
  }, [setLatitude, setLongitude]);


  return (
    <SafeAreaView>
        <MapView 
        style={styles.map} 
        initialRegion={{ latitude: latitude, longitude: longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}} 
        region={{ latitude: latitude, longitude: longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}>
          {users && users.map((user,index) => (
            <Marker key={index} coordinate={{latitude: user.localization.latitude,longitude: user.localization.longitude}} title={"user.title"} description={"user.description"}/>
          ))}
          </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map:{backgroundColor: 'gray',width: '100%',height: '100%',}
});

export default App;
