declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  const content: React.ComponentType<SvgProps>;
  export default content;
}

