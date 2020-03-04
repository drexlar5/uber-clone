import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import SignUpForm from '../components/SignUpForm';
import axios from 'axios';
import baseURL from '../baseUrl';
axios.defaults.baseURL = baseURL;

const Register = (props) => {
    const [state, setState] = useState({ email: '', password: '', errorMessage: '', firstName: '', lastName: '' });

    const handleChange = (name, value) => {
        let email = '';
        let password = '';
        let firstName = '';
        let lastName = '';
        if (name == 'email') {
            email = value
            setState({
                ...state, email
            })
        }
        else if (name == 'firstName') {
            firstName = value
            setState({
                ...state, firstName
            })
        }
        else if (name == 'lastName') {
            lastName = value
            setState({
                ...state, lastName
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
        setState({...state, errorMessage: ''})
        try {
            const { email, password, firstName, lastName } = state;
            const result = await axios.post('/signup', { email, password, firstName, lastName });
            console.log('result', result.data)
        } catch (error) {
            let errorMessage = error.response.data.message;
            setState({ ...state, errorMessage })
            console.log('error', errorMessage)
        }
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>My Taxxi</Text>
            <SignUpForm
                email={state.email}
                password={state.password}
                firstName={state.firstName}
                lastName={state.lastName}
                handleChange={handleChange}
                handleSignUp={handleSignUp}
            />
            <Text style={styles.errorMessage}>{state.errorMessage}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'beige'
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
    }

});

export default Register;
