import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform } from 'react-native'

const SignUpForm = (props) => {
    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder='First Name'
                autoCapitalize='words'
                autoCorrect={false}
                value={props.firstName}
                onChangeText={firstName => props.handleChange('firstName', firstName)}
            />
            <TextInput
                style={styles.input}
                placeholder='Last name'
                autoCapitalize='words'
                autoCorrect={false}
                value={props.lastName}
                onChangeText={lastName => props.handleChange('lastName', lastName)}
            />
            <TextInput
                style={styles.input}
                placeholder='your@email.com'
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                value={props.email}
                onChangeText={email => props.handleChange('email', email)}
            />
            <TextInput
                style={styles.input}
                placeholder='Password'
                autoCapitalize='none'
                secureTextEntry
                autoCorrect={false}
                value={props.password}
                onChangeText={password => props.handleChange('password', password)}
            />
            <TouchableOpacity style={styles.button} onPress={props.handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button} onPress={props.handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity> */}
        </View>
    )
}

export default SignUpForm

const styles = StyleSheet.create({
    input: {
        height: 40,
        backgroundColor: '#C1D76D',
        color: '#FFF',
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'green',
        paddingVertical: 20,
        marginVertical: 10
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 23,
        fontFamily: Platform.OS == 'android' ? 'sans-serif-light' : undefined,
        fontWeight: '200'
    }
})
