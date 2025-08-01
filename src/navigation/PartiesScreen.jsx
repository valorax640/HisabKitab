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
    FlatList,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CommonHeader from '../components/CommonHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PartiesScreen = ({ navigation }) => {
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
    const [selectedKitab, setSelectedKitab] = useState('Bill');

    // Sample kitab data
    const [kitabs] = useState([
        { id: 1, name: 'Shop', customers: 0, isSelected: false },
        { id: 2, name: 'Bill', customers: 1, isSelected: true },
    ]);

    const customers = [
        { name: 'Suman TIB', amount: '₹ 3,000', date: '2 days ago', type: 'got' },
        { name: 'Rakesh Kumar', amount: '₹ 1,200', date: '1 day ago', type: 'gave' },
        { name: 'Priya Sharma', amount: '₹ 500', date: '3 days ago', type: 'got' },
        { name: 'Aman Verma', amount: '₹ 2,700', date: '5 days ago', type: 'gave' },
        { name: 'Deepika S.', amount: '₹ 800', date: '6 days ago', type: 'got' },
        { name: 'Raj Tiwari', amount: '₹ 900', date: '2 days ago', type: 'got' },
        { name: 'Sunil Mehta', amount: '₹ 4,000', date: '1 day ago', type: 'gave' },
        { name: 'Alok Jain', amount: '₹ 350', date: '4 days ago', type: 'got' },
        { name: 'Meena Kumari', amount: '₹ 2,100', date: '1 week ago', type: 'gave' },
        { name: 'Suresh Das', amount: '₹ 450', date: '2 weeks ago', type: 'got' },
        { name: 'Anjali D.', amount: '₹ 1,700', date: '3 weeks ago', type: 'gave' },
        { name: 'Vipul Thakur', amount: '₹ 2,200', date: '4 days ago', type: 'got' },
        { name: 'Harshit K.', amount: '₹ 600', date: 'Yesterday', type: 'gave' },
        { name: 'Kiran Bedi', amount: '₹ 900', date: 'Today', type: 'got' },
        { name: 'Zoya Khan', amount: '₹ 1,300', date: 'Today', type: 'gave' },
    ];


    // Tab content components
    const CustomersRoute = () => (
        <>
            <View style={{ backgroundColor: '#388e3c', paddingVertical: 10 }}>
                <View style={styles.summaryColumn}>
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
                    <TouchableOpacity style={styles.viewReports}>
                        <Icon name="assessment" size={16} color="#388e3c" />
                        <Text style={styles.reportText}>VIEW REPORTS</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.searchRow}>
                <TextInput placeholder="Search Customer" style={styles.searchInput} />
                <Icon name="filter-list" size={24} style={{ marginHorizontal: 10 }} />
                <Text style={{ color: 'blue' }}>📘 Cashbook</Text>
            </View>
            <FlatList
                data={customers}
                keyExtractor={(_, i) => i.toString()}
                ListHeaderComponent={
                    <>

                    </>
                }
                renderItem={({ item }) => (
                    <View style={styles.customerItem}>
                        <Image
                            source={{ uri: 'https://t4.ftcdn.net/jpg/08/06/58/03/240_F_806580330_nM9J5dzapvn7hGqEetnMThzp9qZn0HT9.jpg' }}
                            style={styles.avatar}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.customerName}>{item.name}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                        <View style={{ flexDirection:'column', alignItems: 'center' , justifyContent: 'center'}}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: item.type === 'got' ? 'green' : 'red',
                                    marginHorizontal: 10,
                                }}
                            >
                                {item.amount}
                            </Text>
                            {item.type === 'gave' && (
                                <TouchableOpacity>
                                    <Text style={styles.remind}>REMIND</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.tabContent}
            />
        </>
    );


    const SuppliersRoute = () => (
        <ScrollView contentContainerStyle={styles.tabContent}>
            <View style={{ backgroundColor: '#388e3c', paddingVertical: 10 }}>
                <View style={styles.summaryColumn}>
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
                    <TouchableOpacity style={styles.viewReports}>
                        <Icon name="assessment" size={16} color="#388e3c" />
                        <Text style={styles.reportText}>VIEW REPORTS</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.emptyText}>Add suppliers & manage payments</Text>
        </ScrollView>
    );

    const renderScene = SceneMap({
        customers: CustomersRoute,
        suppliers: SuppliersRoute,
    });

    const renderTabBar = props => (
        <View style={{ backgroundColor: '#388e3c' }}>
            <TabBar
                {...props}
                indicatorStyle={styles.tabIndicator}
                style={styles.tabBar}
                labelStyle={styles.tabLabel}
                activeColor="#fff"
                inactiveColor="#ccc"
            />
        </View>
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
                    color={kitab.isSelected ? "#388e3c" : "#ccc"}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#388e3c" barStyle="light-content" />

            {/* Header */}
            <CommonHeader title={businessName} onEditPress={handleEditPress} />

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
    businessName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    summaryColumn: {
        backgroundColor: '#388e3c',
        flexDirection: 'column',
        alignItems: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        padding: 10,
        borderTopStartRadius: 6,
        borderTopEndRadius: 6,
        width: '90%',
        alignSelf: 'center',
    },
    summaryBox: {
        alignItems: 'center',
        flex: 1,
    },
    tabViewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabBar: {
        backgroundColor: '#388e3c',
        elevation: 0,
        shadowOpacity: 0,
        width: '50%',
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
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderBottomStartRadius: 6,
        borderBottomEndRadius: 6,
        alignSelf: 'center',
        width: '90%',
        justifyContent: 'center',
        borderTopWidth: 0.5,
        borderColor: '#ddd',
    },
    reportText: {
        color: '#388e3c',
        marginLeft: 4,
        fontWeight: '600',
        fontSize: 12,
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
        borderRadius: 12,
        marginVertical: 4,
    },
    kitabIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#388e3c',
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
        backgroundColor: '#388e3c',
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
    searchRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        borderRadius: 6,
        paddingHorizontal: 10,
        height: 40,
    },
    customerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#fff',
        marginBottom: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    customerName: { fontWeight: 'bold' },
    date: { color: '#888', fontSize: 12 },
    amount: { fontWeight: 'bold', color: 'red', marginHorizontal: 10 },
    remind: { color: '#007bff', fontSize: 12 },
});