import { RealtimeTranscriber } from "assemblyai";
import { Actions, ActionType } from "../provider/actions";
import RecordRTC from 'recordrtc';
import React from "react";
import { TranscriptComponentState } from "../components/VoiceSearchWrapper";
import { getCookie, setCookie } from 'typescript-cookie';

export enum CookieVars {
  TOKEN = 'token'
};

export enum TranscriptType {
  PARTIAL_TRANSCRIPT = 'PartialTranscript',
  FINAL_TRANSCRIPT = 'FinalTranscript'
};

export enum RecorderStatus {
  RECORDING = 'recording',
  STOPPED = 'stopped',
  PAUSED = 'paused'
};

export type Transcript = {
  text: string;
  type: TranscriptType;
};

let realtimeTranscriber: RealtimeTranscriber;
let recorder: RecordRTC;
let streamRef: MediaStream;

const getToken = async () => {
  try {
    const response = await fetch('http://localhost:4000/token');
    const data = await response.json();

    if (data.error) {
      console.log(data);
    }
    return data.token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const startRecording = async (
  dispatchStateUpdate: React.Dispatch<React.SetStateAction<TranscriptComponentState>>,
  dispatch: React.Dispatch<Actions>,
  generateToken: boolean = false
) => {
  console.log('server side cookie:', getCookie('AUTH-TOKEN')); // TODO: access server side defined cookie
  if (generateToken || !getCookie(CookieVars.TOKEN)) {
    const token = await getToken();
    setCookie(CookieVars.TOKEN, token, { expires: 1 });
  }

  realtimeTranscriber = new RealtimeTranscriber({
    token: getCookie(CookieVars.TOKEN),
    sampleRate: 16_000
  });

  realtimeTranscriber.on('transcript', transcript => {
    if (transcript.text) {
      if (transcript.message_type === TranscriptType.FINAL_TRANSCRIPT) {
        dispatchStateUpdate((prevState) => {
          const prevFinalTranscript = prevState.finalTranscript;
          if (!prevFinalTranscript) {
            return {finalTranscript: transcript.text};
          } else {
            return {finalTranscript: prevFinalTranscript.concat(' ', transcript.text)};
          }
        });
      } else {
        dispatchStateUpdate((prevState) => ({...prevState, transcript: transcript.text}));
      }
    }
  });

  realtimeTranscriber.on('open', event => {
    console.log('Connected. Session id: ', event.sessionId);
    dispatch({type: ActionType.CONNECTED, payload: true});
  });

  realtimeTranscriber.on('error', error => {
    console.log('Error ->: ', error);
    realtimeTranscriber.close();
    dispatch({type: ActionType.ERROR, payload: error });
  });

  realtimeTranscriber.on('close', (code, reason) => {
    console.log(`Connection closed: ${code} ${reason}`);
    dispatch({type: ActionType.DISCONNECTED, payload: { closed: true, code, reason, count: 1 }});
  });

  await realtimeTranscriber.connect();

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      streamRef = stream;
      recorder = RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm;codecs=pcm',
        recorderType: RecordRTC.StereoAudioRecorder,
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 128000,
        ondataavailable: async (blob) => {
          if(!realtimeTranscriber) return;
          const buffer = await blob.arrayBuffer();
          realtimeTranscriber.sendAudio(buffer);
        },
      });
      
      recorder.onStateChanged = (state) => {
        dispatch({type: ActionType.RECORDER_STATE_CHANGE, payload: state});
      };

      recorder.startRecording();
    });
};

export const pauseRecording = async () => {
  if (recorder) {
    recorder.pauseRecording();
  }
};

export const resumeRecording = async () => {
  if (recorder) {
    recorder.resumeRecording();
  }
};

export const stopRecording = async () => {
  if (recorder) {
    recorder.stopRecording();
    recorder = null;
  }
  if (realtimeTranscriber) {
    realtimeTranscriber.close();
    realtimeTranscriber = null;
  }
  if (streamRef) {
    streamRef.getAudioTracks().forEach(track => {
      track.stop();
    });
    streamRef = null;
  }
};

