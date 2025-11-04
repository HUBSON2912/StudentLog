import { Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from "react-native";
import { PaperProvider, } from "react-native-paper";
import { themeDark, themeLight } from "./theme";
import EditStudentScreen from "./screens/EditStudent";

export default function App() {
    const systemTheme = useColorScheme();
    const theme = systemTheme == "dark" ? themeDark : themeLight;

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
            flex: 1,
            paddingHorizontal: 20,
            gap: 10,
            paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0
        }
    });

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.container}>
                <EditStudentScreen />
            </SafeAreaView>
        </PaperProvider>
    );
}