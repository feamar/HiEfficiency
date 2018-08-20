/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

//TODO: Remove this as soon as we upgrade to react-native 0.57.0 and their issue #14209 is fixed.
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

YellowBox.ignoreWarnings(["Warning: Failed prop type: The prop 'onCancel' is marked as required in 'CustomDatePickerAndroid', but its value is 'null'."]);


AppRegistry.registerComponent(appName, () => App);
