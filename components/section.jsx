import { Animated, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { theme } from "../theme";
import { useState } from "react";

export default function Section({
    children,
    onPressBehaviour = "scale",
    style = {},
    onPress = null,
    onLongPress = null,
    onPressIn = null,
    onPressOut = null,
}) {


    //scale
    const [scaleAnim] = useState(new Animated.Value(1)); // Initial scale: 1
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };


    //fade
    const [fadeAnim] = useState(new Animated.Value(1)); // Initial opacity: 1
    const handleFadePressIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 10,
            useNativeDriver: true,
        }).start();
    }
    const handleFadePressOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    const handleFadeOut = () => { //fade out forever
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }




    let pressIn = () => { };
    let pressOut = () => { };

    switch (onPressBehaviour) {
        case "scale":
            pressIn = handlePressIn;
            pressOut = handlePressOut;
            break;
        case "fade":
            pressIn = handleFadePressIn;
            pressOut = handleFadePressOut;
            break;
        case "fade-out":
            pressIn = handleFadeOut;
            pressOut = () => { };
            break;
        case "none": 
            break;
        default:
            break;
    }

    let click = 0;


    return (
        <TouchableNativeFeedback style={[styles.section, style]}
            onPressIn={onPressIn || pressIn}
            onPressOut={onPressOut || pressOut}
            onLongPress={onLongPress}
            onPress={onPress}
        >
            <Animated.View
                style={[styles.section, {
                    opacity: fadeAnim,
                    transform: (onPressBehaviour == "scale" ? [{ scale: scaleAnim }] : [])
                }, style]}
            >
                {children}
            </Animated.View>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({
    section: {
        flex: 1,
        backgroundColor: theme.backgroundSection,
        marginVertical: 5,
        borderRadius: 10,
        padding: 15,
        gap: 3
    }
})