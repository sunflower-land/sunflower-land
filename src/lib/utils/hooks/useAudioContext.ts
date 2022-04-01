export const useAudioContext = () => {
  // for legacy browsers
  const AudioContext =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.AudioContext || (window as any).webkitAudioContext;
  // init web audio api
  const audioContext = new AudioContext();

  return [audioContext];
};
