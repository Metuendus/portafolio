import { Composition } from 'remotion';
import { Hopper, DURACION } from './Hopper';

export const Root = () => (
  <>
    <Composition id="hopper-es" component={Hopper} durationInFrames={DURACION} fps={30} width={1920} height={1080} defaultProps={{ lang: 'es' as const }} />
    <Composition id="hopper-en" component={Hopper} durationInFrames={DURACION} fps={30} width={1920} height={1080} defaultProps={{ lang: 'en' as const }} />
  </>
);
