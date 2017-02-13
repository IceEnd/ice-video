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
    <symbol id="loading_start" viewBox="0 0 135 140" width="135" height="140">
      <rect y="10" width="15" height="120" rx="6">
        <animate
          attributeName="height" begin="0.5s" dur="1s"
          values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"
        />
        <animate
          attributeName="y" begin="0.5s" dur="1s"
          values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"
        />
      </rect>
      <rect x="30" y="10" width="15" height="120" rx="6">
        <animate
          attributeName="height" begin="0.25s" dur="1s"
          values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"
        />
        <animate
          attributeName="y" begin="0.25s" dur="1s"
          values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"
        />
      </rect>
      <rect x="60" width="15" height="140" rx="6">
        <animate
          attributeName="height" begin="0s" dur="1s"
          values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"
        />
        <animate
          attributeName="y" begin="0s" dur="1s"
          values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"
        />
      </rect>
      <rect x="90" y="10" width="15" height="120" rx="6">
        <animate
          attributeName="height" begin="0.25s" dur="1s"
          values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"
        />
        <animate
          attributeName="y"begin="0.25s" dur="1s"
          values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"
        />
      </rect>
      <rect x="120" y="10" width="15" height="120" rx="6">
        <animate
          attributeName="height" begin="0.5s" dur="1s"
          values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"
        />
        <animate
          attributeName="y" begin="0.5s" dur="1s"
          values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"
        />
      </rect>
    </symbol>
    <symbol id="play_icon" viewBox="0 0 100 100">
      <path
        d="M 18.56 10.20 Q 12.5,6.599 12.5,13.70 L 12.5 86.30 Q 12.5,94.301 18.56,89.80 L 81.44 53.50 Q 87.5,50 81.44,46.50 Z"
        transform="scale(1)" fill="white"
      />
    </symbol>
  </svg>
);

SVG.displayName = 'IcePlayerSVG';

export default SVG;
