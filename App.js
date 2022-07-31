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
import { getUsers } from './services/userService';

const App = () => {
  const socket = io('ws://192.168.1.131:3000');
  const [users, setUsers] = React.useState([])

  let newUserData = null;

  getUsers().then(res => {
    if(res.status === 200 && res.data.length > 0){
      setUsers(res.data);
    }
  });

  socket.on("newMapData", (args) => {
    console.log("====> new User details");
    const newUsers = users.map(user => {
      if (user.id === args.id) {
        user.localization = args.localization;
      }
      return user;
    });
    newUserData = newUsers;
  });
  React.useEffect(() => {
    if(newUserData){
        setUsers(newUserData);
        newUserData = null;
    }
  }, [])


  return (
    <SafeAreaView>
        <MapView style={styles.map}
        initialRegion={{
          latitude: 34.0333502,
          longitude: -6.7998911,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
          {users.map((user,index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: user.localization.latitude,
                longitude: user.localization.longitude
              }}
              title={"user.title"}
              description={"user.description"}
            />
          ))}
          </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map:{
    backgroundColor: 'gray',
    width: '100%',
    height: '100%',
  }
});

export default App;
