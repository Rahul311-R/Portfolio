import type { Project } from '@/types/project';

const roadSections: [string, string][] = [
  ['01 / OVERVIEW', 'A road-condition concept that brings together AI, GPS and IoT sensors for real-time road fault detection.'],
  ['02 / PROBLEM', 'Road faults need clear, location-aware information before they can be reviewed and addressed.'],
  ['03 / APPROACH', 'The concept connects visual input, road fault detection, GPS context and an IoT/data layer into one flow.'],
  ['04 / TECHNOLOGY', 'AI, GPS and IoT are the documented components of the project. The specific implementation stack can be confirmed with project materials.'],
  ['05 / ARCHITECTURE', 'The conceptual sequence is camera or input, computer vision, road fault detection, GPS, then the IoT/data layer.'],
  ['06 / IMPLEMENTATION', 'Implementation details are not included in the supplied resume and should be added when source material is available.'],
  ['07 / RESULTS', 'The project patent was accepted and published by the Indian Patent Office. No deployment or performance figures are stated here.'],
  ['08 / LESSONS', 'The project connects an applied road-safety problem with AI, location context and connected-device thinking.'],
  ['09 / FUTURE WORK', 'Future improvements are to be confirmed from Rahul’s project documentation.']
];

const drawingSections: [string, string][] = [
  ['01 / OVERVIEW', 'A gesture-controlled drawing application that uses hand tracking to create marks without a conventional drawing surface.'],
  ['02 / PROBLEM', 'The project explores an alternate, touch-free way to interact with a drawing interface.'],
  ['03 / APPROACH', 'Hand tracking is used to translate gesture movement into drawing interaction.'],
  ['04 / TECHNOLOGY', 'Built with Python, OpenCV and Matplotlib.'],
  ['05 / ARCHITECTURE', 'Visual input is interpreted through hand tracking before it is translated into virtual canvas strokes.'],
  ['06 / IMPLEMENTATION', 'The supplied resume identifies the application as a gesture-controlled drawing project; additional implementation detail can be added with project source material.'],
  ['07 / RESULTS', 'The resume reports 95%+ detection accuracy. This figure is presented as reported project performance, not an independently benchmarked result.'],
  ['08 / LESSONS', 'The project brings together computer vision input and direct visual feedback.'],
  ['09 / FUTURE WORK', 'Further development directions are to be confirmed.']
];

const weatherSections: [string, string][] = [
  ['01 / OVERVIEW', 'A weather GUI that integrates a live weather API with input validation and error handling.'],
  ['02 / PROBLEM', 'API-driven interfaces need to give users useful feedback for invalid input and unavailable responses.'],
  ['03 / APPROACH', 'The application combines a GUI, API integration, validation and robust error handling.'],
  ['04 / TECHNOLOGY', 'Built with Python, a REST API and a GUI.'],
  ['05 / ARCHITECTURE', 'User input is validated before an API request is handled and the response is shown in the interface.'],
  ['06 / IMPLEMENTATION', 'Implementation specifics are not present in the supplied resume.'],
  ['07 / RESULTS', 'The project demonstrates weather API integration, validation and error handling. No accuracy, usage or deployment claims are made.'],
  ['08 / LESSONS', 'The project is a practical exercise in connecting a user interface to external API data.'],
  ['09 / FUTURE WORK', 'Future improvements are to be confirmed.']
];

export const PROJECTS: Project[] = [
  {
    id: 'road-condition-analyzer', slug: 'road-condition-analyzer', title: 'AI-Powered Road Condition Analyzer',
    shortDescription: 'A real-time road fault detection system integrating AI, GPS and IoT sensors.',
    description: 'A road-condition project exploring real-time fault detection with AI, GPS and IoT sensors.',
    categories: ['AI', 'Computer Vision', 'IoT', 'Road Safety'], technologies: ['AI', 'GPS', 'IoT Sensors'], year: '[CONFIRM]', featured: true,
    badge: 'Patent Published', architecture: { nodes: ['Camera / Input', 'Computer Vision', 'Road Fault Detection', 'GPS', 'IoT / Data Layer'], description: 'Conceptual architecture, not a verified implementation diagram.' },
    sections: roadSections.map(([title, content]) => ({ title, content }))
  },
  {
    id: 'virtual-drawing-board', slug: 'virtual-drawing-board', title: 'Virtual Drawing Board',
    shortDescription: 'Gesture-controlled drawing application using hand tracking.',
    description: 'A gesture-controlled drawing application using hand tracking.',
    categories: ['AI', 'Computer Vision', 'Experiments'], technologies: ['Python', 'OpenCV', 'Matplotlib'], year: '[CONFIRM]', featured: true,
    metrics: [{ label: 'Detection accuracy', value: '95%+' }],
    architecture: { nodes: ['Visual Input', 'Hand Tracking', 'Gesture Input', 'Virtual Canvas'], description: 'Conceptual interaction flow, not a verified implementation diagram.' },
    sections: drawingSections.map(([title, content]) => ({ title, content }))
  },
  {
    id: 'weather-prediction-gui', slug: 'weather-prediction-gui', title: 'Weather Prediction GUI',
    shortDescription: 'A weather application integrating a live weather API with input validation and robust error handling.',
    description: 'A weather GUI that integrates a live weather API with input validation and robust error handling.',
    categories: ['Web', 'Data'], technologies: ['Python', 'REST API', 'GUI'], year: '[CONFIRM]', featured: true,
    sections: weatherSections.map(([title, content]) => ({ title, content }))
  }
];
