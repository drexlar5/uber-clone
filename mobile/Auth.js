import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Register from './screens/Register';

const Stack = createStackNavigator();

const Auth = () => {

        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ title: '', headerTransparent: true }}
                    />
                    <Stack.Screen
                        name="Sign Up"
                        component={Register}
                        options={{ title: '', headerTransparent: true }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );

}

export default Auth

const styles = StyleSheet.create({})
