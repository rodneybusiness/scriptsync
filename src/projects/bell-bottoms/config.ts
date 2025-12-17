/**
 * Bell Bottoms - Project Configuration
 *
 * Charlie's Angels time-travel rewrite tracking
 */

import { ProjectConfig } from '../../config/types';

export const config: ProjectConfig = {
  id: 'bell-bottoms',
  title: 'Bell Bottoms',
  description: 'A context-aware screenwriting environment designed for the Bell Bottoms rewrite. Charlie\'s Angels time-travel adventure tracking continuity across 1974 and 2026 timelines.',
  genres: ['Action', 'Comedy', 'Time Travel'],
  logline: 'When three elite agents are accidentally sent back to 1974, they must help a down-on-his-luck PI solve a murder case to restore the timeline that created the agency that shaped their lives.',

  characters: [
    // Main Characters
    { name: 'Dylan', role: 'main', description: 'Free-spirited Angel, chaotic energy, serial romantic' },
    { name: 'Natalie', role: 'main', description: 'Grounded Angel, married with kids, work/life balance struggles' },
    { name: 'Alex', role: 'main', description: 'Intellectual Angel, recently divorced, seeking independence' },
    { name: 'Charlie', role: 'main', description: '1974 version - broken war vet, alcoholic, underestimated hero' },

    // Supporting Characters
    { name: 'Vera', role: 'supporting', description: 'Diner waitress who knows the Angels across both timelines' },
    { name: 'Toni', role: 'supporting', description: 'PI agency owner in 1974, Charlie\'s boss' },
    { name: 'Ray', role: 'supporting', description: 'Ray Caldero - revealed as villain, framed Anna' },
    { name: 'Otto', role: 'supporting', description: 'Sam Torrenti\'s brother, part of hippie mafia' },
    { name: 'Anna', role: 'supporting', description: 'Sam Torrenti\'s widow, framed for murder' },
    { name: 'Gore', role: 'supporting', description: 'Ray Caldero\'s henchman' },
  ],

  themes: [
    'Destiny vs. Choice',
    'Found Family',
    'Redemption',
    'Self-Belief',
    'Time & Legacy',
  ],

  ai: {
    styleReferences: ['Shane Black', 'Phoebe Waller-Bridge'],
    toneDescriptor: 'Action/Comedy Specialist with buddy-cop sensibilities',
    uniqueConstraints: [
      'Time travel logic must be internally consistent',
      'Maintain continuity between 1974 and 2026 timelines',
      'Charlie in 1974 cannot know about the future (until reveal)',
      'Period-accurate 1970s dialogue and references',
      'Balance comedy with emotional character moments',
    ],
    customInstructions: 'The Angels are competent professionals in 2026 but fish-out-of-water in 1974. Charlie\'s arc is from broken drunk to believing in himself. Ray Caldero is the hidden villain.',
  },

  trackingCategories: [
    'Plot',
    'Character Arc',
    'Comedy',
    'Action',
    'Theme',
    'Mystery',
    'Setting',
    'Setup',
    'Payoff',
  ],

  noteAuthors: ['RR', 'MM', 'SK'],

  meta: {
    version: '1.0.0',
    author: 'Rodney Rothman',
  },
};

export default config;
