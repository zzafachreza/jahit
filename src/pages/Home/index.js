import { Alert, StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Dimensions, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyHeader, MyInput } from '../../components';
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

export default function Home({ navigation, route }) {

  const [user, setUser] = useState({});
  const isFocus = useIsFocused();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const __getProduk = async () => {

    await getData('user').then(u => {
      setUser(u);
    })

    await axios.post(apiURL + 'produk').then(res => {
      console.log(res.data);
      setData(res.data);
    });
  }


  useEffect(() => {
    if (isFocus) {
      __getProduk();
    }
  }, [isFocus]);

  const __renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback>
        <View style={{
          flex: 1,
          padding: 10,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: colors.zavalabs,
          margin: 5,
        }}>
          <Image source={{
            uri: item.foto
          }} style={{
            width: '100%',
            height: 150,
          }} />
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: 13
          }}>{item.nama_produk}</Text>
          <Text style={{
            fontFamily: fonts.primary[800],
            fontSize: 15,
            color: colors.secondary,
          }}>Rp. {new Intl.NumberFormat().format(item.harga_produk)}</Text>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: 11
          }}>{item.keterangan_produk}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
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
          <Text style={{
            fontFamily: fonts.secondary[800],
            fontSize: 15,
            textAlign: 'left',
            left: 10,
            marginBottom: 5,
          }}>Produk Jadi</Text>
          <FlatList data={data} renderItem={__renderItem} numColumns={2} />
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('Order', user)} style={{
        flexDirection: 'row',
        padding: 20,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Icon type='ionicon' name='cart-outline' size={25} color={colors.white} />
        <Text style={{
          fontFamily: fonts.secondary[600],
          fontSize: 25,
          color: colors.white,
          left: 10,
        }}>Pesan Sekarang</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})