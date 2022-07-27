import React, { useEffect, useRef, useState } from "react";
import { Howler } from "howler";
import play from "assets/ui/music_player/play.png";
import pause from "assets/ui/music_player/pause.png";
import skip_forward from "assets/ui/music_player/skip-forward.png";
import music_note from "assets/ui/music_player/music-note.png";
import chevron_right from "assets/ui/music_player/chevron-right.png";
import volume_down from "assets/ui/music_player/volume-down.png";
import volume_up from "assets/ui/music_player/volume-up.png";
import { Button } from "components/ui/Button";
import {
  getFarmingSong,
  getFarmingSongCount,
  getGoblinSong,
  getGoblinSongCount,
} from "assets/songs/playlist";
import { Panel } from "components/ui/Panel";
import { useStepper } from "lib/utils/hooks/useStepper";

enum AudioLocalStorageKeys {
  audioMuted = "settings.audioMuted",
  musicPaused = "settings.musicPaused",
  musicVolume = "settings.musicVolume",
}

function cacheAudioSetting(
  key: AudioLocalStorageKeys,
  value: boolean | number
) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCachedAudioSetting<T>(
  key: AudioLocalStorageKeys,
  defaultValue: T
): T {
  const cached = localStorage.getItem(key);

  return cached ? JSON.parse(cached) : defaultValue;
}

interface Props {
  isFarming?: boolean;
}

export const AudioPlayer: React.FC<Props> = ({ isFarming }) => {
  const volume = useStepper({
    initial: getCachedAudioSetting<number>(
      AudioLocalStorageKeys.musicVolume,
      0.1
    ),
    step: 0.1,
    max: 1,
    min: 0,
  });
  const [visible, setIsVisible] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(
    getCachedAudioSetting<boolean>(AudioLocalStorageKeys.audioMuted, false)
  );
  const [musicPaused, setMusicPaused] = useState<boolean>(
    getCachedAudioSetting<boolean>(AudioLocalStorageKeys.musicPaused, false)
  );
  const [songIndex, setSongIndex] = useState<number>(0);
  const musicPlayer = useRef<any>(null);

  const handleNextSong = () => {
    const songCount = isFarming ? getFarmingSongCount() : getGoblinSongCount();
    if (songCount === songIndex + 1) {
      setSongIndex(0);
    } else {
      setSongIndex(songIndex + 1);
    }
  };

  const song = isFarming ? getFarmingSong(songIndex) : getGoblinSong(songIndex);

  useEffect(() => {
    Howler.mute(audioMuted);
    cacheAudioSetting(AudioLocalStorageKeys.audioMuted, audioMuted);
  }, [audioMuted]);

  useEffect(() => {
    if (musicPaused) {
      musicPlayer.current.pause();
    } else {
      musicPlayer.current.play();
    }
    cacheAudioSetting(AudioLocalStorageKeys.musicPaused, musicPaused);
  }, [musicPaused]);

  useEffect(() => {
    musicPlayer.current.volume = volume.value;
    cacheAudioSetting(AudioLocalStorageKeys.musicVolume, volume.value);
  }, [volume.value]);

  useEffect(() => {
    if (navigator.userAgent.match(/chrome|chromium|crios/i)) {
      // by the default Chrome policy doesn't allow autoplay
      setMusicPaused(true);
    }
  }, []);

  return (
    <div
      className={`position-fixed ${
        visible ? "-right-6 sm:right-10" : "right-2"
      } sm:right-2 bottom-4 z-50 md:w-56 w-48 h-fit  sm:-translate-x-50 transition-all duration-500 ease-in-out`}
      style={{
        transform: `translateX(${visible ? 0 : "calc(100% + 8px)"})`,
      }}
    >
      <Panel className="pointer-events-auto w-40 sm:w-56">
        <audio
          ref={musicPlayer}
          onEnded={handleNextSong}
          src={song.path}
          className="d-none"
          autoPlay
          controls
        />
        <div className="p-1 sm:mr-2 relative">
          <div className="mb-1.5 overflow-hidden bg-brown-200 ">
            <p
              className="whitespace-no-wrap w-fit text-white font-italic text-sm"
              style={{
                animation: "marquee-like-effect 10s infinite linear",
                whiteSpace: "nowrap",
                animationPlayState: musicPaused ? "paused" : "running",
              }}
            >
              {song.name} - {song.artist}
            </p>
          </div>
          {/* Controls */}
          <div className="flex space-x-2 justify-content-between ">
            <Button
              onClick={() => setMusicPaused(!musicPaused)}
              className="w-10 h-8"
            >
              <img
                src={musicPaused ? play : pause}
                alt="play / pause button "
              />
            </Button>
            <Button onClick={handleNextSong} className="w-10 h-8">
              <img src={skip_forward} alt="next song button" />
            </Button>
            {/*Custom volume range */}
            <Button
              onClick={volume.decrease}
              className="w-10 h-8 hidden sm:flex"
            >
              <img src={volume_down} alt="next song button" />
            </Button>
            <Button
              onClick={volume.increase}
              className="w-10 h-8 hidden sm:flex"
            >
              <img src={volume_up} alt="next song button" />
            </Button>
            <div className="absolute -right-2 bottom-0 bg-brown-400 h-full w-1.5 rotate-180 rounded-sm hidden sm:block">
              <div
                className="bg-white h-1.5 transition-all duration-200 rounded-sm"
                style={{
                  height: `${volume.value * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </Panel>
      <div
        className={`position-absolute ${
          visible ? "translate-x-1.5" : ""
        } -left-20 sm:-left-24 bottom-0 transition-all duration-500 ease-in-out w-fit z-50 flex gap-2 align-items-center overflow-hidden`}
      >
        <Button onClick={() => setAudioMuted(!audioMuted)}>
          <img
            src={audioMuted ? volume_down : volume_up}
            alt="mute/unmute ingame audio"
            className="w-4 h-4 sm:w-6 sm:h-5"
          />
        </Button>
        <Button onClick={() => setIsVisible(!visible)}>
          <img
            src={visible ? chevron_right : music_note}
            alt="show/hide music player"
            className="w-4 h-4 sm:w-6 sm:h-5"
          />
        </Button>
      </div>
    </div>
  );
};
