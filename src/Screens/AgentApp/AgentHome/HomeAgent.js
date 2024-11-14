import { FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import AgentHeader from '../../../Component/CustomHeader/AgentHeader'
import css from '../../../CssFile/Css'
import Fontisto from 'react-native-vector-icons/Fontisto'
import OrderCard from '../../../Component/AgentHomeComponents/OrderCard'
import instance from '../../../BaseUrl/BaseUrl'
import Loader from '../../../Component/Loader/Loader'
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import { removeHeaderState, removeallcart, draftremoveallcart, removeFilter } from '../../../redux/action'
import PendingCard from '../../../Component/AgentHomeComponents/PendingCard'
import { RadioButton } from 'react-native-paper';
import Button from '../../../Component/CreateNewOrderComponent/Button'

const HomeAgent = ({ navigation }) => {
    const [statusdata, setStatusData] = useState([])
    const [latestPending, setLatestPending] = useState([])
    const [IsLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [secondModalVisible, setSecondModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Single Ride');
    const [notificationCount, setNotificationCount] = useState({});
    const [statusCount, setStatusCount] = useState([]);
    const dispatch = useDispatch();

    const getStatus = async () => {
        try {
            setIsLoading(true)
            const response = await instance.get('/partners_orders')
            setStatusData(response?.data?.rides)
        } catch (error) {
            console.log('OrderFilterStatus Api', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getLatesPendings = async () => {
        try {
            setIsLoading(true)
            const response = await instance.get('/latest-Pending-Orders')
            setLatestPending(response?.data?.data)
        } catch (error) {
            console.log('latest pending Api', error)
        } finally {
            setIsLoading(false)
        }
    }


    const getCountByStatus = (status) => {
        return statusdata.filter(order => order?.overall_status === status).length
    }

    const getCountByLineStatus = (status) => {
        return statusdata.reduce((acc, order) => {
            return acc + order?.order_details.filter(detail => detail?.status === status).length
        }, 0)
    }

    useFocusEffect(
        React.useCallback(() => {
            getStatus();
            getLatesPendings();
            dispatch(removeFilter());
            handleNotificationUnreed();
        }, [])
    );

    const draftNavigation = () => {
        navigation.navigate('OrderFilterStatus', { status: 'draft' })
        dispatch(removeallcart())
        dispatch(removeHeaderState());
        dispatch(draftremoveallcart())
    }

    const handleSelectPackageType = () => {
        setModalVisible(false);
        setSecondModalVisible(true);
        // getVehicleType();
      };

      handleNotificationUnreed = async() => {
        try {
            const response = await instance.get('/notification/count')
            setNotificationCount(response.data)
        } catch (error) {
            console.log('Unreed Notification Home',error)
        }
      }

      handleStatusCount = async() => {
        try {
            const response = await instance.get('/status-count')
            setStatusCount(response?.data?.order_status_counts)
        } catch (error) {
            console.log('Unreed Notification Home',error)
        }
      }


    return (
        <View style={styles.MainContainer}>
            <StatusBar backgroundColor={css.primary} />
            <AgentHeader notification={notificationCount} onNotification={()=>navigation.navigate('Notification')} onPress={() => navigation.openDrawer()} />
            <ScrollView>
                <View style={[styles.TopCards, { marginTop: 10 }]}>
                    <Text style={styles.Boldtxt}>Zaroon Exclusive Offers</Text>
                    <ScrollView horizontal={true} style={{ marginTop: 5 }}>
                        <Image style={styles.Images} source={require('../../../assets/AgentHome/card1.png')} />
                        <Image style={styles.Images} source={require('../../../assets/AgentHome/card2.png')} />
                    </ScrollView>
                </View>

                <View style={styles.TopCards}>
                    <Text style={styles.Boldtxt}>Book a Order</Text>
                    <View style={styles.BookRide}>
                        <TouchableOpacity onPress={() => navigation.navigate('CreatedOrder')}
                            style={styles.BookButton}>
                            <Text style={[styles.TxtRide, { fontWeight: 'bold', paddingRight: 5 }]}>Book a ride</Text>
                            <Fontisto name='arrow-right-l' color='#fff' size={20} />
                        </TouchableOpacity>
                        {/* <Text style={[styles.TxtRide, { alignSelf: 'center', marginTop: 10 }]}>{latestPending?.length === 0 ? ' You have no active bookings' : 'Your recent active bookings'}</Text>
                        <ScrollView horizontal={true} style={{ marginTop: 10 }}>
                            {latestPending && latestPending.length > 0 && latestPending.map((order) => (
                                order.order_details.map((detail) => (
                                    <PendingCard
                                        key={detail?.id}
                                        date={`${detail?.date} ${detail?.pickup_time}`}
                                        from={detail?.rate_list?.route?.from}
                                        to={detail?.rate_list?.route?.to}
                                    />
                                ))
                            ))}
                        </ScrollView> */}
                    </View>
                </View>

                <View style={styles.TopCards}>
                    <Text style={styles.Boldtxt}>Order Status</Text>
                    <View>
                        <View style={styles.cardsDirection}>
                            {/* <OrderCard count={getCountByLineStatus('completed')} onPress={() => navigation.navigate('OrderLineFilterStatus', { status: 'completed' })} image={require('../../../assets/AgentHome/completed.png')} title={'Completed'} />
                            <OrderCard count={getCountByStatus('approved')} onPress={() => navigation.navigate('OrderFilterStatus', { status: 'approved' })} image={require('../../../assets/AgentHome/approved.png')} title={'Approved'} /> */}
                            <OrderCard style={styles.Count} count={getCountByStatus('draft')} onPress={draftNavigation} image={require('../../../assets/AgentHome/draft.png')} title={'Draft'} />
                            <OrderCard onPress={() => navigation.navigate('OrderStatus')} image={require('../../../assets/AgentHome/completed.png')} title={'Status'} />
                            <OrderCard onPress={() => navigation.navigate('Ledger')} title={'Ledger'} image={require('../../../assets/AgentHome/approved.png')}  />
                        </View>
                        {/* <View style={styles.cardsDirection}>
                            <OrderCard count={getCountByLineStatus('incomplete')} onPress={() => navigation.navigate('OrderLineFilterStatus', { status: 'incomplete' })} image={require('../../../assets/AgentHome/Incomplete.png')} title={'Incompleted'} />
                            <OrderCard count={getCountByStatus('unapproved')} onPress={() => navigation.navigate('OrderFilterStatus', { status: 'unapproved' })} image={require('../../../assets/AgentHome/rejected.png')} title={'Unapproved'} />
                            <OrderCard count={getCountByStatus('pending')} onPress={() => navigation.navigate('OrderFilterStatus', { status: 'pending' })} image={require('../../../assets/AgentHome/deadline.png')} title={'Pending'} />
                        </View>
                        <View style={styles.cardsDirection}>
                            <OrderCard count={getCountByLineStatus('cancelled')} onPress={() => navigation.navigate('OrderLineFilterStatus', { status: 'cancelled' })} image={require('../../../assets/AgentHome/calendar.png')} title={'Cancelled'} />
                        </View> */}
                    </View>
                </View>
            </ScrollView>

            {/* <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Option</Text>
                        <RadioButton.Group
                            onValueChange={newValue => setSelectedOption(newValue)}
                            value={selectedOption}
                        >
                            <RadioButton.Item label="Single Ride" value="Single Ride" />
                            <RadioButton.Item label="Packages" value="Packages" />
                        </RadioButton.Group>
                        <Button
                            label="OK"
                            color={'#000'}
                            onPress={handleSelectPackageType}
                        />
                    </View>
                </View>
            </Modal> */}


            {IsLoading && <Loader />}
        </View>
    )
}

export default HomeAgent

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },
    TopCards: {
        padding: 10,
    },
    Boldtxt: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#000',
    },
    BookRide: {
        backgroundColor: css.secondary,
        padding: 10,
        borderRadius: 10,
        margin: 10,
        paddingVertical:50
    },
    TxtRide: {
        color: '#fff',
        fontSize: 14,
    },
    BookButton: {
        padding: 8,
        marginVertical: 10,
        backgroundColor: css.primary,
        paddingHorizontal: 30,
        borderRadius: 5,
        flexDirection: 'row',
        width: 150,
        alignSelf: 'center',

    },
    cardsDirection: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        justifyContent: 'space-between',
        width: '80%',
        alignSelf: 'center',
    },
    Images: {
        margin: 4,
        height: 170,
        width: 290,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        // alignItems: 'center',
      },
      modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        color: '#000'
      },
      Count: {
        backgroundColor: '#DD3C3C',
        position: 'absolute',
        right: -8,
        top: -8,
        padding: 2,
        minHeight: 18,
        minWidth: 18,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
      },
})
