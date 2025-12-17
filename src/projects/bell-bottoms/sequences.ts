/**
 * Bell Bottoms - Sequence and Scene Data
 */

import { Sequence, NoteType } from '../../config/types';

export const sequences: Sequence[] = [
  {
    id: "SEQ_1",
    title: "SEQUENCE 1: SETUP",
    dramaticQuestion: "Who are the Angels and what's their normal life?",
    climax: "Time machine activates, Angels vanish",
    resolution: "Life disrupted",
    scenes: [
      {
        id: "1.1",
        sequenceId: "SEQ_1",
        title: "1.1: Yesterday's Tomorrow Village",
        pageNumber: 1,
        summary: "Angels undercover in retirement home fight robot dogs.",
        tracking: [
          { category: "Comedy", description: "Physical comedy of Angels acting old" },
          { category: "Setup", description: "Robot dogs introduced (high tech vs old ladies)" }
        ],
        beats: [
          { id: "1.1-b1", description: "Four 'elderly women' play Scrabble, Wheel of Fortune plays, Hot Orderly interacts", completed: true },
          { id: "1.1-b2", description: "Italian Mule arrives for 'Nonna,' Angels reveal they're undercover", completed: true },
          { id: "1.1-b3", description: "Chase begins, robot bodyguards arrive", completed: true },
          { id: "1.1-b4", description: "Angels fight robots using retirement home props (soup ladles, knitting needles)", completed: true },
          { id: "1.1-b5", description: "Orderly fixes smart blinds at worst moment—Angels slam into them", completed: true },
          { id: "1.1-b6", description: "Angels defeat robots, reprogram robo-dog", completed: true }
        ],
        notes: [
          { id: "n1.1-1", author: "RR", type: NoteType.REWRITE, content: "Have a bit more fun with how physically 'decrepit' they are compared to old days." },
          { id: "n1.1-2", author: "MM", type: NoteType.CHARACTER, content: "Dylan kid-sister/stuck-in-past: is too eager/clumsy, needs to be redirected or covered." }
        ],
        connections: [
          { targetSceneId: "1.2", type: "causal", description: "Robo-dog captured here used in next scene" },
          { targetSceneId: "1.8", type: "echo", description: "Rocket the Dog introduced here" }
        ],
        scriptContent: `EXT. "YESTERDAY'S TOMORROW VILLAGE" - DAY
Establishing shot of a A LUXURY ASSISTED LIVING FACILITY that sits on a cliff in Malibu overlooking the Pacific Ocean.

INT. YESTERDAY'S TOMORROW VILLAGE - COMMON AREA - DAY
"Wheel of Fortune" plays on a giant flatscreen. The puzzle category is "80s Movie Quote".

DYLAN (80s), has long hippie hair that's an ethereal silver.
DYLAN
Good for you! That one was hard.

ALEX (80s) wears glasses, her white hair in a tight bun.
ALEX
Who even remembers the 80s?

NATALIE (80s), wearing a tacky pink sweater.
NATALIE
I don't like this new tv. I just figured out how to use the old one.

A YOUNG, HOT ORDERLY comes over.
HOT ORDERLY
Do you need some help, Dylan?

DYLAN
(winks)
I need a lot of things.`
      },
      {
        id: "1.2",
        sequenceId: "SEQ_1",
        title: "1.2: Tarmac",
        pageNumber: 7,
        summary: "Angels capture the Italian Mule on a moving plane.",
        tracking: [
          { category: "Action", description: "Classic Angels competence display" }
        ],
        beats: [
          { id: "1.2-b1", description: "Angels intercept Italian Mule using robo-dog", completed: true },
          { id: "1.2-b2", description: "Retrieve crypto USB, Interpol arrests him", completed: true }
        ],
        notes: [],
        connections: [
          { targetSceneId: "5.9", type: "echo", description: "Action competence here contrasts with chaotic 70s fights" }
        ],
        scriptContent: `EXT. TARMAC - DAY
The BLACK SUV pulls up to a private plane and Italian Mule is about to climb the steps to board when the ROBO-DOG jumps out of the plane and attacks!

Italian Mule is pinned on the ground.

ALEX (O.S.)
Good boy.

The ANGELS, in Flight Attendant uniforms, walk off of the plane.

ALEX (CONT'D)
I'll be taking this.
Alex grabs the hearing aid and pops out a USB dongle.`
      },
      {
        id: "1.4",
        sequenceId: "SEQ_1",
        title: "1.4: Jimmy Pockets Diner",
        pageNumber: 9,
        summary: "Post-mission ritual. Vera introduced.",
        tracking: [
          { category: "Theme", description: "Consistency/Bedrock of friendship" }
        ],
        beats: [
          { id: "1.4-b1", description: "Post-mission debrief, 'Robots were new'", completed: true },
          { id: "1.4-b2", description: "Vera asks what they've been up to", completed: true }
        ],
        notes: [
          { id: "n1.4-1", author: "RR", type: NoteType.THEME, content: "Now is the time to set up any SET or VISUAL ELEMENTS in the diner that are going to come back later." }
        ],
        connections: [
          { targetSceneId: "2.8", type: "echo", description: "Diner location re-appears in 1974" }
        ],
        scriptContent: `INT. JIMMY POCKETS - DAY
A RETRO DINER, the place they come after every mission.

DYLAN
I'm so excited for some solid food!

ALEX
Is it me or do these missions keep getting crazier?

NATALIE
Robots were new. They almost beat us.

DYLAN
But they didn't! We're still the best in the game.

VERA, 75, the waitress walks over--`
      },
      {
        id: "1.5",
        sequenceId: "SEQ_1",
        title: "1.5: Montage - Life Update",
        pageNumber: 10,
        summary: "Quick catch-up on the Angels' personal lives.",
        tracking: [
          { category: "Character Arc", description: "Natalie: Work/Life Balance" },
          { category: "Character Arc", description: "Alex: Independence/Japan" },
          { category: "Character Arc", description: "Dylan: Drift/Loneliness" }
        ],
        beats: [
          { id: "1.5-b1", description: "Natalie married Pete, twins now 12, voice catches on 'so solid'", completed: true },
          { id: "1.5-b2", description: "Alex divorced Jason, co-parenting, accepted to Japan Ikebana program", completed: true },
          { id: "1.5-b3", description: "Dylan's serial marriages and bonfire rituals", completed: true },
          { id: "1.5-b4", description: "Dylan as chaotic babysitter", completed: true }
        ],
        notes: [
          { id: "n1.5-1", author: "RR", type: NoteType.REWRITE, content: "Think this needs to be tightened/cleaned up. Maybe not so much montage, more verbal and playful." }
        ],
        connections: [
          { targetSceneId: "2.3", type: "thematic", description: "Natalie's family connection pays off in panic" }
        ],
        scriptContent: `NATALIE (V.O.)
Let's see, I married the love of my life... started a family...

ALEX (V.O.)
Me and Jason got married... and then we got divorced... My mom moved in to help me with our son.

DYLAN (V.O.)
--And I've had some ups and downs in the relationship department.`
      },
      {
        id: "1.8",
        sequenceId: "SEQ_1",
        title: "1.8: Townsend Agency",
        pageNumber: 18,
        summary: "Charlie announces retirement and introduces Ray Caldero.",
        tracking: [
          { category: "Character Arc", description: "Charlie: Redemption Arc Setup" },
          { category: "Mystery", description: "Ray Caldero Introduced" }
        ],
        beats: [
          { id: "1.8-b1", description: "Angels discuss romantic dinner, Alex tries to bring up Japan", completed: false },
          { id: "1.8-b2", description: "Name the robot dog 'Rocket'", completed: true },
          { id: "1.8-b3", description: "Charlie announces retirement, tells Torrenti murder origin story", completed: true },
          { id: "1.8-b4", description: "Charlie will name a successor, Natalie assumes Alex", completed: false },
          { id: "1.8-b5", description: "Ray Caldero introduced—Innocence Initiative founder", completed: true },
          { id: "1.8-b6", description: "Charlie tells Dylan privately she could be his successor, she declines", completed: true }
        ],
        notes: [
          { id: "n1.8-1", author: "RR", type: NoteType.REWRITE, content: "This Charlie retirement generally moves too fast. Opportunity to LAND CHARACTER STUFF." },
          { id: "n1.8-2", author: "MM", type: NoteType.CHARACTER, content: "Seed in Alex taking the reins too much and maybe saying how the angels don't even need her." }
        ],
        connections: [
          { targetSceneId: "2.13", type: "echo", description: "Charlie's legend contrasted with 1974 reality" },
          { targetSceneId: "5.5", type: "causal", description: "Ray Caldero introduction pays off as villain reveal" }
        ],
        scriptContent: `CHARLIE
I've got a big announcement--

NATALIE
You're finally getting us a karaoke machine?

CHARLIE
Close. I'm retiring.

The Angels are shocked.

CHARLIE
I've been at this since the 70s... I was trying to find my feet in the industry and then I solved one big case... The Torrenti murder.`
      },
      {
        id: "1.11",
        sequenceId: "SEQ_1",
        title: "1.11: Basement — Time Machine Discovery",
        pageNumber: 28,
        summary: "Discovery of the time machine and accidental activation.",
        tracking: [
          { category: "Plot", description: "Time Machine Mechanism" },
          { category: "Character", description: "Gore's Loyalty" }
        ],
        beats: [
          { id: "1.11-b1", description: "Dylan unlocks massive steel doors", completed: true },
          { id: "1.11-b2", description: "Three-story room with giant machine revealed", completed: true },
          { id: "1.11-b3", description: "Alex and Natalie enter to investigate; molar mics screech and die", completed: true },
          { id: "1.11-b4", description: "Realization: 'It is.' A time machine", completed: true },
          { id: "1.11-b5", description: "Dylan kicks Gore into control panel—buttons light up", completed: true },
          { id: "1.11-b6", description: "Panel reads 'AUG 23, 1974'—panic", completed: true },
          { id: "1.11-b7", description: "Dylan runs to warn them—flash of light; Angels vanish", completed: true }
        ],
        notes: [
          { id: "n1.11-1", author: "MM", type: NoteType.THEME, content: "We need time machine logic - what are they looking for to fix time machine?" }
        ],
        connections: [
          { targetSceneId: "2.2", type: "causal", description: "Direct cause of arrival in 1974" }
        ],
        scriptContent: `INT. OBSERVATION ROOM - CONTINUOUS

DOOR SLAM! Dylan SPINS AROUND TO SEE GORE.

GORE
Who are you?

Dylan holds up the lunch bag.

DYLAN
Door dash?

Gore RUNS at her!

INT. MACHINE - CONTINUOUS

Alex and Natalie walk through the machine.

NATALIE
--The temporal core is stabilized by a ring of negative energy.

ALEX
--Basically, an artificial Casimir cavity.

Suddenly, THE LIGHTS IN THE MACHINE TURN ON and a PANEL READS AUGUST 23, 1974.`
      }
    ]
  },
  {
    id: "SEQ_2",
    title: "SEQUENCE 2: PREDICAMENT",
    dramaticQuestion: "Will they accept the challenge to fix the timeline?",
    climax: "Decision to hire Charlie and restore timeline",
    resolution: "Enter 1974 detective world",
    scenes: [
      {
        id: "2.2",
        sequenceId: "SEQ_2",
        title: "2.2: LA Convention Center — 1974",
        pageNumber: 31,
        summary: "Angels realize they have traveled back to 1974.",
        tracking: [
          { category: "Setting", description: "Period Accuracy (1970s)" },
          { category: "Plot", description: "No Way Home (Broken Tech)" }
        ],
        beats: [
          { id: "2.2-b1", description: "Peek outside—man installing 'ALI vs. KENT' sign", completed: true },
          { id: "2.2-b2", description: "Full 1970s reveal: Pintos, polyester, vintage ads", completed: true },
          { id: "2.2-b3", description: "Angels react, about to freak out", completed: true }
        ],
        notes: [
          { id: "n2.2-1", author: "RR", type: NoteType.REWRITE, content: "It might be too complicated to have the LA Colisseum/Ali vs Kent connection. Could be a different location." }
        ],
        connections: [],
        scriptContent: `EXT. LA CONVENTION CENTER - 1974 - DAY
The Angels peek out of the front door:

Next to them, A MAN ON A LADDER is putting the "Y" on "ALI vs. KENT FIGHT OF THE CENTURY" LETTER SIGN OUT FRONT.

In front of them is 1970s Los Angeles: Ford Pintos, Firebirds, Polyester suits, Good Year Blimp. Ads for Camel Lights, Betamax, Godfather Part II, and Tab soda.`
      },
      {
        id: "2.3",
        sequenceId: "SEQ_2",
        title: "2.3: Time Machine — Panic",
        pageNumber: 31,
        summary: "Angels panic about being stuck and missing their lives.",
        tracking: [
          { category: "Character", description: "Natalie: Missing kids/Pete" },
          { category: "Plot", description: "Broken Return Mechanism" }
        ],
        beats: [
          { id: "2.3-b1", description: "Frantically hitting buttons trying to get home", completed: true },
          { id: "2.3-b2", description: "Natalie: 'I'm going to stand Pete up'", completed: true },
          { id: "2.3-b3", description: "Dylan remembers phone call—return mechanism broken", completed: true },
          { id: "2.3-b4", description: "'There's... no way home'", completed: true },
          { id: "2.3-b5", description: "'We need help'", completed: true }
        ],
        notes: [
          { id: "n2.3-1", author: "RR", type: NoteType.LOGIC, content: "DECISION TO GO TO CHARLIE: This idea to go to Charlie feels a bit rushed. Needs to feel thought through." }
        ],
        connections: [
          { targetSceneId: "6.5", type: "echo", description: "Dylan uses the dead phone as proof here" }
        ],
        scriptContent: `NATALIE
This can't be happening! This CAN'T BE HAPPENING! We need to fix it!

ALEX
I'm trying! Hitting random buttons is not helping!

DYLAN
What does this mean? Are we vanished totally from 2026?

NATALIE
Oh my god. I'm going to stand Pete up.

DYLAN
Uh, something I overheard in Ray's office is starting to make sense. The machine's return mechanism wasn't working.`
      },
      {
        id: "2.6",
        sequenceId: "SEQ_2",
        title: "2.6: Goodwill",
        pageNumber: 34,
        summary: "Angels get period clothes and set ground rules.",
        tracking: [
          { category: "Theme", description: "Time Travel Rules (BTTF)" }
        ],
        beats: [
          { id: "2.6-b1", description: "Exit in cheaper donated clothes", completed: true },
          { id: "2.6-b2", description: "Establish ground rules: No fighting, no romance, no future talk", completed: true },
          { id: "2.6-b3", description: "Phone book shows five Charles Townsends", completed: true },
          { id: "2.6-b4", description: "'Let's go to the agency'", completed: true }
        ],
        notes: [],
        connections: [
          { targetSceneId: "6.5", type: "causal", description: "Breaking the ground rules later in the script" }
        ],
        scriptContent: `EXT. GOODWILL - DAY
The Angels walk out wearing less cute clothes that are still very 70s, but also feel very donated.

ALEX
Let's make some ground rules.

NATALIE
We can't interfere with anything.

DYLAN
Back to the future rules. Got it.

ALEX
OK so, examples. No fighting--

NATALIE
--No romance, Dylan.`
      },
      {
        id: "2.8",
        sequenceId: "SEQ_2",
        title: "2.8: Johnny Pockets — 1974",
        pageNumber: 36,
        summary: "Angels visit their favorite diner in the past.",
        tracking: [
          { category: "Setting", description: "Diner Consistency" },
          { category: "Mystery", description: "Torrenti Murder Info" }
        ],
        beats: [
          { id: "2.8-b1", description: "Familiar diner, different clientele (Hell's Angels)", completed: true },
          { id: "2.8-b2", description: "Young Vera takes order; Natalie almost orders signature shake", completed: true },
          { id: "2.8-b3", description: "TV: Torrenti waterbed commercial, then news of his murder", completed: true },
          { id: "2.8-b4", description: "Dylan pulls up cached article on phone", completed: true },
          { id: "2.8-b5", description: "Vera asks about phone—'We are... magicians'", completed: true }
        ],
        notes: [
          { id: "n2.8-1", author: "MM", type: NoteType.REWRITE, content: "Add Anna into news story at the diner." }
        ],
        connections: [],
        scriptContent: `INT. JOHNNY POCKETS - DAY
The Angels sit in their diner, relieved to be somewhere familiar. The only thing different is the amount of Hells Angels.

DYLAN
Burgers, fries, and Chocolate shake--

ANGELS TOGETHER
--With vanilla syrup!

VERA
I've owned this diner for 50 years, you three are the only ones who ever order a chocolate shake with vanilla syrup...

The TV above the counter is playing a TORRENTI WATERBED commercial.

NEWS ANCHOR
That was Sam Torrenti... He was gunned down in his waterbed showroom last night.`
      },
      {
        id: "2.10",
        sequenceId: "SEQ_2",
        title: "2.10: Bar Brawl",
        pageNumber: 39,
        summary: "Angels fight Hell's Angels to defend themselves.",
        tracking: [
          { category: "Action", description: "Future Fighting Skills vs 70s Thugs" }
        ],
        beats: [
          { id: "2.10-b1", description: "Angels demolish Hell's Angels with advanced future skills", completed: true },
          { id: "2.10-b2", description: "Music cue: 'Rich Girl' by Hall & Oates", completed: true },
          { id: "2.10-b3", description: "'Fighting is so easy in the 70s!'", completed: true },
          { id: "2.10-b4", description: "Alex gives keys to Vera, Angels run to agency", completed: true }
        ],
        notes: [],
        connections: [],
        scriptContent: `DYLAN
So much for no fights.

The Angels SNAP INTO ACTION.

ON NATALIE who is in a classic bar brawl, but her movements look sped up.

MUSIC CUE: "RICH GIRL" by Hall and Oats.

Alex THROAT PUNCHES the Drunk Guy.

NATALIE
Fighting is so easy in the 70s!

ALEX
We're all freaking Bruce Lee right now.`
      },
      {
        id: "2.13",
        sequenceId: "SEQ_2",
        title: "2.13: Charlie Revealed",
        pageNumber: 44,
        summary: "The Drunk Guy reveals himself to be Charlie Townsend.",
        tracking: [
          { category: "Character Arc", description: "Charlie: Broken Hero Reveal" }
        ],
        beats: [
          { id: "2.13-b1", description: "Drunk Guy returns—Toni furious he blew Santa Anna cover", completed: true },
          { id: "2.13-b2", description: "Toni fires Charlie", completed: true },
          { id: "2.13-b3", description: "Dylan picks up badge: CHARLES TOWNSEND", completed: true },
          { id: "2.13-b4", description: "Charlie flips Toni off, peels out", completed: true }
        ],
        notes: [
          { id: "n2.13-1", author: "MM", type: NoteType.THEME, content: "Seed in the 'Dylan, don't fuck Charlie' runner" }
        ],
        connections: [],
        scriptContent: `TONI
You're fired, Charlie. Give me your badge.

CHARLIE
Fired? You think I care? Take it!

He throws his PI badge on the desk. The Angels look at each other--

DYLAN
Did she just say...

Dylan picks up his badge. CHARLES TOWNSEND.`
      },
      {
        id: "2.14",
        sequenceId: "SEQ_2",
        title: "2.14: Outside Agency",
        pageNumber: 45,
        summary: "Angels realize they must help Charlie solve the case to restore the future.",
        tracking: [
          { category: "Plot", description: "Restoring the Timeline" }
        ],
        beats: [
          { id: "2.14-b1", description: "'How can that be Charlie?'", completed: true },
          { id: "2.14-b2", description: "Realization: 'If Charlie doesn't solve the Torrenti murder, he never opens his agency'", completed: true },
          { id: "2.14-b3", description: "Plan: Lead Charlie to find it; he gets credit; timeline restored", completed: true },
          { id: "2.14-b4", description: "Toni hires them with cash advance", completed: true }
        ],
        notes: [],
        connections: [
          { targetSceneId: "4.3", type: "causal", description: "The plan to solve the murder backfires" }
        ],
        scriptContent: `DYLAN
How can that be Charlie?

NATALIE
If Charlie doesn't solve the Torrenti murder then he never opens his own agency.

DYLAN
And we never meet.

DYLAN (CONT'D)
Charlie finds the murder weapon at Anna's house in her nightstand. That's it, that's the big break in the case.

ALEX
It's OK, I've got a plan! All we have to do is lead Charlie to Anna's and get him to find the murder weapon.`
      }
    ]
  },
  {
    id: "SEQ_3",
    title: "SEQUENCE 3: FIRST ATTEMPT",
    dramaticQuestion: "Can they handle this world and solve the case?",
    climax: "Bar fight reveals they're changing too much",
    resolution: "Complications—gun isn't where it should be",
    scenes: [
      {
        id: "3.1",
        sequenceId: "SEQ_3",
        title: "3.1: Charlie's Apartment",
        pageNumber: 46,
        summary: "Angels convince a drunk Charlie to work with them.",
        tracking: [
          { category: "Character", description: "Charlie's Orangutan Introduced" }
        ],
        beats: [
          { id: "3.1-b1", description: "Knock, no answer, door unlocked—enter", completed: true },
          { id: "3.1-b2", description: "Orangutan jumps out with Scrabble board", completed: true },
          { id: "3.1-b3", description: "Charlie returns drunk with groceries and six-pack", completed: true },
          { id: "3.1-b4", description: "'We want you to work this case with us'", completed: true },
          { id: "3.1-b5", description: "'We need a driver. You have a car'", completed: true }
        ],
        notes: [
          { id: "n3.1-1", author: "RR", type: NoteType.REWRITE, content: "Let's hear what Charlie's 'real dream' is that he's going to pursue (The Barnacle)." },
          { id: "n3.1-2", author: "MM", type: NoteType.CHARACTER, content: "Orangutan needs a name and more action." }
        ],
        connections: [
          { targetSceneId: "5.3", type: "causal", description: "Charlie as 'just the driver' setup" }
        ],
        scriptContent: `INT. CHARLIE'S APARTMENT - DAY
The apartment is somehow both bare and cluttered.

Alex opens the door and an ORANGUTAN jumps out.

DYLAN
I think-- I think he wants to play Scrabble?

CHARLIE (O.S.)
His owner smuggled tobacco from Mexico. Poor guy just wants to be in the cab of a Mac truck.

Charlie is standing behind them in the doorway holding a grocery bag and a six-pack.`
      },
      {
        id: "3.2",
        sequenceId: "SEQ_3",
        title: "3.2: Torrenti House — Stakeout",
        pageNumber: 48,
        summary: "Stakeout at the murder victim's house.",
        tracking: [
          { category: "Mystery", description: "Anna's Innocence Questioned" }
        ],
        beats: [
          { id: "3.2-b1", description: "In Charlie's car watching mansion", completed: true },
          { id: "3.2-b2", description: "Charlie questions approach; Angels certain Anna's guilty", completed: true },
          { id: "3.2-b3", description: "Anna leaves in Cadillac", completed: true },
          { id: "3.2-b4", description: "Dylan searches house—gun isn't there", completed: true }
        ],
        notes: [],
        connections: [],
        scriptContent: `EXT. TORRENTI HOUSE - DAY
The Angels and Charlie sit in their car on the street.

CHARLIE
Why are we at the Torrenti house?

NATALIE
Anna killed her husband, Charlie.

CHARLIE
I don't think so... Women have trouble lifting guns.

ALEX
OK we're going to let that slide.

A WOMAN in her 30s comes out of the house... It's ANNA.

DYLAN
Nope. Get up. We've got to search the house for a murder weapon.

CHARLIE
That's all you guys. I'm just the driver.`
      },
      {
        id: "3.4",
        sequenceId: "SEQ_3",
        title: "3.4: Charlie's Apartment — Night",
        pageNumber: 53,
        summary: "The team bonds over Chinese food. Charlie reveals his trauma.",
        tracking: [
          { category: "Character Arc", description: "Charlie: PTSD/Trauma Reveal" },
          { category: "Theme", description: "Found Family" }
        ],
        beats: [
          { id: "3.4-b1", description: "Eating Chinese takeout and beer", completed: true },
          { id: "3.4-b2", description: "Charlie impressed: 'I've never seen anyone investigate like you three'", completed: true },
          { id: "3.4-b3", description: "Charlie reveals trauma: war, PTSD, dead friend", completed: true },
          { id: "3.4-b4", description: "Angels reflect: 'Poor Charlie' / 'We're going to help him'", completed: true }
        ],
        notes: [
          { id: "n3.4-1", author: "RR", type: NoteType.CHARACTER, content: "Charlie doesn't have to give all this up. He can be more (comedically) in denial." }
        ],
        connections: [
          { targetSceneId: "6.4", type: "causal", description: "Charlie's trauma vulnerability leads to his later explosion" }
        ],
        scriptContent: `INT. CHARLIE'S APARTMENT - NIGHT
They're back at Charlie's apartment, eating Chinese take out and drinking beer.

CHARLIE
I've never seen anyone investigate like you three. It's a lot. But it's kind of rad.

CHARLIE (CONT'D)
I used to sleep like a baby, but ever since the war... I don't.

NATALIE
Maybe you should see a therapist? You could have PTSD.

CHARLIE
PTS-what? No I don't need a head doctor.`
      }
    ]
  },
  {
    id: "SEQ_4",
    title: "SEQUENCE 4: MIDPOINT BUILDUP",
    dramaticQuestion: "Will Charlie find the gun and solve the case?",
    climax: "MIDPOINT — Charlie shoots gun, becomes murder suspect; Anna arrested",
    resolution: "Everything changes—now fugitives trying to clear both",
    scenes: [
      {
        id: "4.2",
        sequenceId: "SEQ_4",
        title: "4.2: The Planted Gun",
        pageNumber: 56,
        summary: "Charlie finds the gun but realizes it was planted.",
        tracking: [
          { category: "Mystery", description: "Frame-up Revealed" }
        ],
        beats: [
          { id: "4.2-b1", description: "Charlie finds package in nightstand", completed: true },
          { id: "4.2-b2", description: "Someone else sneaks in through window", completed: true },
          { id: "4.2-b3", description: "Charlie hides in closet, watches intruder plant gun", completed: true },
          { id: "4.2-b4", description: "Charlie realizes: 'Someone's trying to frame Anna'", completed: true }
        ],
        notes: [],
        connections: [
          { targetSceneId: "5.5", type: "echo", description: "Charlie recognizes the planter (Ray) later" }
        ],
        scriptContent: `Charlie hides in a closet. Through a crack in the door, he watches someone open the nightstand drawer and put something in.

Charlie looks in drawer again-- there's the gun.

CHARLIE
Uh, guys? Whoever that was left a gun in the nightstand drawer.

DYLAN
Wait, what?

CHARLIE
That guy planted the murder weapon!`
      },
      {
        id: "4.3",
        sequenceId: "SEQ_4",
        title: "4.3: Charlie's Decision",
        pageNumber: 56,
        summary: "Charlie makes a rash decision that backfires drastically.",
        variants: {
          "B": `NATALIE
Charlie you have to get out of there, the cops are coming.

CHARLIE
Someone's trying to frame Anna. Not on my watch.

Charlie grabs the gun, but HESITATES.

CHARLIE (CONT'D)
If I take this, I'm tampering with evidence.

DYLAN
If you don't, Anna goes to jail for life!

CHARLIE
But--

SLAM! The door is KICKED IN.

COP
Drop it!

Charlie DROPS the gun. It slides across the floor.
`
        },
        tracking: [
          { category: "Action", description: "Midpoint Action Sequence" },
          { category: "Plot", description: "Timeline Divergence" }
        ],
        beats: [
          { id: "4.3-b1", description: "Sirens approaching", completed: true },
          { id: "4.3-b2", description: "Charlie makes snap decision: 'Not on my watch'", completed: true },
          { id: "4.3-b3", description: "Grabs gun and runs", completed: true },
          { id: "4.3-b4", description: "Sniper fires (visible laser, clearly 2025 tech)", completed: true },
          { id: "4.3-b5", description: "Charlie fires back with the murder weapon", completed: true }
        ],
        notes: [],
        connections: [
          { targetSceneId: "4.5", type: "causal", description: "Using the murder weapon directly causes Charlie to become the suspect" }
        ],
        scriptContent: `NATALIE
Charlie you have to get out of there, the cops are coming.

CHARLIE
Someone's trying to frame Anna. Not on my watch.

Charlie grabs the gun and runs down the stairs.

EXT. TORRENTI HOUSE
Charlie bursts through the front door as cop cars come screaming to a stop.

COP
Drop your weapon!

A SHOT RINGS OUT. The wood above Charlie's head SPLINTERS. There's a visible sniper laser on Charlie's chest.

Charlie, not thinking, fires back with the murder weapon.`
      },
      {
        id: "4.4",
        sequenceId: "SEQ_4",
        title: "4.4: Getaway",
        pageNumber: 57,
        summary: "The Angels rescue Charlie but berate him for using the evidence.",
        tracking: [
          { category: "Character Arc", description: "Charlie: Failure/Defensiveness" }
        ],
        beats: [
          { id: "4.4-b1", description: "Dylan doing crazy driving while Angels berate Charlie", completed: true },
          { id: "4.4-b2", description: "'Why would you use the murder weapon??'", completed: true },
          { id: "4.4-b3", description: "Charlie defends himself: 'I was getting shot at!'", completed: true },
          { id: "4.4-b4", description: "Toni's car screeches in front—she's furious", completed: true }
        ],
        notes: [],
        connections: [],
        scriptContent: `ALEX
What is wrong with you?? Why would you use the murder weapon??

CHARLIE
I was getting shot at!

NATALIE
All you had to do was get the weapon and solve the case, how do you keep messing up???

CHARLIE
You need to back off. I didn't even want to do this and now someone's trying to kill me.`
      },
      {
        id: "4.5",
        sequenceId: "SEQ_4",
        title: "4.5: Toni's Apartment",
        pageNumber: 58,
        summary: "Toni reveals Anna has been arrested and Charlie is a suspect.",
        tracking: [
          { category: "Plot", description: "Midpoint Climax: Situation Reversal" }
        ],
        beats: [
          { id: "4.5-b1", description: "Toni dresses everyone down", completed: true },
          { id: "4.5-b2", description: "Ballistics ran—two sets of prints: Charlie's and Anna's", completed: true },
          { id: "4.5-b3", description: "Working theory: Anna hired Charlie to kill Sam", completed: true },
          { id: "4.5-b4", description: "Anna arrested, cops looking for Charlie", completed: true },
          { id: "4.5-b5", description: "MIDPOINT — complete reversal; everything's worse", completed: true }
        ],
        notes: [],
        connections: [],
        scriptContent: `INT. TONI'S APARTMENT - DAY

TONI
Why is Charlie working this case with you?

ALEX
He's uh, he's our driver.

TONI
Oh ok. Uh, then why was your driver handling evidence???

TONI (CONT'D)
The working theory right now is that Anna hired Charlie to kill Sam. They arrested Anna and now they're looking for Charlie.`
      }
    ]
  },
  {
    id: "SEQ_5",
    title: "SEQUENCE 5: COMPLICATIONS",
    dramaticQuestion: "Can they clear Charlie AND Anna?",
    climax: "Ray Caldero revealed; evidence destroyed; Ray escapes",
    resolution: "Situation worsens—no proof, multiple mysteries",
    scenes: [
      {
        id: "5.1",
        sequenceId: "SEQ_5",
        title: "5.1: Toni's Bedroom",
        pageNumber: 59,
        summary: "Angels regroup and recommit to the mission.",
        tracking: [
          { category: "Character Arc", description: "Angels: Personal Stakes" },
          { category: "Theme", description: "Doing the right thing" }
        ],
        beats: [
          { id: "5.1-b1", description: "Angels on rotating bed under ceiling mirror", completed: true },
          { id: "5.1-b2", description: "'Everything we do just makes things worse'", completed: true },
          { id: "5.1-b3", description: "New resolve: 'We can figure this out. Anna is innocent'", completed: true }
        ],
        notes: [],
        connections: [],
        scriptContent: `INT. TONI'S BEDROOM - DAY
The Angels are cuddled up on a rotating bed looking up at a ceiling mirror.

DYLAN
We have to solve this case, for real. And we have to do it with Charlie. He needs us to believe in him the way he believed in me.

ALEX
He's a mess...

NATALIE
...But he's our mess.`
      },
      {
        id: "5.3",
        sequenceId: "SEQ_5",
        title: "5.3: Liquid Dreams — Waterbed Showroom",
        pageNumber: 61,
        summary: "Infiltrating the waterbed store to find the real killer.",
        tracking: [
          { category: "Setting", description: "70s Waterbed Kitsch" },
          { category: "Action", description: "Stealth Mission" }
        ],
        beats: [
          { id: "5.3-b1", description: "Case the darkened store; cop napping two blocks down", completed: true },
          { id: "5.3-b2", description: "Alex kicks in door", completed: true },
          { id: "5.3-b3", description: "Lights on—hippie fantasia of 40 waterbeds", completed: true },
          { id: "5.3-b4", description: "Natalie bounces on beds: 'I LOVE THE SEVENTIES!'", completed: true },
          { id: "5.3-b5", description: "Natalie splits waterbed—orange sachet tumbles out", completed: true }
        ],
        notes: [
          { id: "n5.3-1", author: "RR", type: NoteType.LOGIC, content: "Camera— Will need to have set this up before -- switching to analog (partially to save phone juice, also Charlie can't know)" }
        ],
        connections: [],
        scriptContent: `INT. LIQUID DREAMS - WAREHOUSE -- SECONDS LATER

WHAM! Alex kicks in the door.

DYLAN
Jesus, Alex.

ALEX
What are they gonna do? Check the security footage?

MAIN SHOWROOM, where Charlie hits the LIGHTS. Holy shit.
40 WATERBEDS AND AIRBEDS lie in a hippie fantasia grid.

NATALIE
This place is AWESOME.

--Natalie lands hard. The waterbed SPLITS-- WATER POOLS OUT. Something ORANGE tumbles free, a VINYL SACHET--`
      },
      {
        id: "5.5",
        sequenceId: "SEQ_5",
        title: "5.5: Hippie Mafia Arrives",
        pageNumber: 64,
        summary: "The villains arrive, including a shocking face from the future.",
        tracking: [
          { category: "Character", description: "Young Ray Caldero Reveal" },
          { category: "Mystery", description: "Hippie Mafia Operation" }
        ],
        beats: [
          { id: "5.5-b1", description: "Keys jingle—Angels scatter and hide", completed: true },
          { id: "5.5-b2", description: "Otto leads Suede and Martin; truck backs in", completed: true },
          { id: "5.5-b3", description: "Shadowed figure steps into light: young Ray Caldero (early 20s)", completed: true },
          { id: "5.5-b4", description: "Charlie recognizes: 'That's him. From Anna's apartment. He planted the gun'", completed: true }
        ],
        notes: [],
        connections: [
          { targetSceneId: "6.1", type: "causal", description: "Ray's presence leads to questioning Anna about him" }
        ],
        scriptContent: `KEYS JINGLE in the front door.

OTTO, Sam's brother, leads. Behind, two HIPPIE MAFIA in their 20s: SUEDE and MARTIN.

A FIGURE jumps down from the truck bed -- his FACE in SHADOW.

He walks toward the back, past the SHADOWED FIGURE just as he steps into the LIGHT from the showroom lamps.

RAY CALDERO. Early 20s, dark hair, earnest, anxious.

Charlie's eyes widen, grabs Dylan's arm, whispers:

CHARLIE
That's him. From Anna's apartment. He planted the gun.`
      },
      {
        id: "5.6",
        sequenceId: "SEQ_5",
        title: "5.6: Blown Cover",
        pageNumber: 66,
        summary: "A tech malfunction exposes the Angels.",
        tracking: [
          { category: "Comedy", description: "Tech Anachronism Fails" }
        ],
        beats: [
          { id: "5.6-b1", description: "Dylan frames perfect shot of Ray", completed: true },
          { id: "5.6-b2", description: "Camera jams—auto-rewind is deafening", completed: true },
          { id: "5.6-b3", description: "Charlie tries to help, knocks camera, drops flask", completed: true },
          { id: "5.6-b4", description: "Ray approaches, following the sound", completed: true }
        ],
        notes: [],
        connections: [],
        scriptContent: `Dylan raises the camera. Times it for when Ray's fully in frame.

CLICK -- The camera JAMS. The film counter reads: 36.

ZZZZZZZZZZZIP -- The AUTO-REWIND is DEAFENING in the space.

YOUNG RAY Freezes. Head snaps toward the sound.

Charlie trying to muffle the camera, but he KNOCKS IT OUT OF HER HANDS and DROPS HIS FLASK, EVEN LOUDER--

OTTO
--Someone's here. I told you.`
      },
      {
        id: "5.9",
        sequenceId: "SEQ_5",
        title: "5.9: Split Action — Chase and Fight",
        pageNumber: 69,
        summary: "Chaotic fight scene and chase through the movie studio backlot.",
        tracking: [
          { category: "Action", description: "Waterbed Fight Physics" },
          { category: "Action", description: "Hollywood Backlot Chase" }
        ],
        beats: [
          { id: "5.9-b1", description: "Dylan and Charlie chase Ray; Natalie yells 'Get the evidence!'", completed: true },
          { id: "5.9-b2", description: "Showroom fight begins: Alex/Natalie vs. Otto/Suede/Martin", completed: true },
          { id: "5.9-b3", description: "Backlot chase begins: Ray through studio gate into Sunset-Gower", completed: true },
          { id: "5.9-b4", description: "Chase through 'Six Million Dollar Man' set (slow motion)", completed: true },
          { id: "5.9-b5", description: "Fight on waterbeds—sloshing, romantic confusion", completed: true },
          { id: "5.9-b6", description: "Gunsmoke barroom brawl—Dylan's camera flies; Charlie bobbles and drops it", completed: true },
          { id: "5.9-b7", description: "Camera destroyed on Gunsmoke floor", completed: true }
        ],
        notes: [
          { id: "n5.9-1", author: "RR", type: NoteType.REWRITE, content: "This is ONE extended sequence intercutting two simultaneous actions. Keep the energy high." }
        ],
        connections: [],
        scriptContent: `INT. LIQUID DREAMS - SHOWROOM - INTERCUT

Natalie and Alex LEAP and FIGHT from bed to bed like they've been taking "70's Bed Fighting" classes for years.

Every move creates UNEXPECTED BOUNCES.

INT. SOUNDSTAGE 12 - "SIX MILLION DOLLAR MAN" SET
The set is LIVE. Cameras rolling. LEE MAJORS in the OSI LABORATORY -- 1970's futuristic--

Ray CRASHES through a fake window.
Dylan and Charlie burst through the same window--

Everything goes SLOW MOTION -- CHI-CHI-CHI-CHI (the bionic sound effect).

CHARLIE
(slow motion)
Sorryyyyyy Leeee Maaajorrrs!`
      }
    ]
  },
  {
    id: "SEQ_6",
    title: "SEQUENCE 6: FINAL PUSH / ALL IS LOST",
    dramaticQuestion: "Will Charlie give up? Will they cease to exist?",
    climax: "Charlie quits, walks away",
    resolution: "Angels accept they must proceed alone; may never have existed",
    scenes: [
      {
        id: "6.1",
        sequenceId: "SEQ_6",
        title: "6.1: County Jail — Visiting Anna",
        pageNumber: 75,
        summary: "Angels visit Anna in jail to find out the truth.",
        tracking: [
          { category: "Mystery", description: "Ray's Motive Reveal" }
        ],
        beats: [
          { id: "6.1-b1", description: "Four Angels pack into one visiting window (awkward choreography)", completed: true },
          { id: "6.1-b2", description: "Anna reveals Ray was her lover", completed: true },
          { id: "6.1-b3", description: "Flashback: Anna and Ray's relationship—he made her feel seen", completed: true },
          { id: "6.1-b4", description: "'Ray ended it right after Sam was killed'", completed: true },
          { id: "6.1-b5", description: "Anna fighting tears, asks if they'll tell police it was Otto", completed: true }
        ],
        notes: [],
        connections: [],
        scriptContent: `INT. LOS ANGELES COUNTY JAIL - VISITING ROOM - DAY
Dylan, Natalie, Alex, and Charlie file past a GUARD to the visiting window.

ANNA
He ended it right after Sam was killed. I don't know why.

ANNA (CONT'D)
He was part of it. But Ray wasn't... he grew up with nothing, no family--

DYLAN
But you think it was Otto.

After a beat, Anna nods.`
      },
      {
        id: "6.4",
        sequenceId: "SEQ_6",
        title: "6.4: Charlie Explodes",
        pageNumber: 82,
        summary: "Charlie quits the case and abandons the Angels.",
        tracking: [
          { category: "Character Arc", description: "Charlie: All is Lost Moment" }
        ],
        beats: [
          { id: "6.4-b1", description: "'I'm not talking about the drink'", completed: true },
          { id: "6.4-b2", description: "'I'm a fuckup, OK? I've messed up everything I could'", completed: true },
          { id: "6.4-b3", description: "'I'm not the person you think I am'", completed: true },
          { id: "6.4-b4", description: "Dylan tries: 'Charlie, yes you are—'", completed: true },
          { id: "6.4-b5", description: "'You wasted your time'", completed: true }
        ],
        notes: [],
        connections: [
          { targetSceneId: "6.6", type: "causal", description: "Leads to final rejection" }
        ],
        scriptContent: `CHARLIE
I'm not talking about the drink... I'm talking about I'm done. With all of this.

CHARLIE (CONT'D)
In case you missed it, I'm a fuckup, OK? I've messed up everything I could and drafted off you chicks this entire time. I can't keep my shit together.

DYLAN
Charlie, yes you are. You're exactly--

CHARLIE
No. Whatever you think, whatever you're seeing, it's not me. I'm sorry. You wasted your time.`
      },
      {
        id: "6.5",
        sequenceId: "SEQ_6",
        title: "6.5: Dylan Breaks the Rule",
        pageNumber: 83,
        summary: "Dylan reveals the truth about the future to Charlie.",
        tracking: [
          { category: "Plot", description: "Time Travel Truth Reveal" }
        ],
        beats: [
          { id: "6.5-b1", description: "'We're from the future'", completed: true },
          { id: "6.5-b2", description: "Charlie: 'You're insane'", completed: true },
          { id: "6.5-b3", description: "Alex tries to show dead iPhone as proof", completed: true },
          { id: "6.5-b4", description: "Dylan explains: 'You're this incredible person who changed our lives'", completed: true }
        ],
        notes: [],
        connections: [],
        scriptContent: `DYLAN
We're from the future.

Charlie stops. Stares at her. So do the others.

DYLAN
We're from 2025. Fifty-three years from now. And we've messed up the timeline--

CHARLIE
You're insane.

ALEX
We're not insane. Look—

She pulls out her iPhone. Dead. Of course.`
      },
      {
        id: "6.6",
        sequenceId: "SEQ_6",
        title: "6.6: Charlie's Rejection",
        pageNumber: 84,
        summary: "Charlie refuses to believe the truth and leaves.",
        tracking: [
          { category: "Character Arc", description: "Charlie: Rejects the Call" }
        ],
        beats: [
          { id: "6.6-b1", description: "'You're telling me in your 'future' I'm some smooth operator badass?'", completed: true },
          { id: "6.6-b2", description: "'People like you don't need people like me'", completed: true },
          { id: "6.6-b3", description: "'Find someone else. I'm not your guy'", completed: true },
          { id: "6.6-b4", description: "Charlie leaves, drives away", completed: true }
        ],
        notes: [],
        connections: [
          { targetSceneId: "6.8", type: "causal", description: "Forces Angels to form pact" }
        ],
        scriptContent: `CHARLIE
You're telling me in your "future" I'm some smooth operator badass because I put that woman in jail? Erroneously?

DYLAN
You started an agency. You gave people like us a place—

CHARLIE
People like you don't need people like me.

CHARLIE (CONT'D)
No. You listen. Whatever you are - spies, con artists, I don't give a shit -- find someone else. I'm not your guy. I was never your guy.

Charlie leaves, looks at them through the window. Broken. Gets in his car, DRIVES AWAY.`
      },
      {
        id: "6.8",
        sequenceId: "SEQ_6",
        title: "6.8: The Pact",
        pageNumber: 85,
        summary: "The Angels decide to finish the mission alone.",
        tracking: [
          { category: "Theme", description: "Angels Reliance" }
        ],
        beats: [
          { id: "6.8-b1", description: "Alex pragmatic: 'We proceed without him'", completed: true },
          { id: "6.8-b2", description: "'Find Otto, get a confession, clear Anna'", completed: true },
          { id: "6.8-b3", description: "Dylan: 'And if that erases everything we know? Including each other?'", completed: true },
          { id: "6.8-b4", description: "Stack hands. 'We figure it out ourselves'", completed: true }
        ],
        notes: [],
        connections: [],
        scriptContent: `ALEX
(pragmatic)
We proceed without him. Tomorrow night, Ontario Speedway. We find Otto, we get a confession, we clear Anna.

DYLAN
And if that erases everything we know? Including each other.

Beat. No good answer.

NATALIE
This will be our spot. If we remember.

They stack hands. Dylan looks at the road where Charlie disappeared.

DYLAN
Do you think he'll come back?

ALEX
No.

DYLAN
Me neither. We figure it out ourselves.`
      }
    ]
  }
];

export default sequences;
