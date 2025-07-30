import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CheckBox from '@react-native-community/checkbox';

const AddPartyScreen = ({ route, navigation }) => {
    const { name, phone } = route.params || {};
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [type, setType] = useState('Customer');
    const [showAddress, setShowAddress] = useState(false);
    const [sameAsBilling, setSameAsBilling] = useState(true);

    // Billing address state
    const [billingAddress, setBillingAddress] = useState({
        area: '',
        pincode: '',
        city: '',
        state: '',
    });

    // Shipping address state
    const [shippingAddress, setShippingAddress] = useState({
        flat: '',
        area: '',
        pincode: '',
        city: '',
        state: '',
    });

    useEffect(() => {
        if (name) setFullName(name);
        if (phone) {
            const formatted = phone.replace(/\D/g, '').replace(/^91/, '');
            setMobile(formatted);
        }
    }, [name, phone]);

    const handleToggleAddress = () => setShowAddress(!showAddress);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                <View style={styles.phoneRow}>
                    <View style={styles.countryBox}>
                        <Text style={{ fontSize: 16 }}>🇮🇳</Text>
                        <Text style={{ fontSize: 16, marginLeft: 5 }}>+91</Text>
                    </View>
                    <TextInput
                        style={styles.phoneInput}
                        placeholder="Phone"
                        keyboardType="phone-pad"
                        value={mobile}
                        onChangeText={setMobile}
                    />
                </View>

                <Text style={styles.label}>Who are they?</Text>
                <View style={styles.radioGroup}>
                    {['Customer', 'Supplier'].map(option => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => setType(option)}
                            style={styles.radioItem}
                        >
                            <View style={styles.radioCircle}>
                                {type === option && <View style={styles.radioDot} />}
                            </View>
                            <Text style={styles.radioLabel}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity onPress={handleToggleAddress}>
                    <Text style={styles.optional}>
                        {showAddress ? '- HIDE GSTIN & ADDRESS' : '+ ADD GSTIN & ADDRESS (OPTIONAL)'}
                    </Text>
                </TouchableOpacity>

                {showAddress && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.sectionHeading}>Billing Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Area / Locality"
                            value={billingAddress.area}
                            onChangeText={(text) => setBillingAddress({ ...billingAddress, area: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Pincode"
                            keyboardType="numeric"
                            value={billingAddress.pincode}
                            onChangeText={(text) => setBillingAddress({ ...billingAddress, pincode: text })}
                        />
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, styles.half]}
                                placeholder="City"
                                value={billingAddress.city}
                                onChangeText={(text) => setBillingAddress({ ...billingAddress, city: text })}
                            />
                            <TextInput
                                style={[styles.input, styles.half]}
                                placeholder="State"
                                value={billingAddress.state}
                                onChangeText={(text) => setBillingAddress({ ...billingAddress, state: text })}
                            />
                        </View>

                        <View style={styles.checkboxRow}>
                            <CheckBox
                                value={sameAsBilling}
                                onValueChange={() => setSameAsBilling(!sameAsBilling)}
                            />
                            <Text style={styles.checkboxLabel}>
                                Shipping address same as billing address?
                            </Text>
                        </View>

                        {!sameAsBilling && (
                            <>
                                <Text style={styles.sectionHeading}>Shipping Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Flat / Building Number"
                                    value={shippingAddress.flat}
                                    onChangeText={(text) => setShippingAddress({ ...shippingAddress, flat: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Area / Locality"
                                    value={shippingAddress.area}
                                    onChangeText={(text) => setShippingAddress({ ...shippingAddress, area: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Pincode"
                                    keyboardType="numeric"
                                    value={shippingAddress.pincode}
                                    onChangeText={(text) => setShippingAddress({ ...shippingAddress, pincode: text })}
                                />
                                <View style={styles.row}>
                                    <TextInput
                                        style={[styles.input, styles.half]}
                                        placeholder="City"
                                        value={shippingAddress.city}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, city: text })}
                                    />
                                    <TextInput
                                        style={[styles.input, styles.half]}
                                        placeholder="State"
                                        value={shippingAddress.state}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, state: text })}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                )}

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>ADD CUSTOMER</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1, backgroundColor: '#fff' },
    inputWrapper: {
        borderRadius: 8,
        marginBottom: 16,
    },
    input: {
        height: 45,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 12,
        marginBottom: 15,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    countryBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    phoneInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        height: 45,
        borderRadius: 6,
        paddingHorizontal: 12,
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
        fontSize: 16,
    },
    radioGroup: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: '#388e3c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#388e3c',
    },
    radioLabel: {
        marginLeft: 8,
        fontSize: 15,
    },
    optional: {
        color: '#388e3c',
        marginBottom: 20,
        fontWeight: '500',
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 6,
        color: '#333',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 16,
    },
    checkboxLabel: {
        fontSize: 15,
        marginLeft: 8,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    half: {
        flex: 0.48,
    },
    button: {
        backgroundColor: '#388e3c',
        padding: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default AddPartyScreen;
