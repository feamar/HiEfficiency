import hoistNonReactStatics from 'hoist-non-react-statics/dist/hoist-non-react-statics.cjs';

export default withStaticFields = (source, target) =>
{   return hoistNonReactStatics(target, source);}
