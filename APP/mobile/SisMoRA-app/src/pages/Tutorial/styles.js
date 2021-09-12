import { StyleSheet } from 'react-native';
import { RFPercentage} from "react-native-responsive-fontsize";
import {Dimensions} from 'react-native';

let deviceHeight = Dimensions.get('screen').height;
let deviceWidth  = Dimensions.get('screen').width;
let windowHeight = Dimensions.get('window').height;
let bottomNavBarHeight = deviceHeight - windowHeight;

let lostHeightPercent = 0;
if (bottomNavBarHeight > 0) {
    // onscreen navbar
    
    lostHeightPercent = (bottomNavBarHeight/deviceHeight)*100

} else {
    // not onscreen navbar
    
}
export default StyleSheet.create({
    slide: {
        flex: 1,
        resizeMode: 'cover',
        backgroundColor: "#2bf",
        paddingVertical: RFPercentage(8),
        paddingHorizontal: deviceWidth * 0.1
      },
      text: {
        color: '#333',
        //marginTop: RFPercentage(10),
        textAlign: 'center',
        color: "#fff"
      },
      title:{
        textAlign: "center",
        color:"#fff",
        fontSize: deviceWidth * 0.07,
        fontWeight: "bold"
      },
      bgImage:{
        alignContent:"center",
        justifyContent:"center",
        tintColor: "#fff",
        alignSelf: "center"
      }
})