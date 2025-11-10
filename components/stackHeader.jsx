import { Appbar, Text, useTheme } from "react-native-paper";

export function StackHeader({ navigation, route, options, back }) {
    const theme = useTheme();
    return (
        <Appbar theme={theme} style={{}}>
            <Appbar.BackAction onPress={() => navigation.pop()} />
            {
                back &&
                <Appbar.Content title={options.title ?? route.name} />
            }
        </Appbar>
    );
}