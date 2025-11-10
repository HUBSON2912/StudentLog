import { Avatar } from "react-native-paper";

export function FloatingIconButton({ icon, size = 64, onPress = () => { }, right = null, bottom = null, left = null, top = null }) {

    let style = {};
    if (top || top == 0) {
        style.top = top;
    }
    else if (bottom || bottom == 0) {
        style.bottom = bottom;
    }

    if (left || left == 0) {
        style.left = left;
    }
    else if (right || right == 0) {
        style.right = right;
    }

    return (
        <Avatar.Icon icon={icon} size={size} onTouchEnd={onPress} style={{ position: "absolute", ...style }} />
    );
}