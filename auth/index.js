import React from "react";
import { createRootNavigator } from "./router";
import firebase from 'firebase';
import 'firebase/auth';
import { hookIntoUserSignin } from './../FirebaseAdapter'

export default class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentDidMount() {
    hookIntoUserSignin(() => this.setState({ signedIn: true, checkedSignIn: true }),
                       () => this.setState({ signedIn: false, checkedSignIn: true }));
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
