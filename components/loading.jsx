import { View } from "react-native";
import { theme } from "../theme";
import { CircleFade } from "react-native-animated-spinkit";

export default function Loading() {
    

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
            <CircleFade color={theme.primary} size={48}/>
        </View>
    )
}