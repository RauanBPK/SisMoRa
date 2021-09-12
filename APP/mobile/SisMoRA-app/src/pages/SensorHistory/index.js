import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';

import { LineChart } from 'react-native-chart-kit'
import { Dimensions } from "react-native";

let deviceHeight = Dimensions.get('screen').height;
let windowHeight = Dimensions.get('window').height;
let bottomNavBarHeight = deviceHeight - windowHeight;

let lostHeightPercent = 0;
if (bottomNavBarHeight > 0) {
    // onscreen navbar
    lostHeightPercent = (bottomNavBarHeight / deviceHeight) * 100
}
//import api from '../../services/api';

import logoImg from '../../assets/logo.png';
import iconImg from '../../assets/icon.png';
import styles from './styles';
import { RFPercentage } from 'react-native-responsive-fontsize';


export default function SensorHistory() {

    const [sensorHistoryDetail, setSensorHistoryDetail] = useState([])
    const navigation = useNavigation();
    const route = useRoute();
    const history = route.params.history;

    useEffect(() => {
        prepareHistory(history)
    }, [])


    function prepareHistory(hist) {
        function sensorInArray(array, sensor) {
            for (index in array) {
                if (array[index]["sensor"] == sensor) {
                    return true;
                }
            }
            return false;
        }
        var sensorDetail = []
        for (var batch of hist) {
            for (var sensor of batch["sensors"]) {
                if (sensorInArray(sensorDetail, sensor.bomba)) {//ou sensor.sensor?
                    
                    var correctElement = sensorDetail.filter(item => item.sensor === sensor.bomba);
                    var D = new Date(batch["createdAt"]["_seconds"] * 1000);
                    var formatedDate = `${D.getDate()}/${D.getMonth() + 1}/${D.getFullYear().toString().substr(-2)}`
                    correctElement[0]["labels"].push(formatedDate)
                    correctElement[0].dataset[0]["data"].push(parseInt(sensor.PH))  
                    correctElement[0].dataset[1]["data"].push(parseInt(sensor.TDS))
                } else {
                    //se e a primeira vez adicionando o sensor na lista
                    var D = new Date(batch["createdAt"]["_seconds"] * 1000);
                    var formatedDate = `${D.getDate()}/${D.getMonth() + 1}/${D.getFullYear().toString().substr(-2)}`
                    sensorDetail.push({ sensor: sensor.bomba, labels: [formatedDate], dataset: [{ name: "pH", data: [parseInt(sensor.PH)], bgColor: "#2bf" }, { name: "Total de sólidos dissolvidos (ppm)", data: [parseInt(sensor.TDS)], bgColor: "#f5a233" }] })
                }

            }
        }
        //console.log(sensorDetail)
        sensorDetail.sort((a,b) => (a.sensor > b.sensor) ? 1 : -1); //ordena por id das bombas
        setSensorHistoryDetail(sensorDetail);
    }

    function navigateToHistorico(incident) {
        navigation.navigate('BatchHistory', { incident });
    }
    function navigateToHome(incident) {
        navigation.navigate('Main', { incident });
    }
    function navigateToContato(incident) {
        navigation.navigate('Contact', { incident });
    }

    function getChartWidth(numOfItems) {

        var chartWidth = 0
        var screenWidth = Dimensions.get("window").width;
        var fitWidth = screenWidth - (screenWidth * 0.19)
        if (numOfItems <= 4) {
            chartWidth = fitWidth
        } else {
            chartWidth = fitWidth + (numOfItems * 40)
        }
        return chartWidth;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>

                <Image style={styles.icon} source={iconImg} />
                <Image style={styles.logo} source={logoImg} />

            </View>
            <Text style={styles.headerText}>
                Acompanhe a os dados de cada bomba
            </Text>
            <View style={styles.batchRead}>
                <View style={styles.eachBlock}>
                    <Text style={[styles.batchReadTitleText, { paddingBottom: RFPercentage(2) }]}>BOMBAS</Text>
                </View>
                <FlatList
                    style={styles.sensorList}
                    data={sensorHistoryDetail}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item: sensor }) => (
                        <Collapse style={styles.collapsible}>
                            <CollapseHeader style={styles.sensor}>
                                <View style={styles.eachBlock}>
                                    <Feather name="droplet" style={[{fontSize: RFPercentage(2.4), color:"#2bf"}]}/>
                                    <Text style={styles.eachSensorText}>{sensor.sensor}</Text>
                                </View>
                            </CollapseHeader>
                            <CollapseBody style={styles.collapsibleBody}>
                                <FlatList
                                    style={styles.sensorListInner}
                                    data={sensor.dataset}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item: dataset }) => (
                                        <View style={styles.chartContainer}>

                                            <View style={styles.eachBlock}>
                                                
                                                <Text style={styles.eachSensorText}>{dataset.name}</Text>
                                            </View>

                                            <ScrollView horizontal={true}>
                                                <LineChart
                                                    data={{
                                                        labels: sensor.labels,
                                                        datasets: [
                                                            {
                                                                data: dataset.data
                                                            }
                                                        ]
                                                    }}
                                                    
                                                    width={getChartWidth(dataset.data.length)} // from react-native
                                                    height={RFPercentage(25)}
                                                    segments={4}
                                                    xLabelsOffset={-lostHeightPercent*1.2}
                                                    yAxisLabel=""
                                                    yAxisSuffix=""
                                                    yAxisInterval={1} // optional, defaults to 1
                                                    chartConfig={{
                                                        backgroundColor: "#fff",
                                                        backgroundGradientFrom: dataset.bgColor,
                                                        backgroundGradientTo: dataset.bgColor,
                                                        decimalPlaces: 1, // optional, defaults to 2dp
                                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                        style: {
                                                            borderRadius: 12
                                                        },
                                                        propsForDots: {
                                                            r: "5",
                                                            strokeWidth: "1",
                                                            stroke: "#ffa726"
                                                        }
                                                    }}

                                                    style={{
                                                        marginVertical: 8,
                                                        borderRadius: 16
                                                    }}
                                                />
                                            </ScrollView>
                                        </View>
                                    )} />
                            </CollapseBody>
                        </Collapse>
                    )} />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigateToHome()} style={styles.footerButton}>
                    <Feather name="home" style={styles.footerIcon} />
                    <Text style={styles.footerButtonText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigateToHistorico()} style={styles.footerButton}>
                    <Feather name="book-open" style={styles.footerIcon} />
                    <Text style={styles.footerButtonText}>Histórico</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToContato()} style={styles.footerButton}>
                    <Feather name="mail" style={styles.footerIcon} size={18} />
                    <Text style={styles.footerButtonText}>Contato</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}