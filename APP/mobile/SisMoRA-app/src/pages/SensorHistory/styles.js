import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
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
  container: {
    flex: 1,
    paddingHorizontal: RFPercentage(1.4),
    paddingTop: Constants.statusBarHeight + RFPercentage(1.6),
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
  headerText: {
    fontFamily: 'sans-serif-light',
    fontSize: deviceWidth * 0.035,
    //fontSize: 16,
    fontStyle: "italic",
    textAlign: "center"
  },
  batchRead:{
    backgroundColor: "#eff4fc",
    borderRadius: 8,
    marginTop: RFPercentage(1),
    height: RFPercentage(74) - lostHeightPercent*0.4,
    padding: RFPercentage(2)
  },
  batchReadTitleText:{
    fontSize: deviceWidth * 0.035,
    fontWeight: "bold",
    color: "#666",
  },
  sensorList:{
    marginTop: 0,
  },
  chartContainer:{
    paddingTop: RFPercentage(2)
  },
  collapsible:{
    
    paddingVertical: RFPercentage(2.2) - lostHeightPercent/10,
    backgroundColor: '#FFF',
    marginBottom: RFPercentage(1),
    flexDirection: "column",
    borderRadius: 8
    
  },
  sensor:{
    backgroundColor: '#FFF',
    paddingVertical: 0,
    alignItems: 'center' 
  },

  eachBlock:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    //backgroundColor: "#fff",
    width: "100%"

  },
  eachSensorText:{
    //fontSize: 16,
    fontSize: deviceWidth * 0.035,
    alignSelf:"center",

  },
  collapsibleBody:{
    justifyContent: "space-around",
    marginTop: RFPercentage(1.2),
    paddingVertical: RFPercentage(1.4),
    marginHorizontal: RFPercentage(1.5),
    borderTopColor: "#eee",
    borderTopWidth: 1
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