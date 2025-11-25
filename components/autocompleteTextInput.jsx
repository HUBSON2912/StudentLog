import { useLayoutEffect, useRef, useState } from "react";
import { FlatList, Keyboard, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Menu, Text, TextInput, useTheme } from "react-native-paper";

export function AutocompleteTextInput({
    suggestions,
    renderSuggestion,
    label = "",
    value = "",
    onChangeText = (val) => { },
    containerStyle = {},
    textInputStyle = {},
    textInputMode = "outlined",
    error = false }) {



    const filterSuggestions = () => {
        let _sugg = [...suggestions];
        if (!value) {
            return _sugg;
        }

        _sugg = _sugg.filter(sg => sg.toLowerCase().includes(value.toLowerCase()));
        return _sugg;
    }

    const theme = useTheme();
    const styles = StyleSheet.create({
        suggestionListContainer: {
            maxHeight: 150,
            marginHorizontal: 10,
            position: "absolute",
            zIndex: 100,
            backgroundColor: theme.colors.background
        }
    });

    const [inputHeight, setInputHeight] = useState(0);
    const [focused, setFocused] = useState(false);

    return (
        <View style={containerStyle}>
            <TextInput
                mode={textInputMode}
                style={textInputStyle}
                value={value}
                onChangeText={(val) => { onChangeText(val); }}
                label={label}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onLayout={(event) => {
                    setInputHeight(event.nativeEvent.layout.height);
                }}
                error={error}
            />
            {
                focused && filterSuggestions().length != 0 &&

                <View style={[styles.suggestionListContainer, { top: inputHeight }]}>
                    <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="always">
                        {
                            filterSuggestions().map((value, index) => {
                                return (
                                    <Pressable key={index} onPress={() => {
                                        onChangeText(value);
                                        Keyboard.dismiss();
                                    }}>
                                        {
                                            renderSuggestion(value, index)
                                        }
                                    </Pressable>
                                );
                            })
                        }
                    </ScrollView>
                </View>
            }
        </View>
    );
}