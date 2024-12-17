// import RecordRTC from 'recordrtc';
// import { AssemblyAiActions, ChromeActions, ChromeResponseMsg } from '../background/background';
// import { RealtimeTranscriber } from 'assemblyai';

// export enum ContentScriptActions {
//   RECORD = 'RECORD',
//   STOP = 'STOP',
//   RECONNECT = 'RECONNECT'
// };

// type RecordAction = {
//   action: ContentScriptActions.RECORD;
// };

// type Actions = RecordAction;

// let realtimeTranscriber: RealtimeTranscriber;
// let recorder: RecordRTC;
// let streamRef: MediaStream;

// chrome.runtime.onMessage.addListener(async(msg: Actions, _, sendResponse) => {
//   const { action } = msg;

//   if (action === ContentScriptActions.RECORD) {
//     realtimeTranscriber = new RealtimeTranscriber({
//       token: 'cdf905217b920b3236850d46e5403d5cca1a3571e16c4242d05cd729f23bb957',
//       sampleRate: 16_000,
//     });
  
//     realtimeTranscriber.on('transcript', transcript => {
//       if (transcript.message_type === AssemblyAiActions.FinalTranscript) {
//         chrome.runtime.sendMessage({action: 'transcript', text: transcript.text});
//       } else if (transcript.text) {
//         chrome.runtime.sendMessage({action: 'transcript', text: transcript.text});
//       }
//     });
  
//     realtimeTranscriber.on('open', event => {
//       console.log('Connected. Session id: ', event.sessionId);
//       chrome.runtime.sendMessage({action: 'connected'});
//     });
  
//     realtimeTranscriber.on('error', event => {
//       console.error('Error ->: ', event);
//       chrome.runtime.sendMessage({action: 'error', error: event});
//       realtimeTranscriber.close();
//     });
  
//     realtimeTranscriber.on('close', (code, reason) => {
//       console.log(`Connection closed: ${code} ${reason}`);
//       chrome.runtime.sendMessage({action: 'closed', code, reason});
//     });

//     await realtimeTranscriber.connect();

//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(stream => {
//         streamRef = stream;
//         recorder = new RecordRTC(stream, {
//           type: 'audio',
//           mimeType: 'audio/webm;codecs=pcm',
//           recorderType: RecordRTC.StereoAudioRecorder,
//           timeSlice: 250,
//           desiredSampRate: 16000,
//           numberOfAudioChannels: 1,
//           bufferSize: 4096,
//           audioBitsPerSecond: 128000,
//           ondataavailable: async (blob) => {
//             if(!realtimeTranscriber) return;
//             const buffer = await blob.arrayBuffer();
//             realtimeTranscriber.sendAudio(buffer);
//           },
//         });
//         recorder.startRecording();
//       });

//   } else if (action === ContentScriptActions.STOP) {
//     if (recorder) {
//       recorder.stopRecording();
//       recorder = null;
//     }
//     if (realtimeTranscriber) {
//       realtimeTranscriber.close();
//       realtimeTranscriber = null;
//     }
//     if (streamRef) {
//       streamRef.getAudioTracks().forEach(track => {
//         track.stop();
//       });
//       streamRef = null;
//     }
//   }
// });

export {};

// ----- recorder on data available backup ---- Example: how to pass array buffer from content to background script ----
// const payload = { data: Array.apply(null, new Uint8Array(buffer))};
// const transportPayload = JSON.stringify(payload);
// chrome.runtime.sendMessage({action: ChromeActions.SEND_AUDIO, payload });