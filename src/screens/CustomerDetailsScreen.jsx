import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const entries = [
    {
        dateLabel: '31 Jul 25 • Today',
        items: [
            {
                time: '05:23 PM',
                balance: '₹ 1,000',
                amount: '₹ 4,000',
                type: 'got',
            },
        ],
    },
    {
        dateLabel: '30 Jul 25 • Yesterday',
        items: [
            {
                time: '03:12 PM',
                balance: '₹ 5,000',
                amount: '₹ 2,000',
                type: 'gave',
            },
        ],
    },
    {
        dateLabel: '29 Jul 25 • 2 days ago',
        items: [
            {
                time: '10:45 AM',
                balance: '₹ 3,000',
                amount: '₹ 3,000',
                type: 'got',
            },
        ],
    },
    {
        dateLabel: '28 Jul 25 • 3 days ago',
        items: [
            {
                time: '06:06 PM',
                balance: '₹ 3,000',
                amount: '₹ 3,000',
                type: 'gave',
            },
        ],
    },
    {
        dateLabel: '27 Jul 25 • 4 days ago',
        items: [
            {
                time: '11:00 AM',
                balance: '₹ 2,000',
                amount: '₹ 1,000',
                type: 'got',
            },
        ],
    },
    {
        dateLabel: '26 Jul 25 • 5 days ago',
        items: [
            {
                time: '02:30 PM',
                balance: '₹ 1,000',
                amount: '₹ 500',
                type: 'gave',
            },
        ],
    },
    {
        dateLabel: '25 Jul 25 • 6 days ago',
        items: [
            {
                time: '01:00 PM',
                balance: '₹ 500',
                amount: '₹ 700',
                type: 'got',
            },
        ],
    },
    {
        dateLabel: '24 Jul 25 • 1 week ago',
        items: [
            {
                time: '04:50 PM',
                balance: '₹ 1,200',
                amount: '₹ 1,200',
                type: 'gave',
            },
        ],
    },
    {
        dateLabel: '23 Jul 25 • 1 week ago',
        items: [
            {
                time: '09:00 AM',
                balance: '₹ 0',
                amount: '₹ 1,000',
                type: 'got',
            },
        ],
    },
    {
        dateLabel: '22 Jul 25 • 9 days ago',
        items: [
            {
                time: '12:00 PM',
                balance: '₹ 1,000',
                amount: '₹ 1,000',
                type: 'gave',
            },
        ],
    },
];


export default function CustomerDetailsScreen() {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#388e3c" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Image
                    source={{ uri: 'https://via.placeholder.com/40' }}
                    style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.customerName}>Suman TIB</Text>
                    <Text style={styles.viewSettings}>View settings</Text>
                </View>
                <View style={styles.customerBadge}>
                    <Text style={styles.customerBadgeText}>Customer</Text>
                </View>
                <TouchableOpacity style={{ marginLeft: 10 }}>
                    <Icon name="call" size={22} color="white" />
                </TouchableOpacity>
            </View>

            {/* Balance */}
            <View style={styles.balanceCard}>
                <Text style={{ color: '#666' }}>You will give</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'green' }}>₹ 1,000</Text>
            </View>

            {/* Actions */}
            <View style={styles.actionBar}>
                <TouchableOpacity>
                    <Text style={styles.actionText}>📄 Report</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.actionTextGray}>🕓 Reminder</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.actionTextGray}>💬 SMS</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {entries.map((section, index) => (
                    <View key={index}>
                        <View style={styles.dateLabel}>
                            <Text style={styles.dateText}>{section.dateLabel}</Text>
                        </View>

                        {section.items.map((item, idx) => (
                            <View style={styles.entryRow} key={idx}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.entryTime}>{item.time}</Text>
                                    <Text style={styles.entryBalance}>Bal. {item.balance}</Text>
                                </View>

                                {item.type === 'gave' ? (
                                    <View style={styles.gaveBox}>
                                        <Text style={styles.gaveAmount}>{item.amount}</Text>
                                    </View>
                                ) : (
                                    <View style={styles.gotBox}>
                                        <Text style={styles.gotAmount}>{item.amount}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.gaveBtn}>
                    <Text style={styles.footerBtnText}>YOU GAVE ₹</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gotBtn}>
                    <Text style={styles.footerBtnText}>YOU GOT ₹</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },

    header: {
        backgroundColor: '#388e3c',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    avatar: {
        width: 40, height: 40, borderRadius: 20, marginHorizontal: 10,
    },
    customerName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    viewSettings: { color: 'white', fontSize: 12 },
    customerBadge: {
        backgroundColor: '#003580',
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    customerBadgeText: { color: 'white', fontSize: 10 },

    balanceCard: {
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 4,
        alignItems: 'center',
    },

    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    actionText: { color: 'blue', fontWeight: 'bold' },
    actionTextGray: { color: '#bbb' },

    dateLabel: {
        backgroundColor: '#eee',
        paddingVertical: 4,
        alignItems: 'center',
        marginTop: 10,
    },
    dateText: { color: '#333', fontSize: 12 },

    entryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    entryTime: { color: '#444', fontWeight: '600' },
    entryBalance: { color: '#999', fontSize: 12 },

    gaveBox: {
        backgroundColor: '#ffe6e6',
        padding: 10,
        borderRadius: 5,
    },
    gotBox: {
        backgroundColor: '#e6ffee',
        padding: 10,
        borderRadius: 5,
    },
    gaveAmount: {
        color: 'red', fontWeight: 'bold',
    },
    gotAmount: {
        color: 'green', fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 15,
        justifyContent: 'space-between',
        gap: 15,
        backgroundColor: '#ccc',
    },
    gaveBtn: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        padding: 15,
        width: '50%',
        borderRadius: 5,
    },
    gotBtn: {
        flex: 1,
        backgroundColor: 'green',
        alignItems: 'center',
        padding: 15,
        width: '50%',
        borderRadius: 5,
    },
    footerBtnText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
