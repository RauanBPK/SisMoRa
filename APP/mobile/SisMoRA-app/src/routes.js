import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import {AsyncStorage, View} from 'react-native'

const AppStack = createStackNavigator();

import Main from './pages/Main';
import BatchHistory from './pages/BatchHistory';
import SensorHistory from './pages/SensorHistory';
import Contact from './pages/Contact';
import Tutorial from './pages/Tutorial'

export default function Routes() {
    const [isFirst, setIsFirst] = useState(true)
    const [resolved, setResolved] = useState(false)

      // Verifica se é a primeira vez que o usuário abre a app
      async function checkIfFirstTime() {
            
        try {
            var first = await AsyncStorage.getItem("@firstTime");
            if(first !== null){
                setIsFirst(false)
            }
        } catch (error) {
            setIsFirst(true)
        }
        setResolved(true)
    }

    useEffect(() => {

        checkIfFirstTime()
    }, []);
    
    if(resolved){
        return (
            <NavigationContainer>
                <AppStack.Navigator screenOptions={{ headerShown: false }}>
                    {/* {isFirst && ( */}
                        <AppStack.Screen name="Tutorial" component={Tutorial} />
                    {/* )} */}
                    <AppStack.Screen name="Main" component={Main} />
                    <AppStack.Screen name="BatchHistory" component={BatchHistory} />
                    <AppStack.Screen name="SensorHistory" component={SensorHistory} />
                    <AppStack.Screen name="Contact" component={Contact} />
                </AppStack.Navigator>
            </NavigationContainer>
        );
    }else{
        return(<View></View>)
    }
}