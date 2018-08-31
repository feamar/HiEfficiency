import {DefaultTheme} from 'react-native-paper';

const Theme = {
    ...DefaultTheme,
    colors:{
        ...DefaultTheme.colors,
        primary: "#3c6e71",
        primaryDark: "#376568",
        primaryLight: "#437e82",
        accent: "#284b63",
        selectedBackground: "#EFEFEF",
        typography:{
            title: "#434343",
            subtitle: "#A1A1A1"
        }
    },
    opacities: {
        text:{
            faded: 0.35
        }
    }
};

export default Theme;