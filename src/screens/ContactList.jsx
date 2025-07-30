// ContactListScreen.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Image,
    StatusBar,
    SafeAreaView
} from 'react-native';
import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ContactListScreen = ({ navigation }) => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        requestContactsPermission();
    }, []);

    const requestContactsPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Contacts Permission',
                    message: 'This app would like to view your contacts.',
                    buttonPositive: 'Please accept',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                loadContacts();
            }
        } else {
            loadContacts();
        }
    };

    const loadContacts = () => {
        Contacts.getAll()
            .then(contacts => {
                const sorted = contacts.sort((a, b) =>
                    (a.displayName || '').localeCompare(b.displayName || '')
                );
                setContacts(sorted);
                setFilteredContacts(sorted);
            })
            .catch(err => console.warn(err));
    };

    const handleSearch = text => {
        setSearch(text);
        const filtered = contacts.filter(c =>
            (c.displayName || '').toLowerCase().includes(text.toLowerCase())
        );
        setFilteredContacts(filtered);
    };

    const renderItem = ({ item }) => {
        const name = item.displayName || 'Unknown';
        const phone = item.phoneNumbers[0]?.number || 'No Number';
        const initial = name.charAt(0).toUpperCase();

        return (
            <TouchableOpacity
                style={styles.contactItem}
                onPress={() =>
                    navigation.navigate('AddCustomer', {
                        name: item.displayName,
                        phone: item.phoneNumbers[0]?.number || '',
                    })
                }
            >
                {item.hasThumbnail && item.thumbnailPath ? (
                    <Image source={{ uri: item.thumbnailPath }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initial}</Text>
                    </View>
                )}
                <View>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.phone}>{phone}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#388e3c" barStyle="light-content" />

            <View style={styles.searchContainer}>
                <TextInput
                    value={search}
                    onChangeText={handleSearch}
                    placeholder="Customer name"
                    style={styles.searchInput}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch('')}>
                        <Icon name="close" size={20} color="#000" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                style={styles.addCustomer}
                onPress={() => navigation.navigate('AddCustomer')}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="add-circle-outline" size={35} color="#388e3c" />
                    <Text style={styles.addText}>Add Customer</Text>
                </View>
                <MaterialIcon name="chevron-right" size={35} color="#388e3c" />
            </TouchableOpacity>

            <FlatList
                data={filteredContacts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#fff'
    },
    searchContainer: {
        marginTop: 30,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 10,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        height: 50,
    },
    addCustomer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
        justifyContent: 'space-between',
    },
    addText: {
        marginLeft: 8,
        fontSize: 20,
        color: '#388e3c',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    avatar: {
        backgroundColor: '#388e3c',
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    name: {
        fontSize: 16,
        color: '#000',
    },
    phone: {
        fontSize: 14,
        color: '#555',
    },
});

export default ContactListScreen;
