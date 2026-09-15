import signalGrid from '../assets/signal-grid.svg';
import packetStream from '../assets/packet-stream.svg';
import logicRelay from '../assets/logic-relay.svg';
import inputSurvey from '../assets/input-survey.svg';
import wordsClarity from '../assets/words-clarity.svg';
import libraryFeed from '../assets/library-feed.svg';
import wiringFlow from '../assets/wiring-flow.svg';
import faultTolerant from '../assets/fault-tolerant.svg';
import signalReroute from '../assets/signal-reroute.svg';
import routeMap from '../assets/route-map.svg';
import signalValues from '../assets/signal-values.svg';
import dailyRhythm from '../assets/daily-rhythm.svg';
import internshipRelay from '../assets/internship-relay.svg';
import swarmGrid from '../assets/swarm-grid.svg';
import handshake from '../assets/handshake.svg';
import paperTrail from '../assets/paper-trail.svg';
import heroField from '../assets/hero-field.svg';
import roadTopology from '../assets/road-topology.svg';
import gestureOrbit from '../assets/gesture-orbit.svg';
import weatherFlow from '../assets/weather-flow.svg';

export const PROJECT_ARTWORK: Record<string, string> = {
  'road-condition-analyzer': roadTopology,
  'virtual-drawing-board': gestureOrbit,
  'weather-prediction-gui': weatherFlow,
};

export const PAGE_ARTWORK = {
  home: heroField,
  about: signalGrid,
  projects: packetStream,
  resume: logicRelay,
  lab: inputSurvey,
  writing: wordsClarity,
  reading: libraryFeed,
  uses: wiringFlow,
  now: faultTolerant,
  experience: routeMap,
  contact: weatherFlow,
  notFound: signalReroute,
} as const;

/** Section-level plates — larger motifs placed inside page bodies. */
export const SECTION_ARTWORK = {
  values: signalValues,
  rhythm: dailyRhythm,
  relays: internshipRelay,
  swarm: swarmGrid,
  handshake,
  papers: paperTrail,
} as const;
