import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, Image, Text, TouchableOpacity, Linking } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';
import iconImg from '../../assets/icon.png';
import styles from './styles';

const EMAIL = "";
const WHATS = "";

export default function Contact() {

    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');

    async function loadContact(){
        const res = await api.get('/contact');
        setWhatsapp(res.data.whatsapp);
        setEmail(res.data.email);
    }
    const navigation = useNavigation();

    function navigateToHistorico(incident) {
        navigation.navigate('BatchHistory', { incident });
    }
    function navigateToSensor(incident) {
        navigation.navigate('SensorHistory', { incident });
    }
    function navigateToHome(incident) {
        navigation.navigate('Main', { incident });
    }

    function sendMail(){
        // MailComposer.composeAsync({
        //     subject: `SisMoRA:`,
        //     recipients: [email],
        //     body: '',
        // })
        MailComposer.composeAsync({
            subject: `SisMoRA:`,
            recipients: [EMAIL],
            body: '',
        })
    };

    function sendWhatsapp(){
        //Linking.openURL(`whatsapp://send?phone=${whatsapp}`)
        Linking.openURL(`whatsapp://send?phone=${WHATS}`)
    };

    useEffect(() => {
        //loadContact(); //Ainda nao sei se carrego do server ou deixo hardcoded
    }, []);
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>

                <Image style={styles.icon} source={iconImg} />
                <Image style={styles.logo} source={logoImg} />

            </View>
            <View style={styles.about}>
                <Text style={styles.aboutText}>Este aplicativo foi desenvolvido para auxiliar 
                rizicultores da região Sul de Santa Catarina
                a tomarem decisões em relação à irrigação de suas
                 plantações utilizando a água do Rio Araranguá.
                </Text>
            </View>

            <View style={styles.contato}>
            <Text style={styles.contatoText}>
                Para sugestões, críticas ou reportar erros, utilize os meios abaixo:
                </Text>
                <TouchableOpacity style={styles.contatoButtonWhats} onPress={sendWhatsapp}>
                    <Feather name="phone" style={styles.contatoIcon}/>
                    <Text style={styles.contatoButtonText}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contatoButtonEmail} onPress={sendMail}>
                    <Feather name="mail" style={styles.contatoIcon}/>
                    <Text style={styles.contatoButtonText}>E-mail</Text>
                </TouchableOpacity>
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

                <TouchableOpacity onPress={() => { }} style={styles.footerButtonSelected}>
                    <Feather name="mail" style={styles.footerIcon} size={18} />
                    <Text style={styles.footerButtonTextSelected}>Contato</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}