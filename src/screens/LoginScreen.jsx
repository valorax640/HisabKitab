import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    PermissionsAndroid, 
    Platform, 
    Alert, 
    NativeModules,
    Modal
} from 'react-native';

const requestSmsPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.SEND_SMS,
                PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
            ];

            const granted = await PermissionsAndroid.requestMultiple(permissions);

            const allGranted = permissions.every(permission =>
                granted[permission] === PermissionsAndroid.RESULTS.GRANTED
            );

            return allGranted;
        } catch (err) {
            console.warn(err);
            return false;
        }
    }

    return true; // iOS: not applicable
};

const LoginScreen = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [simModalVisible, setSimModalVisible] = useState(false);
    const [availableSims, setAvailableSims] = useState([]);
    const [selectedSim, setSelectedSim] = useState(null);
    const { SmsModule, SimInfo } = NativeModules;

    // const checkSimSlotForUser = async () => {
    //     try {
    //         const sims = await SimInfo.getSimInfo(); // Array of { number, slotIndex, carrierName }
    //         const match = sims.find(sim => sim.number.endsWith(phone.slice(-8))); // Match last digits
    //         console.log('SIM Info:', sims);
            
    //         if (match) {
    //             console.log(`Logged-in number is in slot: ${match.slotIndex}`);
    //             return match.slotIndex;
    //         } else {
    //             console.log('Logged-in number not found in any SIM slot.');
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error('Failed to get SIM info:', error);
    //         return null;
    //     }
    // };

    const handleSendOtp = async () => {
        const hasPermission = await requestSmsPermission();
        if (!hasPermission) {
            Alert.alert('Permission denied', 'Cannot send SMS without permission.');
            return;
        }

        try {
            // Get available SIMs
            const sims = await SimInfo.getSimInfo();
            console.log('Available SIMs:', sims);

            // Use all SIM objects in the array
            const activeSims = sims;

            if (activeSims.length === 0) {
                Alert.alert('No SIM found', 'No SIM cards found in the device.');
                return;
            } else if (activeSims.length === 1) {
                // Single SIM - send OTP directly
                sendOtpToPhone(activeSims[0].slotIndex);
            } else {
                // Multiple SIMs - show selection modal
                setAvailableSims(activeSims);
                setSelectedSim(activeSims[0]); // Default to first SIM
                setSimModalVisible(true);
            }
        } catch (error) {
            console.error('Failed to get SIM info:', error);
            Alert.alert('Error', 'Failed to get SIM information. Sending OTP from default SIM.');
            sendOtpToPhone(0); // Fallback to slot 0
        }
    };

    const sendOtpToPhone = async (simSlot) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const message = `Your HisabKitab OTP is ${otp}`;

        try {
            await SmsModule.sendSmsFromSim(simSlot, `+91${phone}`, message);
            console.log(`Sending OTP to: ${phone} from SIM slot: ${simSlot}`);
            navigation.navigate('Otp', { phone, otp });
        } catch (error) {
            console.error('Failed to send SMS:', error);
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        }
    };

    const handleSimSelection = () => {
        if (selectedSim) {
            setSimModalVisible(false);
            sendOtpToPhone(selectedSim.slotIndex);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.brand}>HisabKitab</Text>
                <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.language}>English ▼</Text>
                </TouchableOpacity>
            </View>

            {/* Phone Input Row */}
            <View style={{ flex: 1 }}>
                <View style={styles.inputRow}>
                    <View style={styles.flagBox}>
                        <Image
                            source={{
                                uri: 'https://flagcdn.com/w40/in.png',
                            }}
                            style={styles.flag}
                        />
                        <Text style={styles.countryCode}>+91</Text>
                    </View>
                    <TextInput
                        placeholder="Mobile Number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        style={styles.phoneInput}
                        value={phone}
                        onChangeText={setPhone}
                        maxLength={10}
                    />
                </View>
            </View>

            {/* Get OTP Button */}
            <TouchableOpacity style={styles.otpButton} onPress={handleSendOtp}>
                <Text style={styles.otpButtonText}>GET OTP</Text>
            </TouchableOpacity>

            {/* SIM Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={simModalVisible}
                onRequestClose={() => setSimModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.simModalContainer}>
                        <Text style={styles.modalTitle}>Select SIM Card</Text>
                        <Text style={styles.modalSubtitle}>Choose which SIM to send OTP from</Text>
                        
                        {availableSims.map((sim, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.simOption,
                                    selectedSim?.slotIndex === sim.slotIndex && styles.selectedSimOption
                                ]}
                                onPress={() => setSelectedSim(sim)}
                            >
                                <View style={styles.simInfo}>
                                    <Text style={styles.simSlotText}>SIM {sim.slotIndex + 1}</Text>
                                    <Text style={styles.simCarrierText}>{sim.carrierName || 'Unknown Carrier'}</Text>
                                </View>
                                <View style={[
                                    styles.radioButton,
                                    selectedSim?.slotIndex === sim.slotIndex && styles.radioButtonSelected
                                ]}>
                                    {selectedSim?.slotIndex === sim.slotIndex && (
                                        <View style={styles.radioButtonInner} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setSimModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={handleSimSelection}
                            >
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default LoginScreen;


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
    // SIM Selection Modal Styles
    simModalContainer: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 24,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#388e3c',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    simOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#f9f9f9',
    },
    selectedSimOption: {
        borderColor: '#388e3c',
        backgroundColor: '#f0f8f0',
    },
    simInfo: {
        flex: 1,
    },
    simSlotText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    simCarrierText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    simNumberText: {
        fontSize: 12,
        color: '#999',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        borderColor: '#388e3c',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#388e3c',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    okButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#388e3c',
        alignItems: 'center',
    },
    okButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});
