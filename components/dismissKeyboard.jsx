import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View } from "react-native";

export default function DismissKeyboard({ children, justifyContent }) {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView style={{flex: 1}}>
                <View style={[{ flex: 1, justifyContent: (justifyContent ? justifyContent : "flex-start") }]}>
                    {children}
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}