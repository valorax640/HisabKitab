import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar,
    SafeAreaView,
    ScrollView,
    Modal,
    useWindowDimensions,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// Fallback component for when icons don't load
const IconFallback = ({ name, size = 20, color = '#000', style }) => {
    const iconMap = {
        'edit': '✏️',
        'picture-as-pdf': '📄',
        'arrow-forward': '→',
        'person-add': '👤+',
        'check-circle': '✓',
        'radio-button-unchecked': '○',
        'add': '+',
    };

    return (
        <Text style={[{ fontSize: size, color }, style]}>
            {iconMap[name] || '•'}
        </Text>
    );
};

// Try to import vector icons, fallback to our component if it fails
let Icon;
try {
    Icon = require('react-native-vector-icons/MaterialIcons').default;
} catch (error) {
    console.warn('Vector icons not available, using fallback');
    Icon = IconFallback;
}

const PartiesScreen = ({navigation}) => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'customers', title: 'Customers' },
        { key: 'suppliers', title: 'Suppliers' },
    ]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [kitabModalVisible, setKitabModalVisible] = useState(false);
    const [businessName, setBusinessName] = useState('My Business');
    const [tempBusinessName, setTempBusinessName] = useState('My Business');
    const [selectedKitab, setSelectedKitab] = useState('Shop');

    // Sample kitab data
    const [kitabs] = useState([
        { id: 1, name: 'Shop', customers: 0, isSelected: true },
        { id: 2, name: 'Bill', customers: 1, isSelected: false },
    ]);

    // Tab content components
    const CustomersRoute = () => (
        <ScrollView contentContainerStyle={styles.tabContent}>
            <Text style={styles.emptyText}>Add customers & collect payments faster</Text>
        </ScrollView>
    );

    const SuppliersRoute = () => (
        <ScrollView contentContainerStyle={styles.tabContent}>
            <Text style={styles.emptyText}>Add suppliers & manage payments</Text>
        </ScrollView>
    );

    const renderScene = SceneMap({
        customers: CustomersRoute,
        suppliers: SuppliersRoute,
    });

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            activeColor="#388e3c"
            inactiveColor="#555"
        />
    );

    const handleEditPress = () => {
        setTempBusinessName(businessName);
        setEditModalVisible(true);
    };

    const handleSave = () => {
        setBusinessName(tempBusinessName);
        setEditModalVisible(false);
    };

    const handleCancel = () => {
        setTempBusinessName(businessName);
        setEditModalVisible(false);
    };

    const handleChooseKitab = () => {
        setEditModalVisible(false);
        setKitabModalVisible(true);
    };

    const handleKitabSelect = (kitabName) => {
        setSelectedKitab(kitabName);
        setBusinessName(kitabName);
        setKitabModalVisible(false);
    };

    const renderKitabItem = (kitab) => (
        <TouchableOpacity
            key={kitab.id}
            style={[
                styles.kitabItem,
                kitab.isSelected && styles.selectedKitabItem
            ]}
            onPress={() => handleKitabSelect(kitab.name)}
        >
            <View style={styles.kitabIconContainer}>
                <Text style={styles.kitabIcon}>{kitab.name.charAt(0)}</Text>
            </View>
            <View style={styles.kitabInfo}>
                <Text style={styles.kitabName}>{kitab.name}</Text>
                <Text style={styles.kitabCustomers}>{kitab.customers} Customers</Text>
            </View>
            <View style={styles.kitabSelector}>
                <Icon
                    name={kitab.isSelected ? "check-circle" : "radio-button-unchecked"}
                    size={24}
                    color={kitab.isSelected ? "#2196F3" : "#ccc"}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#388e3c" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 15, marginBottom: 30 }}>
                    <Text style={styles.businessName}>{businessName}</Text>
                    <TouchableOpacity onPress={handleEditPress}>
                        <Icon name="edit" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.summaryRow}>
                    <View style={styles.summaryBox}>
                        <Text style={styles.label}>You will give</Text>
                        <Text style={styles.greenAmount}>₹ 0</Text>
                    </View>
                    <View style={styles.summaryBox}>
                        <Text style={styles.label}>You will get</Text>
                        <Text style={styles.redAmount}>₹ 0</Text>
                    </View>
                    <View style={styles.summaryBox}>
                        <Text style={styles.label}>QR Collections</Text>
                        <Text style={styles.blueAmount}>₹ 0</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.viewReports}>
                <Icon name="picture-as-pdf" size={16} color="#388e3c" />
                <Text style={styles.reportText}>VIEW REPORTS</Text>
            </TouchableOpacity>

            {/* Swipeable Tabs */}
            <View style={styles.tabViewContainer}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    renderTabBar={renderTabBar}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                />
            </View>

            {/* Add Customer Button */}
            <View style={styles.addCustomerRow}>
                <TouchableOpacity
                    style={styles.addCustomerBtn}
                    onPress={() => navigation.navigate('ContactList')}
                >
                    <Icon name="person-add" size={20} color="#000" />
                    <Text style={styles.addCustomerText}>ADD CUSTOMER</Text>
                </TouchableOpacity>
            </View>

            {/* Edit Business Name Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.editModalContainer}>
                        <Text style={styles.modalTitle}>Edit Business Name</Text>

                        <TextInput
                            style={styles.businessNameInput}
                            value={tempBusinessName}
                            onChangeText={setTempBusinessName}
                            placeholder="Enter business name"
                            placeholderTextColor="#999"
                            autoFocus={true}
                            selectTextOnFocus={true}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <TouchableOpacity>
                                <Text style={styles.modalBottomText}>Create New HisabKitab</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleChooseKitab}>
                                <Text style={styles.modalBottomText}>Choose another Kitab</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Choose Kitab Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={kitabModalVisible}
                onRequestClose={() => setKitabModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.kitabModalContainer}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {kitabs.map(renderKitabItem)}
                        </ScrollView>
                        
                        <TouchableOpacity style={styles.createNewKitabBtn}>
                            <Icon name="add" size={20} color="#fff" />
                            <Text style={styles.createNewKitabText}>CREATE NEW KHATABOOK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

export default PartiesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6fa',
    },
    header: {
        backgroundColor: '#388e3c',
        padding: 16,
    },
    businessName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    summaryRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
    },
    summaryBox: {
        alignItems: 'center',
        flex: 1,
    },
    // TabView Styles
    tabViewContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    tabBar: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tabIndicator: {
        backgroundColor: '#fbbf24',
        height: 3,
    },
    tabLabel: {
        fontWeight: '600',
        fontSize: 14,
    },
    tabContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        minHeight: 200,
    },
    label: {
        fontSize: 13,
        color: '#666',
    },
    greenAmount: {
        color: 'green',
        fontWeight: 'bold',
        marginTop: 4,
    },
    redAmount: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: 4,
    },
    blueAmount: {
        color: '#388e3c',
        fontWeight: 'bold',
        marginTop: 4,
    },
    viewReports: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        alignSelf: 'center',
    },
    reportText: {
        color: '#388e3c',
        marginLeft: 4,
        fontWeight: '600',
    },
    emptyText: {
        color: '#333',
        fontSize: 14,
        textAlign: 'center',
    },
    addCustomerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#e6f0ff',
        paddingVertical: 12,
        marginHorizontal: 10,
    },
    addCustomerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FDD835',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 30,
        marginLeft: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    addCustomerText: {
        color: '#000',
        marginLeft: 6,
        fontWeight: '600',
    },
    bottomTabs: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        paddingVertical: 8,
    },
    tabItem: {
        alignItems: 'center',
    },
    // Edit Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    editModalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    businessNameInput: {
        borderWidth: 1,
        borderColor: '#388e3c',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
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
    saveButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#388e3c',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    modalBottomText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#388e3c',
        textAlign: 'center',
        marginTop: 20,
    },
    // Kitab Modal Styles
    kitabModalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: '70%',
    },
    kitabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedKitabItem: {
        backgroundColor: '#f8f9ff',
        borderColor: '#2196F3',
        borderWidth: 2,
        marginHorizontal: 16,
        borderRadius: 12,
        marginVertical: 4,
    },
    kitabIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    kitabIcon: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    kitabInfo: {
        flex: 1,
    },
    kitabName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    kitabCustomers: {
        fontSize: 14,
        color: '#666',
    },
    kitabSelector: {
        marginLeft: 16,
    },
    createNewKitabBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3',
        marginHorizontal: 20,
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 12,
    },
    createNewKitabText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});