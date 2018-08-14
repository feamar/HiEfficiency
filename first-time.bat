npm install -g rimraf
cd android
gradlew clean
cd ../
rimraf node_modules
npm install
react-native run-android