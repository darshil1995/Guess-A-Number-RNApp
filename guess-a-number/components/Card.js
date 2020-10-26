import React from 'react';
import {StyleSheet, View} from 'react-native';

const Card = props =>{
    return (
    <View style={{...styles.card,...props.style}}>{props.children}</View>
    );
};

const styles = StyleSheet.create({
    card:{
        padding:20,
        shadowColor:'black',
        shadowOffset:{width:0,height:2},
        shadowRadius:16,
        shadowOpacity:0.26,
        elevation:8,
        borderRadius:10,
        backgroundColor:'white'
    },
});

export default Card;