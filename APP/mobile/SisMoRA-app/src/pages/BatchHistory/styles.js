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
    fontSize: deviceWidth * 0.035,
    //fontSize: 16,
    fontStyle: "italic",
    textAlign: "center"
  },
  batchRead:{
    backgroundColor: "#eff4fc",
    borderRadius: 4,
    marginTop: RFPercentage(1),
    //height:"49%",
    height: RFPercentage(74.5),
    padding: RFPercentage(2)
  },
  batchReadHeader: {
    alignSelf: "center",
    fontSize: deviceWidth * 0.04,
    //fontSize: 18,
    fontFamily: 'sans-serif-light',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: RFPercentage(1.5),
  },
  specificButton:{
    backgroundColor: "#25D3e7",
    borderRadius: 8,
    height: "10%",
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: "row",
    marginBottom: RFPercentage(2.2) - lostHeightPercent/10
  },

specificButtonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: deviceWidth * 0.03
  },
  nothingFound:{
    marginTop:"10%",
    maxHeight: RFPercentage(28) - lostHeightPercent,
    margin: RFPercentage(2),
    padding: RFPercentage(1),
    borderRadius: 8,
  },
  nothingFoundText:{
    alignSelf:"center",
    fontSize: deviceWidth * 0.035,
    color:"#222"
  },
  nothingFoundIcon:{
    color:"#bbb", 
    paddingTop: 20, 
    alignSelf:"center"
  },
  serverError:{
    marginTop:"10%",
    backgroundColor: "#fff",
    maxHeight: RFPercentage(35) - lostHeightPercent,
    margin: RFPercentage(2),
    padding: RFPercentage(2.4),
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2bf"
  },
  serverErrorText:{
    alignSelf:"center",
    fontSize: deviceWidth * 0.04,
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
  sensorListInner:{
    marginTop: 0,
    paddingVertical: 0,
    borderColor: "#ccc"
  },
  collapsible:{
    
    paddingVertical: RFPercentage(2.2) - lostHeightPercent/10,
    backgroundColor: '#FFF',
    marginBottom: RFPercentage(1),
    flexDirection: "column",
    borderRadius: 8
    
  },
  collapsibleInner:{
    
    paddingVertical: 0,
    backgroundColor: '#FFF',
    marginBottom: 0,
    flexDirection: "column",
    borderRadius: 8
    
  },
  sensor:{
    backgroundColor: '#FFF',
    paddingVertical: 0,
    alignItems: 'center' 
  },
  sensorInner:{
    backgroundColor: '#fafafa',
    paddingVertical: RFPercentage(1),
    alignItems: 'center' 
  },
  block:{
    justifyContent: "space-between",
    flexDirection: "row", 
    paddingVertical: RFPercentage(.45),
    
  },
  eachBlock:{
    flexDirection: "row",
    justifyContent: "center",
    //backgroundColor: "#fff",
    width: "50%"

  },
  blockInner:{
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: "100%",
    paddingBottom: RFPercentage(1),
    borderBottomColor: "#eee",
    borderBottomWidth: 0

  },
  eachBlockInner:{
    flexDirection: "row",
    justifyContent: "center",
    width: "50%"

  },
  eachBlockInnerTitle:{
    fontSize: deviceWidth * 0.035,
    fontWeight: "bold",
    color: "#666",
  },
  eachSensor:{
    flexDirection:"row",
    justifyContent: "space-evenly"

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
    marginHorizontal: RFPercentage(1.4),
    borderTopColor: "#eee",
    borderTopWidth: 1
  },
  collapsibleBodyInner:{
    justifyContent: "space-around",
    marginTop: 0,
    paddingVertical: RFPercentage(1.6),
    marginHorizontal: 0,
    borderBottomColor: "#eee",
    borderBottomWidth: 1
  },
  bottomButtomVIew:{
    height: "8%", width:"100%", justifyContent: "space-between", flexDirection:'row',marginTop: RFPercentage(1)
  },
  fetchMoreButton:{
    backgroundColor: "#25e89a",
    borderRadius: 8,
    height: "100%",
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: "row",
  },
  sensorDetailButton:{
    backgroundColor: "#f5a233",
    borderRadius: 8,
    height: "100%",
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: "row",
  },
  fetchMoreButtonText:{
    color: "#fff",
    fontWeight: "bold",
    fontSize: deviceWidth * 0.03
  },
  iconGood:{
    tintColor: "#2bf" /*"#47ea3f"*/,
    height:deviceWidth * 0.08 - lostHeightPercent*0.3,
    resizeMode: "contain"
  },
  iconMedium:{
    tintColor: "#f7c74f", 
    height:deviceWidth * 0.08 - lostHeightPercent*0.3, 
    resizeMode: "contain"
  },
  iconBad:{
    tintColor: "#fc102f", 
    height:deviceWidth * 0.08 - lostHeightPercent*0.3, 
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