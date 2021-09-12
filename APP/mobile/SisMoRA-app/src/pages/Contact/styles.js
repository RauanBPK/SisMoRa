import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {Dimensions} from 'react-native';

let deviceWidth  = Dimensions.get('screen').width;
let deviceHeight = Dimensions.get('screen').height;
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
  container: {
    flex: 1,
    paddingHorizontal: RFPercentage(1.4),
    paddingTop: Constants.statusBarHeight + RFPercentage(1.6) - lostHeightPercent,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: RFPercentage(3.4) - lostHeightPercent,
  },
  icon: {
    borderRadius: 8,
    width: '25%',
    height: RFPercentage(10.5) - lostHeightPercent/10,
    resizeMode: "contain"
  },
  logo: {
    width: deviceWidth * 0.65,
    height: '100%'
  },
  about:{
    marginTop: RFPercentage(2),
    height: RFPercentage(25) - lostHeightPercent,
    backgroundColor: "#eff5fc",
    borderRadius: 10,
    padding: RFPercentage(2.6),
    flexDirection: "column",
    justifyContent:"space-evenly"
  },
  aboutText:{
    textAlign:"center",
    //fontSize: 20,
    fontSize: deviceWidth * 0.04,
    color: "#555",
    
  },
  contato: {
    marginTop: RFPercentage(2),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:"center",
    alignContent: "center",
    textAlign: "center",
    height: RFPercentage(49) + lostHeightPercent * 1.5,
    backgroundColor: "#eff5fc",
    borderRadius: 10
  },
  contatoText:{
    textAlign: "center",
    //fontSize: 18,
    fontSize: deviceWidth * 0.04,
    color: "#888",
    paddingHorizontal: "12%",
    paddingBottom: "10%"
    
  },
  contatoButtonWhats: {
    backgroundColor: "#25D367",
    borderRadius: 8,
    height: "20%",
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
    
  },

  contatoButtonEmail: {
    backgroundColor: "#34B7F0",
    borderRadius: 8,
    height: "20%",
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
    marginTop: "5%"
  },

  contatoButtonText: {
    color: "#fff",
    fontSize: deviceWidth * 0.04,
    fontWeight: 'bold',
    paddingLeft: 10
  },
  contatoIcon: {
    fontSize: deviceWidth * 0.05,
    color: "#fff",
    
  },
  footer:{
    position:"absolute",
    right:0,
    left:0,
    bottom:0,
    flex:1,
    justifyContent: "space-around",
    flexDirection: "row",
    padding: 0,
    backgroundColor: "#fff",
    
  },
  footerButtonSelected: {
    backgroundColor: "#003a54",
    width: "33%",
    height: RFPercentage(6.1) + lostHeightPercent,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
    flexDirection: "row"
  },
  footerButton: {
    backgroundColor: "#025f87",
    width: "34%",
    height: RFPercentage(6.1) + lostHeightPercent,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
    flexDirection: "row",
    
  },
  footerButtonText:{
    color: '#fff',
    paddingLeft: 8,
    //fontSize:14,
    fontSize: deviceWidth*0.035
  },
  footerButtonTextSelected:{
    fontWeight: "bold",
    color: '#fff',
    paddingLeft: 8,
    fontSize:deviceWidth*0.035
  },

  footerIcon: {
    fontSize: deviceWidth*0.04,
    
    color: "#f49a24"
  }
});