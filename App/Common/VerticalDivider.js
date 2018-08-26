/**
 * @flow
 */

import React from 'react';
import {
    TouchableHighlight,
    TextInput,
    Image,
    View,
    StyleSheet,
} from 'react-native';

import * as C from '../Styles/Colors';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 1,
    },
    divider: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 0.5,
    },
});

export default function VerticalDivider() {
    return (
        <View style={[styles.container]}>
            <View style={[styles.divider, { backgroundColor: C.divider }]} />
        </View>
    );
}
