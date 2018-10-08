import hoistNonReactStatics from 'hoist-non-react-statics/dist/hoist-non-react-statics.cjs';

export default (source: any, target: any) =>
{   return hoistNonReactStatics(target, source);}
