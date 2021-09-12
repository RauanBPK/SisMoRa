/* 
    Author: Rauan Pires
    Project: SisMoRA - Sistema de Monitoramento do Rio Araranguá

    Esta aplicação é parte do projeto de TCC que tem como objetivo construir
    uma infraestrutura para coletar dados físico-químicos da água do Rio Araranguá
    e disponibilizá-los aos rizicultores da região Sul de Santa Catarina.

*/

import React from 'react';
import { useState, useEffect} from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import MapView from "react-native-maps";
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';


import api from '../../services/api';

import logoImg from '../../assets/logo.png';
import iconImg from '../../assets/icon.png';
import bad from '../../assets/icons/bad2.png';
import medium from '../../assets/icons/medium2.png'
import good from '../../assets/icons/good2.png'
import styles from './styles';

import { Dimensions } from 'react-native';

let deviceWidth = Dimensions.get('screen').width;

export default function Main() {

    const [sensors, setSensors] = useState([]);
    const [lastReadDate, setLastReadDate] = useState('?');
    const [lastReadTime, setLastReadTime] = useState('?');
    const [sensorPosition, setSensorPosition] = useState([]);
    const [loadingIndicator, setLoadingIndicator] = useState(true);
    const [errorOnFetch, setErrorOnFetch] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchAll();
        setRefreshing(false);
      }, [refreshing]);

    
    async function fetchAll() {
        var firstResponse, secondResponse = []
        setLoadingIndicator(true)
        try {

            firstResponse = await api.get('/sensordata');
            secondResponse = await api.get('/position');

        } catch (error) {
            setErrorOnFetch(true)
            setLoadingIndicator(false)
            return;
        }

        setSensors(firstResponse.data.sensors);
        setLoadingIndicator(false)
        const timestamp = firstResponse.data.createdAt._seconds * 1000;
        const date = new Date(timestamp);

        setLastReadDate(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
        setLastReadTime(date.toLocaleTimeString("pt-BR"));

        var positionData = secondResponse.data.positions;
        var sensorData = firstResponse.data.sensors;
        var mergedData = [];
        for ([index, item] of positionData.entries()) {
            sensorData.forEach(s => {
                if (item.bomba === s.bomba) {
                    mergedData[index] = positionData[index];
                    mergedData[index].WATER = s.WATER;
                    //positionData[index].WATER = s.WATER

                    switch (s.WATER) {
                        case "BOA":
                            //positionData[index].COR = "#2bf";
                            mergedData[index].COR = "#2bf";
                            break;
                        case "CUIDADO":
                            //positionData[index].COR = "#f49a24";
                            mergedData[index].COR = "#f49a24";
                            break;
                        case "RUIM":
                            //positionData[index].COR = "#fc102f";
                            mergedData[index].COR = "#fc102f";
                            break;
                        default: //positionData[index].COR = "#f49a24";
                            mergedData[index].COR = "#fc102f";
                    }
                }
            })
        };


        setSensorPosition(mergedData);
    }

    useEffect(() => {

        fetchAll()

    }, []);

    const navigation = useNavigation();

    function navigateToHistorico(param) {
        navigation.navigate('BatchHistory', { param });
    }
    function navigateToContato(param) {
        navigation.navigate('Contact', { param });
    }

    function qualityIcon(quality) {
        switch (quality) {
            case "BOA":
                return { icon: good, styleIcon: styles.iconGood };
            case "CUIDADO":
                return { icon: medium, styleIcon: styles.iconMedium };
            case "RUIM":
                return { icon: bad, styleIcon: styles.iconBad };
            default: return;
        }
    }


    return (
        <View style={styles.container}>

            <StatusBar hidden={true} />
            <View style={styles.header}>

                <Image style={styles.icon} source={iconImg} />
                <Image style={styles.logo} source={logoImg} />

            </View>
            <Text style={styles.headerText}>
                Acompanhe os índices da água do Rio Araranguá
            </Text>

            <View style={styles.mapCont}>
                <View style={styles.mapContainer}>
                    <MapView style={styles.map}
                        initialRegion={{
                            latitude: -28.911024,
                            longitude: -49.428689,
                            latitudeDelta: 0.15,
                            longitudeDelta: 0.05,
                        }}
                    >

                        {sensorPosition.map((item, index) => (
                            <MapView.Marker
                                key={index}
                                coordinate={item.position}
                                title={item.bomba}
                                description={`AGUA: ${item.WATER}`}
                                pinColor={item.COR}
                            />
                        ))}

                    </MapView>
                </View>
            </View>

            <View style={styles.batchRead}>

                <Text style={styles.batchReadHeader}>Última leitura: <Text style={styles.batchReadDate}>{lastReadDate} - {lastReadTime}</Text></Text>
                <View style={styles.block}>
                    <View style={styles.batchReadColTitle}>
                        <Text style={styles.batchReadTitleText}>Bomba</Text>
                    </View>
                    <View style={styles.batchReadColTitle}>
                        <Text style={styles.batchReadTitleText}>Irrigação</Text>

                    </View>
                </View>
                {loadingIndicator && (
                    <ActivityIndicator size="large" color="#2bf" style={{ height:"80%" }} />
                )}
                {errorOnFetch &&
                    (
                        <TouchableOpacity style={styles.serverError} onPress={() => { setErrorOnFetch(false), fetchAll() }}>
                            <Text style={styles.serverErrorText}>Erro na comunicação - Tente mais tarde</Text>
                            <Feather name="cloud-off" style={styles.serverErrorIcon} size={deviceWidth * 0.18} />
                            <Text style={styles.serverErrorText}>Toque para recarregar</Text>
                        </TouchableOpacity>
                    )
                }

                <FlatList
                    style={styles.sensorList}
                    data={sensors}
                    keyExtractor={sensor => String(sensor.bomba)}
                    showsVerticalScrollIndicator={false} // tira a barrinha de scroll
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({ item: sensor }) => (


                        <Collapse style={styles.collapsible}>
                            <CollapseHeader style={styles.sensor}>
                                <View style={styles.block} >
                                    <View style={styles.eachBlock} >
                                        <Text style={styles.eachSensorText}> </Text>
                                        <Text style={styles.eachSensorText}>{sensor.bomba}</Text>
                                    </View>

                                    <View style={styles.eachBlock} >
                                        <Image source={qualityIcon(sensor.WATER).icon} style={qualityIcon(sensor.WATER).styleIcon}></Image>
                                    </View>
                                </View>
                            </CollapseHeader>
                            <CollapseBody style={styles.collapsibleBody} >
                                <View style={styles.block} >
                                    <View style={styles.eachBlock}>
                                        <Text style={styles.eachSensorText}>pH: </Text>
                                        <Text style={styles.eachSensorText}>{sensor.PH}</Text>
                                    </View>

                                    <View style={styles.eachBlock} >
                                        <Text style={styles.eachSensorText}>TDS: </Text>
                                        <Text style={styles.eachSensorText}>{sensor.TDS}</Text>
                                        <Text style={styles.eachSensorText}> ppm</Text>
                                    </View>
                                </View>
                            </CollapseBody>
                        </Collapse>



                    )}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => { }} style={styles.footerButtonSelected}>
                    <Feather name="home" style={styles.footerIcon} />
                    <Text style={styles.footerButtonTextSelected}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigateToHistorico()} style={styles.footerButton}>
                    <Feather name="book-open" style={styles.footerIcon} />
                    <Text style={styles.footerButtonText}>Histórico</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToContato()} style={styles.footerButton}>
                    <Feather name="mail" style={styles.footerIcon} />
                    <Text style={styles.footerButtonText}>Contato</Text>
                </TouchableOpacity>
            </View>
        </View>

    );



}