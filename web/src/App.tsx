import React, { FC, useEffect, useRef, useState } from 'react';
import axios from 'axios';

import './app.css';

const App: FC = () => {
  const [state, setState] = useState({
    searchValue: "",
    audioUrl: null,
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [state.audioUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prevState => ({
      ...prevState,
      searchValue: e.target.value
    }))
  }

  const handleSearch = () => {
    axios.get(`http://localhost:3001/get/${state.searchValue}`).then((res) => {
      if (res.status === 200) {

        setState(prevState => ({
          ...prevState,
          audioUrl: res.data.result,
          searchValue: ""
        }))
      } else {
        alert(res.data.error)
      }
    });
  }

  return (
    <div className="app">
      <div className="form" >
        <input
          type="text"
          className="input"
          name="id"
          autoComplete="off"
          value={state.searchValue}
          onChange={handleChange}
        />
        <button className="button" onClick={handleSearch}>Play</button>
      </div>

      <div className="audio-wrapper">
        {state.audioUrl && (
          <audio controls ref={audioRef}>
            <source src={state.audioUrl} />
          </audio>
        )}
      </div>
    </div>
  )
}

export default App