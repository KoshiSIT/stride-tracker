import { StyleSheet, Text, View , Image, FlatList, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import React,{useEffect, useState} from 'react';
import Constants from 'expo-constants';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import Data from '../components/user/Data';
import Achivements from '../components/user/Achievements';
import Activity from '../components/user/Activity';
import ShoeTracker from '../components/user/ShoeTracker';
import Goal from '../components/user/Goal';
import Insite from '../components/user/Insite';
import WeeklyWorkout from '../components/user/WeeklyWorkout';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function UserScreen({}){
    const { firstName, profileImage, lastName } = useAppContext();
    const navigation = useNavigation();
    useEffect(()=>{
    },[]);

    const goAppSettings = () => {
        navigation.navigate('AppSettings');
    };

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <TouchableOpacity onPress={()=> goAppSettings()}>
                    <FeatherIcon name="settings" size={30} color= "black" />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={styles.userContainer}>
                    <View style={styles.nameContainer}>
                        <View style ={styles.circle}>
                            <TouchableOpacity onPress ={()=>handleImagePick()}>
                                <MaterialCommunityIcons name="camera-outline" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.name}>{firstName+lastName}</Text>
                    </View>
                    <View style={styles.followContainer}>
                        <View style={styles.followItem1}>
                            <Text style={styles.followText}>1km</Text>
                            <Text style={styles.followText2}>合計(km)</Text>
                        </View>
                        <View style={styles.followItem2}>
                            <Text style={styles.followText}>0</Text>
                            <Text style={styles.followText2}>フォロワー</Text>
                        </View>
                        <View style={styles.followItem3}>
                            <Text style={styles.followText}>0</Text>
                            <Text style={styles.followText2}>フォロー中</Text>
                        </View>
                    </View>
                    <View style ={styles.subscribeContainer}>
                    </View>
                </View>
                <Data/>
                <Achivements/>
                <Activity/>
                <ShoeTracker/>
                <Goal/>
                <Insite/>
                <WeeklyWorkout/>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 0,
    },
    titleContainer:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 10,
    },
    subscribeContainer:{
        height: 40,
    },
    userContainer:{
        height: 180,
    },
    nameContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    name:{
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    circle:{
        height : 50,
        width : 50,
        borderRadius : 25,
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    
        elevation: 5,
    },
    followContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    followItem1:{
        borderWidth: 1,
        flex: 1,
        height: '100%'
    },
    followItem2:{
        borderWidth: 1,
        flex: 1,
        height: '100%'
    },
    followItem3:{
        borderWidth: 1,
        flex: 1,
        height: '100%'
    },
    followText:{
        fontSize: 15,
        fontWeight: 'bold',
    },
    followText2:{
        fontSize: 13,
    },

});