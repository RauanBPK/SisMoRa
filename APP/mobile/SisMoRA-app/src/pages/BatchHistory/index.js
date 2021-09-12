import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RFPercentage} from "react-native-responsive-fontsize";

import api from '../../services/api';

import logoImg from '../../assets/logo.png';
import iconImg from '../../assets/icon.png';
import bad from '../../assets/icons/bad2.png';
import medium from '../../assets/icons/medium2.png'
import good from '../../assets/icons/good2.png'
import styles from './styles';

let deviceWidth  = Dimensions.get('screen').width;

export default function BatchHistory() {
    const navigation = useNavigation();

    const [pickingTime, setPickingTime] = useState(false)
    const [fetchMoreButton, setFetchMoreButton] = useState(false)
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false)
    const [lastDocTimestamp, setLastDocTimestamp] = useState(Date.parse(new Date()) / 1000)
    const [nothingFound, setNothingFound] = useState(false)
    const [loadingIndicator, setLoadingIndicator] = useState(false)
    const [errorOnFetch, setErrorOnFetch] = useState(false)
    const [sensorDetailButton, setSensorDetailButton] = useState(false)

    async function fetchSpecific(dateString) {

        setPickingTime(false)
        setHistory([]);
        setNothingFound(false);
        setLoadingIndicator(true)
        setErrorOnFetch(false)
        setFetchMoreButton(false);
        setSensorDetailButton(false);


        if (loading) {
            return;
        };
        setLoading(true);

        const specificDate = new Date(new Date(dateString).setHours(0, 0, 0, 0)); // pra zerar horas,minutos,segundos
        console.log("Buscando dados do dia: " + specificDate)

        var res = {}

        try {
            res = await api.get('/specific', {
                params: {
                    "specificDate": specificDate
                }
            })
        } catch (error) {

            console.log(error)
            setErrorOnFetch(true)
            setHistory([])
            setLastDocTimestamp(0)
            setFetchMoreButton(false)
            setSensorDetailButton(false)
            setLoadingIndicator(false)
            setLoading(false)
            return;
        }

        setHistory(res.data)

        if (res.data.length == 0) {
            //console.log("Nenhum dado para esta data")
            setNothingFound(true)
            setLastDocTimestamp(0);
            setFetchMoreButton(false);
            setSensorDetailButton(false);
        } else {
            setLastDocTimestamp(res.data[res.data.length - 1].createdAt._seconds) // setLastDocTimestamp para continuar a partir do dia, caso o user queira
            setFetchMoreButton(true);
            setSensorDetailButton(true);
            setNothingFound(false)
        }

        setLoadingIndicator(false)
        setLoading(false);

        //console.log(res.data[res.data.length-1].createdAt._seconds)

    }
    async function fetchHistory(timestamp) {

        if (loading) {
            return;
        };

        setLoading(true);
        setLoadingIndicator(true)
        //setErrorOnFetch(false)

        if (!timestamp) {
            console.log('final da lista')
            setFetchMoreButton(false);
            setSensorDetailButton(false);
            setLoading(false);
            return;
            //END OF LIST
        }

        var res = {}
        try {
            res = await api.post('/history', {
                "startAtTimestamp": {
                    "_seconds": timestamp
                }
            });
        } catch (error) {
            console.log(error)
            setErrorOnFetch(true)
            setLoadingIndicator(false)
            setLoading(false)
            return;
        }


        var hist = res.data.history
        var lastTimestamp = hist.pop().lastDocTimestamp._seconds
        if (!lastTimestamp) {
            setLastDocTimestamp(0);
            setFetchMoreButton(false)
        } else {
            setLastDocTimestamp(lastTimestamp);
            setHistory([...history, ...res.data.history])
        }

        setLoadingIndicator(false)

        setLoading(false);

    }



    function navigateToHome() {
        navigation.navigate('Main', { history });
    }
    // function navigateToSensor(history) {
    //     navigation.navigate('SensorHistory', { history });
    // }
    function navigateToContato(incident) {
        navigation.navigate('Contact', { incident });
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
    function getDateFromSeconds(seconds) {
        const date = new Date(seconds * 1000);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.toLocaleTimeString("pt-BR")}`
    }
    // useEffect(() => {
    //     //fetchHistory(lastDocTimestamp)
    // }, [])
    return (
        <View style={styles.container}>
            <View style={styles.header}>

                <Image style={styles.icon} source={iconImg} />
                <Image style={styles.logo} source={logoImg} />

            </View>
            <Text style={styles.headerText}>
                Acompanhe o histórico de leituras dos sensores
            </Text>

            <View style={styles.batchRead}>
                <Text style={styles.batchReadHeader}>Histórico</Text>
                <TouchableOpacity
                    style={styles.specificButton}
                    onPress={() => { setPickingTime(true) }}>
                    {pickingTime && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            timeZoneOffsetInMinutes={0}

                            value={new Date()}
                            mode={'date'}
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (event.type == "set") {        //Se a data foi escolhida. Se o user apertar cancelar event.type = dismissed
                                    fetchSpecific(selectedDate)
                                    setPickingTime(false);
                                }
                                setPickingTime(false);
                            }}
                        />
                    )}

                    <Feather name="search" style={{ color: "#fff", paddingRight: 5 }} size={deviceWidth * 0.06} />
                    <Text style={styles.specificButtonText}>Buscar por data</Text>
                </TouchableOpacity>
                {nothingFound && (
                    <View style={styles.nothingFound}>
                        <Text style={styles.nothingFoundText}>Nenhum dado encontrado</Text>
                        <Feather name="help-circle" style={styles.nothingFoundIcon} size={deviceWidth * 0.3} />
                    </View>
                )}

                <FlatList
                    style={styles.sensorList}
                    data={history}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false} // tira a barrinha de scroll
                    renderItem={({ item: batch }) => (
                        <Collapse style={styles.collapsible}>
                            <CollapseHeader style={styles.sensor}>

                                <View style={styles.eachBlock} >
                                    <Text style={styles.eachSensorText}>{getDateFromSeconds(batch.createdAt._seconds)}</Text>
                                </View>


                            </CollapseHeader>
                            <CollapseBody style={styles.collapsibleBody} >
                                <View style={styles.blockInner}>
                                    <View style={styles.eachBlockInner} >
                                        <Text style={styles.eachBlockInnerTitle}>Bomba</Text>

                                    </View>
                                    <View style={styles.eachBlockInner} >

                                        <Text style={styles.eachBlockInnerTitle}>Irrigação</Text>
                                    </View>
                                </View>
                                <FlatList
                                    style={styles.sensorListInner}
                                    data={batch.sensors}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item: sensor }) => (
                                        <Collapse style={styles.collapsibleInner}>
                                            <CollapseHeader style={styles.sensorInner}>
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
                                            <CollapseBody style={styles.collapsibleBodyInner} >
                                                <View style={styles.block} >
                                                    <View style={styles.eachBlock}>
                                                        <Text style={styles.eachSensorText}>pH: </Text>
                                                        <Text style={styles.eachSensorText}>{sensor.PH}</Text>
                                                    </View>

                                                    <View style={styles.eachBlock} >
                                                        <Text style={styles.eachSensorText}>TDS: </Text>
                                                        <Text style={styles.eachSensorText}>{sensor.TDS}</Text>
                                                    </View>
                                                </View>
                                            </CollapseBody>
                                        </Collapse>
                                    )} />
                            </CollapseBody>
                        </Collapse>
                    )}
                />
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                    {loadingIndicator && (
                        <ActivityIndicator size="large" color="#2bf" style={{ height: "10%" }} />
                    )}
                    {errorOnFetch &&
                        (
                            <TouchableOpacity style={styles.serverError} onPress={() => { setErrorOnFetch(false) }}>
                                <Text style={styles.serverErrorText}>Erro na comunicação - Tente mais tarde</Text>
                                <Feather name="cloud-off" style={styles.serverErrorIcon} size={RFPercentage(12)} />
                                <Text style={styles.serverErrorText}>Toque para continuar</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>

                <View style={styles.bottomButtomVIew}>
                {sensorDetailButton && (
                    <TouchableOpacity
                        style={styles.sensorDetailButton}
                        onPress={() => {navigation.navigate("SensorHistory", {history})}}
                    >
                        <Feather name="bar-chart-2" style={{ color: "#fff", paddingRight: 5 }} size={RFPercentage(2.8)} />
                        <Text style={styles.fetchMoreButtonText}>Visualizar gráficos</Text>
                    </TouchableOpacity>
                )}
                {fetchMoreButton && (
                    <TouchableOpacity
                        style={styles.fetchMoreButton}
                        onPress={() => { fetchHistory(lastDocTimestamp) }}
                    >
                        <Feather name="plus" style={{ color: "#fff", paddingRight: 5 }} size={RFPercentage(2.8)} />
                        <Text style={styles.fetchMoreButtonText}>Carregar mais dados</Text>
                    </TouchableOpacity>
                )}
                </View>
 

            </View>


            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigateToHome()} style={styles.footerButton}>
                    <Feather name="home" style={styles.footerIcon} />
                    <Text style={styles.footerButtonText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { }} style={styles.footerButtonSelected}>
                    <Feather name="book-open" style={styles.footerIcon} />
                    <Text style={styles.footerButtonTextSelected}>Histórico</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigateToContato()} style={styles.footerButton}>
                    <Feather name="mail" style={styles.footerIcon}/>
                    <Text style={styles.footerButtonText}>Contato</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}