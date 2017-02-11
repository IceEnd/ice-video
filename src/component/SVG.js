import React from 'react';

const SVG = () => (
  <svg
    display="none"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <symbol id="video_play" viewBox="0 0 36 36">
      <path
        d="M25.8 18c0 .6-.3 1.1-.8 1.3L12.5 27c-.2.1-.5.2-.8.2-.8 0-1.5-.6-1.5-1.5V10c0-.8.7-1.5 1.5-1.5.3 0 .5.1.8.2l12.7 7.9c.4.5.6.9.6 1.4z"
      />
    </symbol>
    <symbol id="video_pause" viewBox="0 0 36 36">
      <path
        d="M23.5 28c-.8 0-1.5-.7-1.5-1.5v-17c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v17c0 .8-.7 1.5-1.5 1.5zm-11 0c-.8 0-1.5-.7-1.5-1.5v-17c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v17c0 .8-.7 1.5-1.5 1.5z"
      />
    </symbol>
  </svg>
);

SVG.displayName = 'IcePlayerSVG';

export default SVG;
