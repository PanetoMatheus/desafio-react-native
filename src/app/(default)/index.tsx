
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
export default function Index(){
    const router = useRouter();
    return (
        <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 20 }}>Index!</Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/MatchDetail')}>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 20 }}>Go to Match Detail</Text>
        </TouchableOpacity>
        </>
    );
}