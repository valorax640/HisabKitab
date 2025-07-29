import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
    FlatList,
    Pressable,
} from 'react-native';


const OtpScreen = ({route}) => {
    // const { phone } = route?.params;

    const [otp, setOtp] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.brand}>HisabKitab</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.language}>English ▼</Text>
                </TouchableOpacity>
            </View>

            {/* OTP Input Section */}
            <View style={{ flex: 1 }}>
                <Text style={styles.otpSentText}>An OTP was sent to your mobile number</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="Enter OTP"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        style={styles.phoneInput}
                        value={otp}
                        onChangeText={setOtp}
                        maxLength={6}
                    />
                </View>
            </View>

            {/* Get OTP Button */}
            <TouchableOpacity style={styles.otpButton}>
                <Text style={styles.otpButtonText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
    );
};

export default OtpScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f3f5',
        paddingHorizontal: 20,
    },
    brand: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#388e3c',
        fontFamily: 'sans-serif-medium',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 30,
    },
    language: {
        fontSize: 14,
        color: '#388e3c',
    },
    otpSentText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    languageItem: {
        paddingVertical: 12,
    },
    languageText: {
        fontSize: 16,
        color: '#333',
    },
    trustedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 40,
    },
    safeIcon: {
        height: 40,
        width: 40,
        marginRight: 10,
    },
    trustedText: {
        fontSize: 15,
        color: '#666',
    },
    inputRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#388e3c',
        alignItems: 'center',
        marginBottom: 20,
    },
    flagBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRightWidth: 1,
        borderColor: '#ccc',
    },
    flag: {
        height: 20,
        width: 30,
        marginRight: 8,
    },
    countryCode: {
        fontSize: 16,
        color: '#333',
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
    },
    otpButton: {
        marginBottom: 20,
        backgroundColor: '#388e3c',
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
    },
    otpButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
});
