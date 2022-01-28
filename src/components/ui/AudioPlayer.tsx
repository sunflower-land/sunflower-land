import React, {useEffect, useRef, useState} from "react";
import play from 'assets/ui/player/play.png'
import pause from 'assets/ui/player/pause.png'
import skip_forward from 'assets/ui/player/skip-forward.png'
import music_note from 'assets/ui/player/music-note.png'
import chevron_right from 'assets/ui/player/chevron-right.png'
import {Button} from "components/ui/Button";
import icon from 'assets/brand/icon.png'
import {getSong, getSongCount} from 'assets/songs/playlist'
import {Panel} from "components/ui/Panel";

export const AudioPlayer: React.FC = () => {
  const [volume, setVolume] = useState<number>(0.8);
  const [visible, setIsVisible] = useState<boolean>(false);
  const [isPlaying, setPlaying] = useState<boolean>(true);
  const [songIndex, setSongIndex] = useState<number>(0);
  const musicPlayer = useRef<any>(null)

  const handlePlayState = () => {
    if (musicPlayer.current.paused) {
      musicPlayer.current.play();
    } else {
      musicPlayer.current.pause();
    }
    setPlaying(!isPlaying)
  }

  const handleVolume = (value: number) => {
    setVolume(value / 100)
    musicPlayer.current.volume = value / 100;
  }

  const handleNextSong = () => {
    if (getSongCount() === songIndex + 1) {
      setSongIndex(0)
    } else {
      setSongIndex(songIndex + 1)
    }
  }

  const song = getSong(songIndex);

  useEffect(() => {
    if (navigator.userAgent.match(/chrome|chromium|crios/i)) {
      // by the default Chrome policy doesn't allow autoplay
      setPlaying(false)
      musicPlayer.current.pause()
    }
  }, [])

  return (
    <div
      className='position-fixed right-2 bottom-20 z-50 w-48 h-fit -translate-x-50 transition-all duration-500 ease-in-out'
      style={{
        transform: `translateX(${visible ? 0 : 'calc(100% + 8px)'})`
      }}
    >
      <Panel>
        <audio
          ref={musicPlayer}
          onEnded={handleNextSong}
          onPause={() => setPlaying(!musicPlayer.current.paused)}
          onPlay={() => setPlaying(!musicPlayer.current.paused)}
          src={song.path}
          className='d-none'
          autoPlay
          controls
        />
        <div className='p-1'>
          <div className='mb-1.5 overflow-hidden bg-brown-200'>
            <p className='whitespace-no-wrap w-fit text-white font-italic text-sm'
               style={{
                 animation: 'marquee-like-effect 10s infinite linear',
                 whiteSpace: 'nowrap',
                 animationPlayState: isPlaying ? 'running' : 'paused'
               }}
            >{song.name} - {song.artist}</p>
          </div>
          {/* Controls */}
          <div className='flex space-x-1 justify-content-between'>
            <Button onClick={handlePlayState} className='w-8 h-8 sm:w-9 sm:h-8'>
              <img src={isPlaying ? pause : play} alt="play / pause button "/>
            </Button>
            <Button onClick={handleNextSong} className='w-8 h-8 sm:w-9 sm:h-8'>
              <img src={skip_forward} alt="next song button"/>
            </Button>
            {/*Custom volume range */}
            <div className='position-relative w-20'>
              <div
                className='h-full w-full position-absolute left-0 pointer-events-none'>
                {/*Thumb*/}
                <img
                  src={icon}
                  className='w-5 position-absolute top-50 z-50 pointer-events-none'
                  style={{
                    transform: `translate(${volume * 300}%,-50%)`,
                  }}/>
                {/*Track*/}
                <div className='w-full h-1.5 bg-brown-600 position-absolute top-50 -translate-y-1/2 rounded-md'/>
                {/*Track progress*/}
                <div
                  className='h-1.5 bg-white position-absolute top-50 -translate-y-1/2 rounded-md pointer-events-none'
                  style={{
                    width: `${volume * 100}%`,
                  }}
                />
              </div>
              <input
                type="range" value={volume * 100} onChange={e => handleVolume(parseFloat(e.target.value))}
                className='w-full position-absolute top-50 -translate-y-1/2 opacity-0 hover:cursor-pointer'
              />
            </div>
          </div>
        </div>
      </Panel>
      <div
        className={`position-absolute ${visible ? '-left-7 sm:-left-9' : '-left-11 sm:-left-12 sm:-translate-x-1'} bottom-0 transition-all -z-10 duration-500 ease-in-out w-fit z-50 flex align-items-center overflow-hidden`}
      >
        <Button
          onClick={() => setIsVisible(!visible)}
        >
          <img
            src={visible ? chevron_right : music_note}
            alt="show/hide music player"
            className='w-4 h-4 sm:w-6 sm:h-5'
          />
        </Button>
      </div>
    </div>
  )
};
