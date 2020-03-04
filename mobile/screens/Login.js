import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LoginForm from '../components/LoginForm';
import axios from 'axios';
import baseURL from '../baseUrl';
import App from '../App'
axios.defaults.baseURL = baseURL;

const Login = (props) => {
    const [state, setState] = useState({ email: '', password: '', errorMessage: '', token: '', loading: true });

    const handleChange = (name, value) => {
        let email = '';
        let password = '';
        if (name == 'email') {
            email = value
            setState({
                ...state, email
            })
        }
        else {
            password = value
            setState({
                ...state, password
            })
        }
    }

    const handleSignUp = async () => {
        props.navigation.navigate('Sign Up')
    }

    const handleSignIn = async () => {
        setState({ ...state, errorMessage: '' })
        try {
            const { email, password } = state;
            const result = await axios.post('/login', { email, password });
            try {
                await AsyncStorage.setItem('token', JSON.stringify(result.data.token));
            } catch (error) {
                console.log('async error', error)
            }
            setState({ ...state, token: result.data.token })
            console.log('result', state.token)

        } catch (error) {
            let errorMessage = error.response.data.message;
            setState({ ...state, errorMessage })
            console.log('error', errorMessage)
        }
    }

    useEffect(() => {
        const getToken = async () => {
            try {
                // await AsyncStorage.removeItem('token');
                const tokenValue = await AsyncStorage.getItem('token');
                console.log('token', state.token, 'value', tokenValue, 'loading', state.loading);
                setState({ ...state, token: tokenValue, loading: false });
                // setState({ ...state, loading: false });
            } catch (error) {
                console.log('error', error);
            }
        }
        getToken();
    }, [state.token]);

    const login = (
        <View style={styles.container}>
            <Text style={styles.headerText}>My Taxxi</Text>
            <LoginForm
                email={state.email}
                password={state.password}
                handleChange={handleChange}
                handleSignIn={handleSignIn}
                handleSignUp={handleSignUp}
            />
            <Text style={styles.errorMessage}>{state.errorMessage}</Text>
            <Image source={require('../images/greencar.png')} style={styles.logo} />
        </View>
    )

    let animation = (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator
                animating={state.loading}
            />
        </View>
    )

    let main = (
        <App />
    )

    if (!state.loading && state.token) {
        return (
            <View>
                {main}
            </View>
        );
    }
    else if (!state.loading && !state.token) {
        return (
            <View style={styles.container}>
                {login}
            </View>
        )
    }
    else {
        return (
            <View>
                {animation}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'beige',
        paddingTop: 20,
    },
    headerText: {
        fontSize: 42,
        color: '#C1D76D',
        textAlign: 'center',
        fontFamily: Platform.OS == 'android' ? 'sans-serif-light' : undefined,
        marginTop: 30,
        fontWeight: '200'
    },
    errorMessage: {
        marginHorizontal: 10,
        fontSize: 18,
        color: 'red', //"#F5D7CC",
        fontWeight: 'bold'
    },
    logo: {
        width: 300,
        height: 300,
        alignSelf: 'center'
    }

});

export default Login;
