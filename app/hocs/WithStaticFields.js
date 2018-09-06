import React from "react";
import hoistNonReactStatics from 'hoist-non-react-statics';

export default withStaticFields = (source, target) =>
{   return hoistNonReactStatics(target, source);}
