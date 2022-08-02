/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView,  StyleSheet,View,Button,TouchableOpacity,Text, Alert} from 'react-native';
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
  const [latitudeDelta, setLatitudeDelta] = React.useState(0.0922);
  const [longitudeDelta, setLongitudeDelta] = React.useState(0.0421);
  const [updatedPosition, setUpdatedPosition] = React.useState(null);

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

  const  renderMap = () => {
    return (
        <SafeAreaView >
          <MapView 
            style={styles.map}
            initialRegion={{ latitude: latitude, longitude: longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta}} 
            region={{ latitude: latitude, longitude: longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta}}
            onRegionChangeComplete={updateRegion}
            >
              {users && users.map((user,index) => (
                <Marker  key={index} coordinate={{latitude: user.localization.latitude,longitude: user.localization.longitude}} title={"user.title"} description={"user.description"}>
                </Marker>
              ))}
            </MapView>
            {/* Zooms */}
            <TouchableOpacity style={styles.zoomIn} onPress={zoomIn}><Text style={{fontSize:20}}>-</Text></TouchableOpacity>
            <TouchableOpacity style={styles.zoomOut} onPress={zoomOut}><Text style={{fontSize:20}}>+</Text></TouchableOpacity>
            {/* return to current location */}
            <TouchableOpacity style={styles.currentLocation} onPress={returnToCurrentLocation}><Text style={{fontSize:20}}>x</Text></TouchableOpacity>
        </SafeAreaView>
    )
  }

  // Zooms
  const zoomIn = () => {
      setLatitudeDelta(latitudeDelta + 0.01);
      setLongitudeDelta(longitudeDelta + 0.01);
  }
  const zoomOut = ()=>{
      setLatitudeDelta(latitudeDelta - 0.01);
      setLongitudeDelta(longitudeDelta - 0.01);
  }

  // return to current location
  let loading = false;
  const returnToCurrentLocation = async ()=> {
    if(!loading){
      try {
        const getLocationData = await GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 15000});
        setLatitude(getLocationData.latitude);
        setLongitude(getLocationData.longitude);
      } catch (error) {
          Alert.alert("Can't access localization service, try again");
      }
    }else{
      Alert.alert("Loading localization...");
    }
    
  }

  // Update region
  const updateRegion = (event) => {
    setLatitude(event.latitude);
    setLongitude(event.longitude);
  }
      

  // Redner the app
  return (
    renderMap()
  );
};

const styles = StyleSheet.create({
  map:{width: '100%',height: '100%'},
  currentLocation:{
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    bottom: '5%',
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 100,
    borderWidth:3,
    borderColor:'#eee'
  },
  zoomIn:{
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    top: '55%',
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 100,
    borderWidth:3,
    borderColor:'#eee'
  },
  zoomOut:{
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    top: '45%',
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 100,
    borderWidth:3,
    borderColor:'#eee'
  }
});

export default App;
