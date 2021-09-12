import React, { useEffect } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity, StatusBar, ActivityIndicator} from 'react-native';
import {AsyncStorage} from 'react-native'

import styles from './styles';
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

export default function Tutorial(){
    async function setFirstTimeFalse(){
        try {
            await AsyncStorage.setItem("@firstTime", "false")
        } catch (error) {
            //console.log("Set failed")
        } 
    }

    useEffect(() =>{
        setFirstTimeFalse()
    },[])

    const navigation = useNavigation();

    const slides = [
        {
          key: "1",
          title: 'Bem vindo',
          text1: 'Sistema de Monitoramento do Rio Araranguá',
          text2: '* Todos os índices da água são classificados em relação à cultura do arroz, não representando sua qualidade para consumo.',
          image1: require('../../assets/logo.png'),
          image2: require('../../assets/icon.png'),
          thisStyle: {
            image1:{width: "100%", height:"12%", resizeMode: "contain"},
            image2:{tintColor:null, marginTop: RFPercentage(5), borderRadius: 100, width: "90%", height: "25%", resizeMode:"contain", alignSelf:"center"},
            text1:{fontSize: deviceWidth * 0.055, marginTop: RFPercentage(5)},
            text2:{marginTop: RFPercentage(20), fontSize: deviceWidth * 0.035},
            slide:{backgroundColor: '#2bf'},
            title: {fontSize: deviceWidth * 0.05}
          },       
        },
        {
          key: "2",
          title: 'Utilização do mapa',
          text1: 'Toque nos marcadores no mapa para visualizar o status de cada bomba',
          image1: require('../../assets/tutorial/mapa.png'),
          thisStyle: {
            title: {marginTop: RFPercentage(15)},
            image1:{tintColor:null, marginTop: RFPercentage(1), borderRadius: 10, height: RFPercentage(30), resizeMode:"contain", alignSelf:"center"},
            text1:{fontSize: deviceWidth * 0.045, marginTop: RFPercentage(5)},
            slide:{backgroundColor: '#f49a24'} //'#59b2ab'
          }
        },
        {
          key: "3",
          title: 'Lista de bombas',
          text1: 'Se preferir, toque nos itens da lista de bombas para visualizar detalhes da leitura',
          image1: require('../../assets/tutorial/lista.png'),
          thisStyle: {
            title: {marginTop: RFPercentage(15)},
            image1:{tintColor:null, marginTop: RFPercentage(1), borderRadius: 10, height: RFPercentage(40), resizeMode:"contain", alignSelf:"center"},
            text1:{fontSize: deviceWidth * 0.045, marginTop: RFPercentage(5)},
            slide:{backgroundColor: '#25e89a'} 
          }
        
      },
      {
        key: "4",
        title: 'Histórico',
        text1: 'Pesquise por data para visualizar dados antigos',
        image1: require('../../assets/tutorial/historico.png'),
        thisStyle: {
          title: {marginTop: RFPercentage(8)},
          image1:{tintColor:null, marginTop: RFPercentage(1), borderRadius: 10, height: RFPercentage(50), resizeMode:"contain", alignSelf:"center"},
          text1:{fontSize: deviceWidth * 0.045, marginTop: RFPercentage(5)},
          slide:{backgroundColor: '#59b2ab'} 
        }
      
    },
    {
      key: "5",
      title: 'Gráficos',
      text1: 'Visualize gráficos dos dados carregados na página de histórico',
      image1: require('../../assets/tutorial/graficos.png'),
      thisStyle: {
        title: {marginTop: RFPercentage(8)},
        image1:{tintColor:null, marginTop: RFPercentage(1), borderRadius: 10, height: RFPercentage(50), resizeMode:"contain", alignSelf:"center"},
        text1:{fontSize: deviceWidth * 0.045, marginTop: RFPercentage(5)},
        slide:{backgroundColor: '#ab59b2'} 
      }
    
  }
]
    function _renderItem({ item }){
        return (
          <View style={[styles.slide, item.thisStyle.slide]}>
            <Text style={[styles.title, item.thisStyle.title]}>{item.title}</Text>
            <Image style={[styles.bgImage, item.thisStyle.image1]} source={item.image1} />
            <Image style={[styles.bgImage, item.thisStyle.image2]} source={item.image2} />

            <Text style={[styles.text, item.thisStyle.text1]}>{item.text1}</Text>
            <Text style={[styles.text, item.thisStyle.text2]}>{item.text2}</Text>
          </View>
        );
      }
      async function _onDone(){
        try {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              });
        } catch (error) {
            console.log(error)
        } 
      }

    return (
        <View style={{flex:1}}>
        <StatusBar hidden={true} />
        <AppIntroSlider renderItem={_renderItem} data={slides} onDone={_onDone} showPrevButton={true} prevLabel={"Voltar"} nextLabel={"Próximo"} doneLabel={"Continuar"}/>
        </View>
    )
}