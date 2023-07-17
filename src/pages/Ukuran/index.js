import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MyHeader } from '../../components'
import Pdf from 'react-native-pdf';
import { colors } from '../../utils';
export default function Ukuran({ navigation, route }) {
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.white
        }}>
            <MyHeader />
            <View style={{
                flex: 1,

            }}>
                <Pdf
                    trustAllCerts={false}
                    // source={{ uri: webURL + data.foto_pdf, cache: true }}
                    source={{
                        uri: 'https://jahit.okeadmin.com/ukuran.pdf', cache: true
                    }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={{
                        flex: 1,

                    }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})