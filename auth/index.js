import React from "react";
import { createRootNavigator } from "./router";
import { isSignedIn } from "./auth";
import firebase from 'firebase';
import 'firebase/auth';

export default class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentDidMount() {
    console.ignoredYellowBox = ['Setting a timer'];
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.setState({ signedIn: true, checkedSignIn: true });
      } else {
        // No user is signed in.
        this.setState({ signedIn: false, checkedSignIn: true });
      }
    });
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn);
    return <Layout />;
  }
}
