import { Composition } from 'remotion';
import { Osaka, DURACION } from './Osaka';

export const Root = () => (
  <>
    <Composition id="osaka-es" component={Osaka} durationInFrames={DURACION} fps={30} width={1920} height={1080} defaultProps={{ lang: 'es' as const }} />
    <Composition id="osaka-en" component={Osaka} durationInFrames={DURACION} fps={30} width={1920} height={1080} defaultProps={{ lang: 'en' as const }} />
  </>
);
