import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform } from 'react-native'

const LoginForm = (props) => {
    return (
        <View>
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
            <TouchableOpacity style={styles.button} onPress={props.handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.handleSignUp} style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginForm

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
        fontFamily: Platform.OS  == 'android' ? 'sans-serif-light' : undefined,
        fontWeight: '200'
    }
})
