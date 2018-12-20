import {DefaultTheme} from 'react-native-paper';

const Theme = {
    ...DefaultTheme,
    colors:{
        ...DefaultTheme.colors,
        primary: "#3c6e71",
        primaryDark: "#376568",
        primaryLight: "#437e82",
        accent: "#284b63",
        background: "transparent",
        selectedBackground: "#EFEFEF",
        error: "#cc0000",
        typography:{
            title: "#434343",
            subtitle: "#A1A1A1",
            hint: "#A1A1A1",
            subtitleDark: "#616161"
        },
        header: {
            typography:{
                title: "#FFFFFF",
                subtitle: "#EDEDED"
            }
        }
    },
    opacities: {
        text:{
            faded: 0.35
        },
        charts:
        {
            vsm: 0.40
        }
    }
};

export default Theme;