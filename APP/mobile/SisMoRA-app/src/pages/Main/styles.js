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
  headerText: {
    fontFamily: 'sans-serif-light',
    fontSize: deviceWidth * 0.036,
    //fontSize: 16,
    fontStyle: "italic",
    textAlign: "center"
  },
  mapCont:{
    flex:1,
    marginTop:4,
    margin: 0,
    maxHeight: RFPercentage(38),
    justifyContent: "center",
    padding:2,
    backgroundColor:"#ccc",
    borderRadius: 4
  },
  mapContainer: {
    maxHeight: "100%",
    maxWidth: "100%",
    backgroundColor: "#fff",
    position: "relative",
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    maxWidth:"100%"
  },
  batchRead:{
    backgroundColor: "#eff4fc",
    borderRadius: 4,
    marginTop: RFPercentage(1),
    //height:"49%",
    height: RFPercentage(36) + lostHeightPercent * 0.5,
    padding: RFPercentage(2),
  },
  batchReadHeader: {
    alignSelf: "center",
    fontSize: deviceWidth * 0.04,
    //fontSize: 18,
    fontFamily: 'sans-serif-light',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: RFPercentage(1.5) - lostHeightPercent*0.55,
  },
  batchReadDate: {
    fontWeight: "bold",
    color: "#025f87"
  },
  batchReadColTitle:{
    flexDirection: "row",
    justifyContent: "center",
    width: "50%",
  },
  batchReadTitleText:{
    fontSize: deviceWidth*0.035,
    fontWeight: "bold",
    color: "#666",
  },

  serverError:{
    marginTop:"0%",
    backgroundColor: "#fff",
    height: RFPercentage(24),
    width:"100%",
    alignContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2bf"
  },
  serverErrorText:{
    alignSelf:"center",
    fontSize: deviceWidth * 0.035,
    color:"#444",
    
  },
  serverErrorIcon:{
    color:"#2bf",
    paddingTop: 20, 
    alignSelf:"center",
    
  },

  sensorList:{
    marginTop: 0,
    borderColor: "#ccc"
  },
  collapsible:{
    
    paddingVertical: RFPercentage(.7),
    backgroundColor: '#FFF',
    marginBottom: RFPercentage(0.8),
    flexDirection: "column",
    borderRadius: 8
    
  },
  sensor:{
    backgroundColor: '#FFF',
    paddingVertical: RFPercentage(.1),
    maxHeight: RFPercentage(5.4),
    resizeMode: "contain",
    minHeight: RFPercentage(4.3) 
    
  },
  block:{
    justifyContent: "space-between",
    flexDirection: "row", 
    alignItems:"center",
    height: RFPercentage(5.5)
    
    
  },
  eachBlock:{
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: "50%",

  },
  eachSensor:{
    flexDirection:"row",
    justifyContent: "space-evenly",

  },
  eachSensorText:{
    //fontSize: 16,
    fontSize: deviceWidth * 0.035 - lostHeightPercent*0.2,
    alignSelf:"center",

  },
  collapsibleBody:{
    justifyContent: "space-around",
    marginTop: RFPercentage(1),
    paddingVertical: RFPercentage(1),
    marginHorizontal: 18,
    borderTopColor: "#eee",
    borderTopWidth: 1
  },

  iconGood:{
    tintColor: "#2bf" /*"#47ea3f"*/,
    height: deviceWidth * 0.08 - lostHeightPercent*0.3,
    resizeMode: "contain"
  },
  iconMedium:{
    tintColor: "#f7c74f", 
    height: deviceWidth * 0.08 - lostHeightPercent*0.3, 
    resizeMode: "contain"
  },
  iconBad:{
    tintColor: "#fc102f", 
    height: deviceWidth * 0.08 - lostHeightPercent*0.3, 
    resizeMode: "contain"
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
    height: RFPercentage(6.1) + lostHeightPercent * 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
    flexDirection: "row"
  },
  footerButton: {
    backgroundColor: "#025f87",
    width: "34%",
    height: RFPercentage(6.1) + lostHeightPercent * 0.5,
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