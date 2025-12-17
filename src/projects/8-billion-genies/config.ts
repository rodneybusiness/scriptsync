/**
 * 8 Billion Genies - Project Configuration
 *
 * Adaptation of the Image Comics series by Charles Soule & Ryan Browne
 * Second draft incorporating Amazon + Point Grey / Counter Culture notes
 */

import { ProjectConfig } from '../../config/types';

export const config: ProjectConfig = {
  id: '8-billion-genies',
  title: '8 Billion Genies',
  description: 'When every person on Earth simultaneously receives their own genie with one wish to grant, chaos erupts. A group of strangers trapped in a protected bar must journey to find safety while the world transforms around them.',
  genres: ['Fantasy', 'Comedy', 'Action', 'Drama', 'Ensemble'],
  logline: 'When 8 billion genies appear and grant everyone on Earth one wish, a group of strangers trapped in a protected bar must navigate a transformed world to reach Hope\'s Hollow—only to discover the haven\'s visionary leader has sinister plans that could end humanity.',

  characters: [
    // Main Characters
    {
      name: 'Daisy Wanless',
      role: 'main',
      description: 'Late 20s. Drifts through life on instinct and avoidance. Online gig worker. Her arc: learning she is accountable, capable, and must step into responsibility instead of defaulting to chaos. Suffers from "analysis paralysis" - can\'t make decisions. The ONLY character who keeps her genie until the end.',
      aliases: ['Daisy']
    },
    {
      name: 'Alex Chen',
      role: 'main',
      description: 'Late 20s. Tech entrepreneur whose company is failing (funded by parents). Righteous idealist who has been overcoddled. His arc: realizing he overestimates himself, learning humility and listening. His wish: truth-vision (can see when people lie).',
      aliases: ['Alex']
    },
    {
      name: 'Robbie Green',
      role: 'main',
      description: '13 years old (turns 14 by end). Innate protector with Superman-level empathy. "If he goes dark, we all go." First instinct is to help others. Lost his mother, raised by alcoholic stepfather Ed. Wishes to become anime hero (Naruto-style powers).',
      aliases: ['Robbie', 'Gokashi']
    },
    {
      name: 'Floyd Faughn',
      role: 'main',
      description: 'The Idea Man. 30s. Publicly humiliated when Daisy rejected his proposal after one month of dating. His wish: everyone thinks his ideas are great (NOT that he has good ideas). Villain who wants recognition, not actual good ideas. Built Hope\'s Hollow. Plans to scour the planet and collect all genies.',
      aliases: ['Floyd', 'Idea Man']
    },
    {
      name: 'Will Jennings',
      role: 'main',
      description: '60s. Bartender at The Lampwick. Mysteriously prepared for G-Day. REVEAL: He is actually a genie who saved Earth from a previous G-Day and was rewarded by living as human. Made the first wish to protect the bar.',
      aliases: ['Will']
    },

    // Supporting Characters
    {
      name: 'June Williams',
      role: 'supporting',
      description: 'Robbie\'s deceased mother, brought back as a "remnant" by Ed\'s wish. 50s. If Ed dies, she vanishes. Her presence keeps Robbie grounded. Eventually fades when Ed has heart attack.',
      aliases: ['June', 'Mom']
    },
    {
      name: 'Ed McCrae',
      role: 'supporting',
      description: '50s. Robbie\'s alcoholic stepfather. Trying his best but struggling. Uses his wish to bring back June. Has serious health issues (liver, heart). His death causes June to vanish.',
      aliases: ['Ed']
    },
    {
      name: 'Tim DeBethem',
      role: 'supporting',
      description: '40s. Plumber who came to fix the toilet. Accidentally wishes to become a french fry and spends most of the movie as one. Comic relief but also has a darker edge. Sacrifices himself using plumbing knowledge to free the genies.',
      aliases: ['Tim', 'Fry Guy']
    },
    {
      name: 'Brenda Chen',
      role: 'supporting',
      description: '30s. Pregnant woman who didn\'t really want kids. Her husband Michael takes the pregnancy with his wish. Star Trek superfan. Wishes for the USS Enterprise. Has affair with Tim. Complex feelings about motherhood.',
      aliases: ['Brenda']
    },
    {
      name: 'Michael Chen',
      role: 'supporting',
      description: '30s. Brenda\'s husband since age 11. Wishes to carry Brenda\'s pregnancy. Deeply devoted but perhaps too controlling. Gives birth at climax.',
      aliases: ['Michael', 'Bunbun']
    },

    // Key Genies
    {
      name: 'Daisy\'s Genie',
      role: 'supporting',
      description: 'The "hero genie" - stays with us from beginning to end. Voice: Jennifer Coolidge vibe. Forms genuine bond with Daisy. Key to exposition and rules. Gets trapped in Hope\'s Hollow wishpool.',
      aliases: ['Daisy Genie']
    },
    {
      name: 'Will\'s Genie',
      role: 'minor',
      description: 'Voice: Morgan Freeman vibe. Used immediately to protect the bar. First genie to grant a wish in the story.'
    },
    {
      name: 'Alex\'s Genie',
      role: 'minor',
      description: 'Voice: Paul Giamatti vibe. Grants Alex truth-vision wish at Hope\'s Hollow entrance.'
    },
    {
      name: 'Tim\'s Genie',
      role: 'minor',
      description: 'Voice: John Mulaney vibe. Grants the unfortunate french fry wish.'
    },
    {
      name: 'Robbie\'s Genie',
      role: 'minor',
      description: 'Grants Robbie\'s Naruto transformation wish.'
    },
    {
      name: 'Brenda\'s Genie',
      role: 'minor',
      description: 'Voice: Anna Faris vibe. Grants the USS Enterprise wish.'
    },

    // Minor Characters
    {
      name: 'Beetlebug',
      role: 'minor',
      description: 'Female superhero, leader of Megapal Justice Buddies. Dies fighting Kaiju in Ohio. Only 11 years old.',
      aliases: ['Beetle Bug']
    },
    {
      name: 'Black Mask',
      role: 'minor',
      description: 'Supervillain leading the Sinister Six Thousand. Fights our heroes in Ohio.'
    },
    {
      name: 'Remnant Daisy',
      role: 'minor',
      description: 'Floyd\'s wished-for copy of Daisy. Creepy, lives in secret wing of his mansion with a wished-for child.'
    },
    {
      name: 'Concierge Harper',
      role: 'minor',
      description: 'Hope\'s Hollow concierge with perfect smile. Represents the haven\'s cult-like conformity.'
    },
    {
      name: 'Head Lawyer',
      role: 'minor',
      description: 'Leader of Exactitude, the wish-legal haven. Knows Floyd is behind the scourings.'
    },
  ],

  themes: [
    'The Danger of Wishing Without Thinking',
    'Found Family',
    'Accountability vs Avoidance (Daisy)',
    'Humility vs Overconfidence (Alex)',
    'Protection & Sacrifice (Robbie)',
    'Recognition Addiction (Floyd)',
    'The Last Wish Wins',
    'Hope in Chaos',
    'What You Wish For vs What You Need',
  ],

  ai: {
    styleReferences: ['Seth Rogen/Evan Goldberg', 'The Hangover', 'This Is The End', 'Ghostbusters', 'Independence Day'],
    toneDescriptor: 'Four-quadrant PG-13 ensemble comedy with heart. High-concept fantasy grounded by relatable character dynamics.',
    uniqueConstraints: [
      'Must be PG-13 - tone down violence and language',
      'Daisy and Alex are co-leads - tilt narrative toward them',
      'Robbie is the emotional heart but not POV character',
      'Floyd\'s wish is that people THINK his ideas are good, not that they ARE good',
      'Genies operate as hive mind - can answer any question truthfully',
      'Remnants (wished-back people) vanish if their wisher dies',
      'Contradictory wishes cancel each other out',
      'The Scouring (nuclear explosions) is Floyd\'s doing, not Dougland',
      'Will is secretly a genie - this revelation comes at the end',
      'The bar (Lampwick) is wish-protected and indestructible',
    ],
    customInstructions: `KEY THEMATIC ANCHORS:
- DAISY: Drifts through life on instinct and avoidance → Learns she is accountable, capable, and must step into responsibility
- ALEX: Righteous idealist who has been overcoddled → Realizes he overestimates himself, learns humility
- ROBBIE: Innate protector with Superman-level empathy. First instinct is to help others, even when it costs him
- FLOYD: Doesn't care about having good ideas. Cares about being SEEN as the person who had them

GLOBAL STAKES TO TRACK:
1. The world has fallen into Chaos
2. Charismatic leaders are rebooting society in "havens"
3. Global arms race to accrue genies
4. Superheroes are now rare (hence Robbie's value)
5. The Scouring is destroying everything (Floyd's doing)

EXECUTION PRIORITIES:
1. CRITICAL: Global stakes, Scouring, Idea Man clarity, Daisy & Alex as co-leads
2. HIGH: Robbie's specialness, leaving the bar motivation, genie dynamics, Will/Lampwick payoff
3. MEDIUM: Act 2A momentum, Brenda/Michael complexity, harder ending
4. LOW: PG-13 pass and continuity cleanup`,
  },

  trackingCategories: [
    'Global Stakes',
    'Character Arc',
    'Genie Rules',
    'Villain Plot',
    'Theme',
    'Comedy',
    'Action',
    'Setup',
    'Payoff',
    'Scouring',
    'PG-13 Flag',
    'Found Family',
  ],

  noteAuthors: ['RR', 'AMZN', 'PG'],

  meta: {
    version: '2.0.0',
    author: 'Rodney Rothman',
  },
};

export default config;
