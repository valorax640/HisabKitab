import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Modal,
    FlatList,
} from 'react-native';

const EntryScreen = ({navigation}) => {
    const [language, setLanguage] = useState('English');
    const [modalVisible, setModalVisible] = useState(false);

    const languageOptions = [
        { code: 'E', label: 'English' },
        { code: 'हिं', label: 'हिंदी' },
        { code: 'H', label: 'Hinglish' },
        { code: 'म', label: 'मराठी' },
        { code: 'ગુ', label: 'ગુજરાતી' },
        { code: 'ਪੰ', label: 'ਪੰਜਾਬੀ' },
        { code: 'த', label: 'தமிழ்' },
        { code: 'తె', label: 'తెలుగు' },
        { code: 'ಕ', label: 'ಕನ್ನಡ' },
        { code: 'বা', label: 'বাংলা' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#388e3c" barStyle="light-content" />

            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.brand}>HisabKitab</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.language}>{language} ▼</Text>
                </TouchableOpacity>
            </View>

            {/* Main Image */}
            <Image
                source={{
                    uri: 'https://plus.unsplash.com/premium_photo-1679496829715-364b4a17e087?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                }}
                style={styles.mainImage}
                resizeMode="cover"
            />

            {/* Description */}
            <Text style={styles.description}>
                Manage your business: Send reminders and{'\n'}receive payments!
            </Text>

            {/* Trust Text */}
            <View style={styles.trustRow}>
                <Text style={styles.trustText}>
                    Trusted by 5 Crore+ businesses across India
                </Text>
            </View>

            {/* Button */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>START USING HISABKITAB</Text>
            </TouchableOpacity>

            {/* Language Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.languageModal}>
                        <Text style={styles.modalTitle}>Select your language</Text>

                        <FlatList
                            data={languageOptions}
                            keyExtractor={(item) => item.label}
                            numColumns={2}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.languageCard}
                                    onPress={() => {
                                        setLanguage(item.label);
                                        setModalVisible(false);
                                    }}
                                >
                                    <View style={styles.languageIcon}>
                                        <Text style={styles.languageIconText}>{item.code}</Text>
                                    </View>
                                    <Text style={styles.languageLabel}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={styles.languageGrid}
                        />

                        <Text style={styles.privacyText}>
                            By continuing, you agree to our{' '}
                            <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
                            <Text style={styles.linkText}>T&C.</Text>
                        </Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default EntryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        padding: 12,
        paddingVertical: 20,
    },
    language: {
        fontSize: 14,
        color: '#388e3c',
    },
    mainImage: {
        width: '100%',
        flex: 1,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 50,
        paddingHorizontal: 20,
        fontWeight: '500',
    },
    trustRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    trustText: {
        fontSize: 13,
        color: '#444',
    },
    button: {
        backgroundColor: '#388e3c',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: 1,
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    languageModal: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 16,
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    languageGrid: {
        alignItems: 'center',
    },
    languageCard: {
        width: '45%',
        margin: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        flexDirection: 'row',
    },
    languageIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#388e3c',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    languageIconText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    languageLabel: {
        fontSize: 16,
        color: '#222',
    },
    privacyText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 18,
    },
    linkText: {
        color: '#388e3c',
        textDecorationLine: 'underline',
    },
});
