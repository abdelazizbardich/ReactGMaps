import GetLocation from 'react-native-get-location';

const localization = async ()=>{
    return GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    })
    
};

export default localization;