import {DefaultTheme} from 'react-native-paper';

const Theme = {
    ...DefaultTheme,
    colors:{
        ...DefaultTheme.colors,
        primary: "#FF5722",
        primaryDark: "#E64A19",
        primaryLight: "#FF8A65",
        accent: "#FFC107",
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