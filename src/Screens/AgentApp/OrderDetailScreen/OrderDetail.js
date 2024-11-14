import { FlatList, StyleSheet, View, Text, Touchable, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import css from '../../../CssFile/Css';
import SimpleHeader from '../../../Component/CustomHeader/SimpleHeader';
import TextLineCard from '../../../Component/CustomerScreenCard/TextLineCard';
import instance from '../../../BaseUrl/BaseUrl';
import Loader from '../../../Component/Loader/Loader';
import moment from 'moment';
import InnerCardFormat from '../../../Component/OrderStatus/InnerCardFormat';

const OrderDetail = ({ navigation, route }) => {
    const { orderData } = route.params;
    const [isLoading, setIsLoading] = useState(false);

    const UnApprovedRequest = async () => {
        const payload = {
            "order_no": orderData?.order_no,
            "name": orderData?.partner_customer?.name,
            "prefix_phone": orderData?.partner_customer?.prefix_phone,
            "prefix_whatsapp": orderData?.partner_customer?.prefix_whatsapp,
            "whatsapp_no": orderData?.partner_customer?.whatsapp_no,
            "phone_no": orderData?.partner_customer?.phone_no,
            "passport": orderData?.partner_customer?.passport,
            "cnic": orderData?.partner_customer?.cnic,
            "email": orderData?.partner_customer?.email,
            "address1": orderData?.partner_customer?.address1,
            "country": orderData?.partner_customer?.country,
            "city": orderData?.partner_customer?.city,
            "overall_adult": orderData?.order_details[0].adult,
            "overall_child": "0",
            "overall_bags": orderData?.order_details[0].bags,
            "trip_type": "Single trip",
            "rate_list_id": orderData.order_details.map(detail => detail.rate_list_id),
            "flight_num": orderData?.order_details?.map(detail => detail.flight_num),
            "airline_name": orderData?.order_details?.map(detail => detail.airline_name),
            "rate": orderData.order_details.map(detail => detail.rate),
            "vehicle_class_id": orderData?.vehicle_class_id,
            "overall_status": "pending",
            "adult": orderData.order_details.map(detail => detail.adult),
            "child": Array(orderData.order_details.length).fill(0),
            "bags": orderData.order_details.map(detail => detail.bags),
            "booking_amount": orderData?.booking_amount,
            "final_amount": orderData?.final_amount,
            "date": orderData.order_details.map(detail => detail.date),
            "pickup_time": orderData.order_details.map(detail => detail.pickup_time),
            "is_ac": orderData.order_details.map(detail => detail.is_ac),
            "customer_partner_id": orderData?.customer_partner_id,
        }
        try {
            setIsLoading(true);
            const response = await instance.post(`/update-order/${orderData?.id}`, payload)
            if (response?.data?.message) {
                ToastAndroid.show('Request sent', ToastAndroid.SHORT);
                navigation.goBack();
            }
        } catch (error) {
            console.log('UnApproved Api', error)
        } finally {
            setIsLoading(false);
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'cancelled':
                return '#DD3C3C'
            case 'completed':
                return '#18BA27'
            case 'incomplete':
                return 'purple'
            case 'pending':
                return '#F1A114'
            case 'approved':
                return '#5660AB'
            case 'unapproved':
                return '#1E2D45'
            case 'draft':
                return '#F58659'
            case 'paid':
                return '#2a74eb'
            case 'in_progress':
                return 'green'
            default:
                return '#fff'
        }
    }

    // console.log(JSON.stringify(orderData),'data')
    return (
        <View style={css.MainContainer}>
            <SimpleHeader onPress={() => navigation.goBack()} name='Order Detail' />

            <View style={styles.Header}>
                <View style={styles.mainView}>
                    <InnerCardFormat title='Order No' value={orderData?.order_no} />
                    <InnerCardFormat title='Customer Name' value={orderData?.partner_customer?.name} />
                </View>

                <View style={styles.mainView}>
                    <InnerCardFormat title='Created date' value={orderData?.created_at ? moment(orderData.created_at).format('YYYY-MM-DD') : 'N/A'} />
                    <InnerCardFormat title='Created Time' value={orderData?.created_at ? moment(orderData.created_at).format('h:mm a') : 'N/A'} />
                </View>

                <View style={styles.mainView}>
                    <InnerCardFormat title='Final Amount' value={orderData?.final_amount ?? 'N/A'} />
                    <InnerCardFormat title='Booking Amount' value={orderData?.booking_amount} />
                </View>
            </View>

            <View style={styles.TitleTopView}>
                <Text style={styles.Txt}>Rides</Text>
                {orderData?.overall_status === 'unapproved' && (
                    <TouchableOpacity onPress={UnApprovedRequest} style={styles.ButtonView}>
                        <Text style={styles.BtnTxt}>Resend Request</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ padding: 10, height: '68%', }}>
                <FlatList
                    data={orderData.order_details}
                    keyExtractor={(item) => item?.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.CardView}>
                            <View style={styles.TitleView}>
                                <Text style={[styles.statusTxt,{backgroundColor:getStatusColor(item?.status)}]}>{item?.status}</Text>
                            </View>
                            <TextLineCard title='Route' name={item?.rate_list?.name} />
                            <TextLineCard title='Rate' name={item?.rate} />
                            <TextLineCard title='Date' name={item?.date} />
                            <TextLineCard title='Pickup Time' name={item?.pickup_time} />
                            {item?.flight_num && (
                                <TextLineCard title='Flight No' name={item?.flight_num} />
                            )}
                            {item?.airline_name && (
                                <TextLineCard title='AirLine Name' name={item?.airline_name} />
                            )}
                        </View>
                    )}
                />
            </View>
            {isLoading && <Loader />}
        </View>
    )
}

export default OrderDetail

const styles = StyleSheet.create({
    CardView: {
        backgroundColor: '#fff',
        width: '95%',
        padding: 5,
        alignSelf: 'center',
        borderRadius: 10,
        marginBottom: 10,
        // paddingHorizontal: 20,
    },
    Header: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        justifyContent: 'space-between',
        width: '97%',
        alignSelf: 'center',
        marginTop: 10,
    },
    mainView: {
        flexDirection: 'row',
    },
    Txt: {
        fontWeight: 'bold',
        paddingHorizontal: 20,
        color: css.primary,
        fontSize: 25,
        marginTop: 10,
    },
    ButtonView: {
        backgroundColor: css.secondary,
        marginRight: 20,
        padding: 7,
        borderRadius: 5,
        marginTop: 7,
        paddingHorizontal: 10,
    },
    BtnTxt: {
        color: '#fff',
    },
    statusTxt: {
        color: '#fff',
        alignSelf: 'flex-end',
        fontSize: 12,
        padding:2,
        paddingHorizontal:10,
        borderRadius:20,
        marginBottom:3,
    },
    TitleTopView: {
        flexDirection:'row',
        justifyContent:'space-between'
    },
});
