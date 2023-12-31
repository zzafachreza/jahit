import { Alert, StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Dimensions, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyHeader, MyInput, MyPicker } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { FloatingAction } from "react-native-floating-action";
import 'intl';
import 'intl/locale-data/jsonp/en';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import 'moment/locale/id';
import { color } from 'react-native-elements/dist/helpers';
import MyCarouser from '../../components/MyCarouser';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MyCalendar from '../../components/MyCalendar';

export default function OrderDetail({ navigation, route }) {


  const [item, setItem] = useState({});
  const [kirim, setKirim] = useState({
    id: route.params.id,
    foto_terima: 'https://zavalabs.com/nogambar.jpg'
  })

  const [loading, setLoading] = useState(false);

  const options = {
    includeBase64: true,
    quality: 0.5,
    maxWidth: 400
  };

  const [dataUkuran, setDataUkuran] = useState([]);


  const __getUkuran = () => {
    axios.post(apiURL + 'ukuran', {
      model: route.params.model
    }).then(res => {
      console.log('ukuran', res.data);
      setDataUkuran(res.data);
    })
  }


  const [user, setUser] = useState({});
  const isFocus = useIsFocused();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const getGallery = xyz => {
    launchImageLibrary(options, response => {
      // console.log('All Response = ', response);

      // console.log('Ukuran = ', response.fileSize);
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('Image Picker Error: ', response.error);
      } else {
        if (response.fileSize <= 2000000) {
          let source = { uri: response.uri };
          switch (xyz) {
            case 1:
              setKirim({
                ...kirim,
                foto_terima: `data:${response.type};base64, ${response.base64}`,
              });
              break;

          }
        } else {
          showMessage({
            message: 'Ukuran Foto Terlalu Besar Max 500 KB',
            type: 'danger',
          });
        }
      }
    });
  };

  const __getOrderDetail = async () => {

    await axios.post(apiURL + 'data_order_detail', {
      id: route.params.id
    }).then(res => {
      console.log(res.data[0]);
      setItem(res.data[0]);
    });
  }


  useEffect(() => {
    if (isFocus) {
      __getOrderDetail();
      __getUkuran();
    }
  }, [isFocus]);



  const MYlist = ({ label, value }) => {
    return (

      <View style={{
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: colors.zavalabs,
        padding: 10,
      }}>
        <Text style={{
          fontFamily: fonts.secondary[600],
          fontSize: 15,
        }}>{label}</Text>
        <Text style={{
          fontFamily: fonts.secondary[400],
          fontSize: 15,
        }}>{value}</Text>
      </View>
    )
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1) + ' (cm)';
  }



  return (

    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.white,
    }}>

      <MyHeader />
      <ScrollView showsVerticalScrollIndicator={false} style={{
        flex: 1,
      }}>
        <View style={{
          paddingHorizontal: '7%',
          paddingVertical: 10,
        }}>

          <View style={{
            flexDirection: 'row'
          }}>
            <MYlist label="Nomor Order" value={item.nomor_order} />
            <MYlist label="Tanggal" value={moment(item.tanggal).format('dddd, DD MMMM YYYY')} />
          </View>

          <View style={{
            flexDirection: 'row'
          }}>
            <MYlist label="Pembayaran" value={item.pembayaran} />
            <MYlist label="Jenis" value={item.jenis} />
          </View>

          <View style={{
            flexDirection: 'row'
          }}>
            <MYlist label="Kain" value={item.kain} />
            <MYlist label="Model" value={item.model} />
          </View>

          {item.kain == 'Dari Konsumen' &&
            <MYlist label="Kain Dikirim" value={item.dikirim} />
          }


          {item.model == 'Dari Konsumen' &&

            <View style={{
              padding: 10
            }}>
              <Text style={{
                fontFamily: fonts.secondary[600],
                fontSize: 13,
                marginBottom: 10,
              }}>Contoh Model</Text>
              <Image style={{
                width: 200,
                height: 200,
                resizeMode: 'contain'
              }} source={{
                uri: item.foto_model
              }} />
            </View>
          }


          <MYlist label="Produk" value={item.jenis == 'Produk Baru' ? 'Produk Baru' : item.produk} />
          {route.params.jenis == 'Produk Jadi' && <MYlist label="Ukuran" value={item.ukuran} />}

          {route.params.jenis == 'Produk Baru' &&

            <>

              {dataUkuran.length > 0 &&

                <View style={{
                  borderWidth: 1,
                  padding: 10,
                  borderColor: colors.secondary,
                  backgroundColor: colors.white,
                  borderRadius: 10,
                }}>
                  {dataUkuran.map(i => {
                    return (
                      <MYlist label={capitalizeFirstLetter(i.kolom.toString().replace("_", " ").replace("_", " "))} value={item[i.kolom]} />

                    )
                  })}
                </View>
              }


            </>}
          <MYlist label="Biaya" value={item.biaya} />
          <MYlist label="Alamat Kirim" value={item.alamat_kirim} />
          <MYlist label="Tanggal Kirim" value={moment(item.tanggal_kirim).format('dddd, DD MMMM YYYY') + ' ( ' + moment(item.tanggal_kirim).fromNow().toString().replace("dalam", "") + ' lagi )'} />
          <MYlist label="Status" value={item.status} />

          {item.status == 'DIKIRIM' &&
            <>
              <TouchableOpacity onPress={() => getGallery(1)} style={{
                width: '100%',
                height: 250,
                padding: 10,
                overflow: 'hidden',
                borderWidth: 1,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: colors.border
              }}>
                {kirim.foto_terima !== 'https://zavalabs.com/nogambar.jpg' && <Image source={{
                  uri: kirim.foto_terima
                }} style={{
                  width: '100%',
                  height: 230,
                  resizeMode: 'contain',
                  borderRadius: 10,
                }} />}
                {kirim.foto_terima == 'https://zavalabs.com/nogambar.jpg' &&
                  <>
                    <Image source={require('../../assets/camera.png')} style={{
                      width: 40,
                      height: 40,
                    }} /><Text style={{
                      fontFamily: fonts.secondary[400],
                      fontSize: 15,
                    }}>Bukti Sudah Terima</Text>

                  </>
                }

              </TouchableOpacity>
              <MyGap jarak={10} />

              <MyButton onPress={() => {
                Alert.alert(MYAPP, 'Apakah kamu yakin akan selesaikan pesananmu ?', [
                  { text: 'TIDAK' },
                  {
                    text: 'IYA',
                    onPress: () => {
                      axios.post(apiURL + 'data_order_update', kirim).then(res => {
                        console.log(res.data);
                        showMessage({
                          message: res.data.message,
                          type: 'success'
                        });
                        __getOrderDetail();
                      })
                    }
                  }
                ])
              }} Icons="checkbox" title="PESANAN SELESAI" />
            </>
          }

        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})