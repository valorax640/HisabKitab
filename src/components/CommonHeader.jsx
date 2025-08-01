import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure you have this package installed

const CommonHeader = ({
    title,
    onEditPress
}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.businessName}>{title}</Text>
            <TouchableOpacity onPress={onEditPress}>
                <Icon name="edit" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#388e3c',
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    businessName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },

});

export default CommonHeader;
