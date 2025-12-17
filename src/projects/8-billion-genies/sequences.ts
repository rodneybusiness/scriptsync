/**
 * 8 Billion Genies - Sequence and Scene Data
 * Based on screenplay draft incorporating Amazon + Point Grey notes
 */

import { Sequence, NoteType } from '../../config/types';

export const sequences: Sequence[] = [
  // ============================================================================
  // SEQUENCE 1: G-DAY
  // ============================================================================
  {
    id: "SEQ_1",
    title: "SEQUENCE 1: G-DAY",
    dramaticQuestion: "What happens when everyone on Earth gets a genie?",
    climax: "8 billion genies appear simultaneously",
    resolution: "Will protects the bar; chaos erupts outside",
    scenes: [
      {
        id: "1.1",
        sequenceId: "SEQ_1",
        title: "1.1: Opening Montage - World Before",
        pageNumber: 1,
        location: "EARTH - VARIOUS",
        timeOfDay: "DAY",
        summary: "Will's V.O. introduces a world of 7.9 billion people, all wanting more. We see Floyd's humiliating proposal rejection by Daisy at a stadium.",
        scriptContent: `FADE IN: SUNRISE ON EARTH. LIGHT ILLUMINATES THE PLANET.
TITLE: HUMAN POPULATION - 7,999,992,137

WILL (V.O.)
This was the world with 7.9 billion people. Quiet, isn't it? Harmless. From up here. Get closer though...different story.

VIBRANT SHOTS of major cities, bustling streets, commuter trains, packed markets--

WILL (V.O.)
7.9 billion people, all of them wishing for something more, something different. That's humanity's greatest tragedy right there. Wanting more than you can handle...(beat)...when you don't quite know what you want.

A PACKED STADIUM. The Tigers are losing, but FLOYD FAUGHN, 30s, doesn't notice. He's fidgeting with something in his pocket while his date DAISY WANLESS, 20s, checks Instagram.

Floyd SPRINGS to one knee, nearly tumbling down the steps. The box comes out—velvet, and he's ALREADY CRYING.

FLOYD
Daisy, I know it's only been a month, but when you know, you know.

DAISY
...Floyd no, I can't-- commit to weekend plans-- this is not a good idea--

FLOYD
No. It's the best idea! I believe in us. Let's lock this down and make babies!...What do you say?

DAISY
I, just wanted to go to the game. You kept getting tickets to cool stuff.

Initial LAUGHTER ripples through the crowd.

DAISY
I have to stop dating.

Daisy edges out of her seat, then LEAVES HIM THERE. Floyd, still on one knee, is CRUSHED (the Jumbotron stays on him).`,
        beats: [
          { id: "1.1-b1", description: "Will's V.O. establishes world of 7.9B people wanting more", completed: true },
          { id: "1.1-b2", description: "Floyd's proposal to Daisy at stadium after ONE MONTH", completed: true },
          { id: "1.1-b3", description: "Daisy rejects Floyd publicly, humiliating him on Jumbotron", completed: true },
          { id: "1.1-b4", description: "Establish Daisy's pattern: avoidance, ghosting, no commitment", completed: true }
        ],
        notes: [
          { id: "n1.1-1", author: "AMZN", type: NoteType.CHARACTER, content: "Consider playing Will's V.O. over montage of Floyd's upbringing - child celebrated for ideas grows into man mocked for them. Build understanding that Floyd wants RECOGNITION for ideas, not actual good ideas." },
          { id: "n1.1-2", author: "PG", type: NoteType.CHARACTER, content: "Should Floyd and Daisy have had more of a relationship and uglier fallout? Maybe she said something more hurtful when declining?" },
          { id: "n1.1-3", author: "RR", type: NoteType.THEME, content: "Floyd's fatal flaw (addiction to recognition) should be key to how heroes beat him in finale." }
        ],
        tracking: [
          { category: "Character Arc", description: "Floyd's public humiliation - origin of his villainy" },
          { category: "Character Arc", description: "Daisy's avoidance pattern established" },
          { category: "Setup", description: "Floyd/Daisy history that pays off when he's revealed as Idea Man" },
          { category: "Theme", description: "Wanting more than you can handle" }
        ],
        connections: [
          { targetSceneId: "5.2", type: "callback", description: "Floyd revealed as Idea Man, references this rejection" },
          { targetSceneId: "7.3", type: "callback", description: "Remnant Daisy in Floyd's mansion" }
        ]
      },
      {
        id: "1.2",
        sequenceId: "SEQ_1",
        title: "1.2: Lampwick Bar - Robbie's Birthday",
        pageNumber: 3,
        location: "INT. LAMPWICK BAR",
        timeOfDay: "DAY",
        summary: "We meet Will, Robbie (turning 13), alcoholic stepfather Ed. Daisy and Alex arrive separately for a Tinder date - but they've met before and Daisy doesn't remember.",
        scriptContent: `INT. LAMPWICK BAR - DAY
A dive bar. WILL JENNINGS, 60s, polishes glass with the ease of someone who's seen it all more than once.

WILL (V.O.)
As for me, when all this started I was a bartender. In fact, here comes my number one customer.

Will glances out the window as a school bus pulls up nearby. ROBBIE GREEN, 13, enters, drops his backpack onto a table with a sigh. Will gives him a warm smile, pouring a glass of milk.

WILL
Birthday boy.

At the end of the bar, ED MCCRAE, 50s, nurses a beer with trembling hands. Seeing Robbie, he COUGHS, drains his glass and shuffles over.

ED
--My boy! How we doin?

ROBBIE
Fine.

ED
No no no, it's your birthday! We gotta do better than fine...

Ed pulls out a clumsily wrapped gift - a NARUTO OMNIBUS. Robbie's genuinely disappointed - it's a duplicate.

ROBBIE
I love it.

ED
...I gave it to you last year?

The subtle role reversal is clear - Robbie comforting Ed, not the other way around.

WILL
And, Ed, don't forget about the one you had hidden behind the bar.

Will places another book - The Art of Naruto. Robbie's genuinely thrilled. Ed mouths "Thank you" to Will.

The door opens. ALEX enters, scans the bar, doesn't love the place.

ALEX
You guys open...?

WILL
Any seat you like.`,
        beats: [
          { id: "1.2-b1", description: "Will established as bartender with mysterious knowledge", completed: true },
          { id: "1.2-b2", description: "Robbie's 13th birthday - Ed gives duplicate gift (alcoholism)", completed: true },
          { id: "1.2-b3", description: "Will covers for Ed with second gift - their dynamic shown", completed: true },
          { id: "1.2-b4", description: "Alex arrives for date", completed: true }
        ],
        notes: [
          { id: "n1.2-1", author: "PG", type: NoteType.CHARACTER, content: "Seed that Ed is Robbie's STEPSON sooner. Could be opportunity when Ed talks to himself in bathroom?" },
          { id: "n1.2-2", author: "AMZN", type: NoteType.CHARACTER, content: "Will should be more specific about why they might want to stay inside the bar later." },
          { id: "n1.2-3", author: "RR", type: NoteType.THEME, content: "Robbie as 'protector' - he's already taking care of Ed, not the other way around" }
        ],
        tracking: [
          { category: "Character Arc", description: "Robbie's protector instinct - comforting Ed" },
          { category: "Character Arc", description: "Ed's alcoholism and failing health" },
          { category: "Setup", description: "Will's mysterious preparedness" },
          { category: "Setup", description: "Naruto book - pays off with Robbie's wish" }
        ],
        connections: [
          { targetSceneId: "2.5", type: "foreshadow", description: "Naruto imagery informs Robbie's wish" },
          { targetSceneId: "8.4", type: "callback", description: "Will revealed as genie" }
        ]
      },
      {
        id: "1.3",
        sequenceId: "SEQ_1",
        title: "1.3: Daisy & Alex's Disastrous Date",
        pageNumber: 5,
        location: "INT. LAMPWICK BAR",
        timeOfDay: "DAY",
        summary: "Daisy arrives for Tinder date with Alex. He reveals they dated a year ago and she ghosted him - she doesn't remember. Their argument is interrupted by Michael and pregnant Brenda rushing to bathroom.",
        scriptContent: `The door opens. DAISY enters, spots Alex, approaches with flustered energy.

DAISY
Alex? Hey, sorry I'm late.

ALEX
No problem. You cool with this place?

DAISY
You kidding, I could live in a place like this.

Two margaritas are waiting.

ALEX
I got us margaritas. With mezcal.

DAISY
My favorite. God, I needed this today. Just so you know I've had some really bad dates lately so the bar is low.

ALEX
Perfect. I'll stop trying.

They LAUGH, cheers. TIM DEBETHEM (40s, picture Tim Robinson in work overalls) approaches Will.

TIM
Yo, chief, here to fix the poopcan. When you break the toilet it becomes my show. Throw me a cold one, won't charge extra.

The door BANGS open. MICHAEL supports a hunched BRENDA, pregnant.

MICHAEL
My pregnant wife needs to use the bathroom!

They rush past Daisy and Alex into the OUT OF ORDER BATHROOM.

ANGLE ON Daisy and Alex:

ALEX
...So, more a tech company than a restaurant. Think DoorDash if it made its own food.

DAISY
What about you?

DAISY
Oh online stuff mostly. AirBnB'ing, social media consulting--

ALEX
If there's an online gig, you're doing it.

DAISY
Hey, that's what I always say!

ALEX
I know. You said it to me.

A beat. Daisy is confused.

ALEX
Daisy, do you really not remember me? My face, this conversation? Almost exactly a year ago. We matched, met for drinks, hit it off, kissed, you clearly seemed to like me -- then nothing. No explanation, radio silence.

DAISY
OK, this is psychotic.

ALEX
Um, I'm not the bad guy here--

DAISY
Nobody owes anybody anything--

ALEX
Wrong! This behavior is not OK--`,
        beats: [
          { id: "1.3-b1", description: "Daisy and Alex meet - she doesn't remember their previous date", completed: true },
          { id: "1.3-b2", description: "Alex reveals she ghosted him a year ago", completed: true },
          { id: "1.3-b3", description: "Tim the plumber introduced", completed: true },
          { id: "1.3-b4", description: "Michael and pregnant Brenda arrive urgently", completed: true },
          { id: "1.3-b5", description: "Daisy/Alex argument escalates", completed: true }
        ],
        notes: [
          { id: "n1.3-1", author: "PG", type: NoteType.CHARACTER, content: "Is there one more level of connection between Daisy and Alex? Did their parents set them up? Need to believe their pairing more." },
          { id: "n1.3-2", author: "AMZN", type: NoteType.CHARACTER, content: "Alex feels like he belongs at center of movie - his truth-vision makes him only one able to see through Idea Man's ruse. Look for opportunities to bind him to theme." },
          { id: "n1.3-3", author: "PG", type: NoteType.CHARACTER, content: "Tim should feel more dangerous - missing darker human element in group. Would make his sacrifice more meaningful." }
        ],
        tracking: [
          { category: "Character Arc", description: "Daisy's ghosting pattern - avoidance" },
          { category: "Character Arc", description: "Alex's righteousness - he thinks he's right" },
          { category: "Comedy", description: "Tim's toilet humor introduction" },
          { category: "Setup", description: "All main characters now in bar" }
        ],
        connections: [
          { targetSceneId: "4.3", type: "echo", description: "Daisy/Alex dynamic evolves on road trip" },
          { targetSceneId: "6.2", type: "callback", description: "Alex's truth-wish protects him from Floyd" }
        ]
      },
      {
        id: "1.4",
        sequenceId: "SEQ_1",
        title: "1.4: G-Day - Genies Arrive",
        pageNumber: 8,
        location: "INT. LAMPWICK BAR / GLOBAL",
        timeOfDay: "DAY",
        summary: "As Robbie blows out birthday candles, 8 billion genies appear worldwide. Will immediately wishes to protect the bar. Chaos erupts.",
        scriptContent: `The bar falls silent. Will pulls out a BIRTHDAY CAKE with lit candles.

WILL
Happy birthday to you...

Everyone awkwardly joins in. Robbie smiles at the cake...

ON THE TV: A NEWS ANCHOR reports with excitement.

NEWS ANCHOR
...and with this birth in Mumbai, humanity officially reaches eight billion people...

Will's eyes flick to the TV, then back to Robbie with sudden intensity.

WILL
Make a wish, kid. Make it count...

Robbie closes his eyes, considering.

ROBBIE
(whispers)
I wish...

WILL (V.O.)
That's when it happened.

The BUILDING SHUDDERS. Glasses rattle. Outside, the wind HOWLS. The sky darkens in seconds.

QUICK CUTS AROUND THE GLOBE:
- TOKYO: Pedestrians freeze as lights shoot toward each of them.
- SYDNEY: Tourists point skyward as lights dive.
- MUMBAI: A NEWBORN BABY, the eight billionth human, opens its eyes as a tiny light hovers above its face.

VOICES (O.S.)
Hello, I am yours / Hola, soy tuyo / 你好，我是你的

GLOWING HUMANOID FORMS materialize before each person.

DAISY
THE HELL IS THAT?!

Chaos erupts. Alex SCREAMS, lunging at his genie. Michael throws himself in front of Brenda.

WILL
SHUT THE HECK UP!

Even the cheerful genies turn to Will.

WILL
They're trying to communicate.

WILL'S GENIE
(think Morgan Freeman)
Thank you, sir. Every human on Earth now has their own genie. I am yours.

DAISY'S GENIE
(think Jennifer Coolidge)
And you each get one wish! Not three. That's a Disney movie.

Will's eyes flick to the TV, then back. He SLAPS the bar decisively.

WILL
I wish that no wish made outside this bar can affect this bar or anyone or anything inside it.

WILL'S GENIE
Done! Enjoy the show.

Will's genie EVAPORATES. OUTSIDE: The sky EXPLODES with color. SCREAMS and CRASHES echo. A GIANT SHADOW moves past the window.`,
        beats: [
          { id: "1.4-b1", description: "8 billion population reached triggers G-Day", completed: true },
          { id: "1.4-b2", description: "Genies appear worldwide simultaneously", completed: true },
          { id: "1.4-b3", description: "Initial panic in the bar", completed: true },
          { id: "1.4-b4", description: "Will IMMEDIATELY wishes to protect the bar", completed: true },
          { id: "1.4-b5", description: "Chaos erupts outside", completed: true }
        ],
        notes: [
          { id: "n1.4-1", author: "AMZN", type: NoteType.LOGIC, content: "Love showing dangers/limitations of wishes in fun way." },
          { id: "n1.4-2", author: "PG", type: NoteType.LOGIC, content: "Do we need to explain how Will got his own genie if he's also a genie? His genie says 'Every HUMAN on earth now has their own genie.'" },
          { id: "n1.4-3", author: "RR", type: NoteType.THEME, content: "Will's preparedness is key mystery - pays off with genie reveal" }
        ],
        tracking: [
          { category: "Global Stakes", description: "G-Day: 8 billion genies appear" },
          { category: "Genie Rules", description: "One wish per person, not three" },
          { category: "Setup", description: "Bar is now protected/indestructible" },
          { category: "Setup", description: "Will's mysterious preparedness" }
        ],
        connections: [
          { targetSceneId: "8.4", type: "payoff", description: "Will revealed as genie explains his preparedness" },
          { targetSceneId: "8.2", type: "callback", description: "Bar's protection becomes crucial in finale" }
        ]
      },
      {
        id: "1.5",
        sequenceId: "SEQ_1",
        title: "1.5: First Wishes - Chaos",
        pageNumber: 12,
        location: "INT. LAMPWICK BAR / GLOBAL",
        timeOfDay: "DAY",
        summary: "Quick pops showing disastrous wishes worldwide. In the bar, Ed wishes June back; Michael takes Brenda's pregnancy; Tim accidentally becomes a french fry.",
        scriptContent: `WILL (V.O.)
Turns out, when eight billion people get a wish, most don't take the time to think it through.

QUICK POPS AROUND THE WORLD:
1) A WOMAN laughs as CASH fills her living room. Her dog struggles to stay above the rising bills.

WILL (V.O.)
Who needs a billion dollars when money just became meaningless...

2) An ELDERLY WOMAN in Norway stands from her wheelchair.

ELDERLY WOMAN
Kasper, I can walk!

She turns to see her husband now a MUSCULAR 25-YEAR-OLD MAN.

ELDERLY MAN
I want a divorce.

3) DOZENS OF LIONEL MESSIS play soccer in a Spanish plaza, fighting over a single ball.

WILL (V.O.)
No point of being exceptional, when everyone else is too.

BACK IN THE BAR - Ed exits the bathroom. A BLAST OF LIGHT erupts. Through magical mist, a WOMAN (JUNE WILLIAMS, 50s) emerges.

TIM
So he, uh, became a she?

ROBBIE
(stunned)
Mom?

June turns. Recognition floods her face. Robbie RACES into her arms, SOBBING.

ROBBIE
Mommy...Mom -- I missed you so much.

NEARBY: Brenda GASPS, doubling over in pain.

MICHAEL
Bunbun! What's wrong?

BRENDA
I knew it was a bad idea to bring a child into this insane world--

MICHAEL
(barely audible)
I wish I could carry this burden for her.

His genie VANISHES. Michael slumps forward as his stomach EXPANDS. THE PREGNANCY HAS TRANSFERRED.

BRENDA
You... did you just take the baby?

She puts her hands on his shoulders. He is GRIMACING.

BRENDA
I love you so much.

TIM
Aw man, I wish I was that french fry--

Tim winks and does his DOUBLE CLICK--

TIM'S GENIE
We are cleared for take-off, fryboy.

POOF! TIM IS NOW A HUMAN-SIZED FRENCH FRY.

TIM
I'M A GODDAMN FRENCH FRY?!`,
        beats: [
          { id: "1.5-b1", description: "Global montage of disastrous wishes", completed: true },
          { id: "1.5-b2", description: "Ed wishes June (Robbie's mom) back to life", completed: true },
          { id: "1.5-b3", description: "Michael wishes to carry Brenda's pregnancy", completed: true },
          { id: "1.5-b4", description: "Tim accidentally wishes to become a french fry", completed: true }
        ],
        notes: [
          { id: "n1.5-1", author: "PG", type: NoteType.CHARACTER, content: "Not sure I get emotional impact from MOM showing up - need to look at setup for that." },
          { id: "n1.5-2", author: "AMZN", type: NoteType.CHARACTER, content: "Brenda tells us later she didn't want a child - but in this moment it doesn't feel like Michael is doing her a favor. Feels like he's robbing her of something." },
          { id: "n1.5-3", author: "PG", type: NoteType.CHARACTER, content: "Understand choice to make Brenda not bothered because she didn't want kids, but feels too easy. Layer in more hesitation and mixed feelings." },
          { id: "n1.5-4", author: "PG", type: NoteType.DIALOGUE, content: "Stop short of Tim saying 'decide who is going to wish me back' - makes it more tense." }
        ],
        tracking: [
          { category: "Genie Rules", description: "Remnants - wished-back people tied to wisher" },
          { category: "Character Arc", description: "Michael's selflessness/control issues" },
          { category: "Character Arc", description: "Brenda's ambivalence about motherhood" },
          { category: "Comedy", description: "Tim's french fry transformation" }
        ],
        connections: [
          { targetSceneId: "7.2", type: "foreshadow", description: "June as remnant - vanishes when Ed dies" },
          { targetSceneId: "4.2", type: "callback", description: "Brenda/Tim attraction (fries were her craving)" }
        ]
      }
    ]
  },

  // ============================================================================
  // SEQUENCE 2: THE BAR (8 Weeks Trapped)
  // ============================================================================
  {
    id: "SEQ_2",
    title: "SEQUENCE 2: THE BAR",
    dramaticQuestion: "How long can they stay trapped? What forces them to leave?",
    climax: "Robbie transforms into anime hero and announces he's leaving",
    resolution: "Expedition team formed to reach Hope's Hollow",
    scenes: [
      {
        id: "2.1",
        sequenceId: "SEQ_2",
        title: "2.1: Trapped - Chaos Outside",
        pageNumber: 16,
        location: "INT. LAMPWICK BAR",
        timeOfDay: "DAY",
        summary: "Michael opens door to see pure chaos outside. They realize they're trapped. Will reveals he's prepared with supplies.",
        scriptContent: `Michael sees Brenda clutch her stomach from stress--

WILL
I wouldn't--

Michael YANKS the door open. Outside is PURE CHAOS.

A MONSTER TRUCK jumps over a newly-formed CASTLE. A MAN FLIES past riding a DRAGON. A HONDA CIVIC shoots into orbit. TWO POLICEMEN GROW TO FIFTY FEET TALL AND BEGIN PLAYING PATTY-CAKE ACROSS THE SKYLINE.

Michael SLAMS the door shut, face pale.

MICHAEL
Don't... don't go out there.

A heavy silence falls. The LOCK CLICKS with finality.

WILL
Better get comfortable. We might be here awhile.

WILL
I think we'll have to settle in for a bit.

QUICK CUTS AROUND THE BASEMENT AS WE SEE--

WILL (V.O.)
Canned foods, water, candles, first aid kits, gas masks, soap, TP, books, board games, blood bank, some gold for bartering, couple crossbows, knives and swords -- god willing we don't need em.

DAISY
(alarmed)
Wait, exactly how long do you think we'll be stuck here?`,
        beats: [
          { id: "2.1-b1", description: "Michael opens door - sees chaos, immediately closes it", completed: true },
          { id: "2.1-b2", description: "Group realizes they're trapped", completed: true },
          { id: "2.1-b3", description: "Will reveals extensive survival supplies", completed: true }
        ],
        notes: [
          { id: "n2.1-1", author: "AMZN", type: NoteType.LOGIC, content: "Let's make sure we really understand why this group is reluctant to go outside. Just how dangerous is it? Maybe one of the group is almost killed the moment they venture over the threshold." },
          { id: "n2.1-2", author: "PG", type: NoteType.LOGIC, content: "Is 8 weeks too long to realistically think they haven't gone outside? Do we need something keeping them inside that is more personal than danger? Do we want a character to die up top to solidify staying?" },
          { id: "n2.1-3", author: "AMZN", type: NoteType.REWRITE, content: "Can they look out windows more? Showing how dangerous it is would help explain why they take so long to leave." }
        ],
        tracking: [
          { category: "Global Stakes", description: "World outside is pure chaos" },
          { category: "Setup", description: "Will's mysterious preparedness deepens" }
        ],
        connections: [
          { targetSceneId: "2.4", type: "causal", description: "Danger outside keeps them trapped" }
        ]
      },
      {
        id: "2.2",
        sequenceId: "SEQ_2",
        title: "2.2: Genie Rules Explained",
        pageNumber: 18,
        location: "INT. LAMPWICK BAR",
        timeOfDay: "DAY",
        summary: "Genies explain the rules: one wish, contradictory wishes cancel out, no world-affecting wishes unless funny. They show the President's failed wish.",
        scriptContent: `ROBBIE
So whatever we want... comes true?

ROBBIE'S GENIE
Within reason.

WILL
Everyone, listen. Don't use your wish yet. Really think on it first.

DAISY
Says the guy who used his right away.

TIM
People say "I wish" all the time. Would that have counted?

TIM'S GENIE
No, we understand your intentions.

BRENDA
But what happens if wishes contradict each other? What if I wish for rain and someone else wishes for sun?

BRENDA'S GENIE
Excellent question! Contradictory wishes cancel each other out. Here's a real world example happening right now!

A genie CLICKS A REMOTE CREATING A MAGICAL SCREEN:

INT. OVAL OFFICE - SAME TIME

GENERAL'S GENIE
Wish granted! America is forever the foremost power on the planet.

PRESIDENT'S AID
Sir, Iran on line one.

The President picks up the phone.

PRESIDENT
Guess what, Iran? I want you to kiss my big fat--

FOREIGN LEADER
Nope! You need to send us spaceships and nukes! We're the foremost power!

THE MONITOR POOFS AWAY.

BRENDA'S GENIE
Every country made the same wish, so those wishes cancelled out.

DAISY'S GENIE
We're not big on stuff that affects the whole world. Unless it's funny.`,
        beats: [
          { id: "2.2-b1", description: "Genies explain one wish rule", completed: true },
          { id: "2.2-b2", description: "Contradictory wishes cancel out", completed: true },
          { id: "2.2-b3", description: "Global wishes limited (unless funny)", completed: true },
          { id: "2.2-b4", description: "Will warns them to think before wishing", completed: true }
        ],
        notes: [
          { id: "n2.2-1", author: "AMZN", type: NoteType.LOGIC, content: "Get more specific about genie rules. Do we need to understand that effective wishes require 'legalese' to close loopholes (why Exactitude is so good)?" },
          { id: "n2.2-2", author: "PG", type: NoteType.LOGIC, content: "Rules for what Genies can tell you? Can we know how many wishes are left?" },
          { id: "n2.2-3", author: "AMZN", type: NoteType.LOGIC, content: "Genies in comics operate as hive mind - can ask any question and get truthful answer. Could help track how world is changing in real time." }
        ],
        tracking: [
          { category: "Genie Rules", description: "One wish per person" },
          { category: "Genie Rules", description: "Contradictory wishes cancel" },
          { category: "Genie Rules", description: "Global wishes limited" },
          { category: "Comedy", description: "World leaders' wishes cancel out" }
        ],
        connections: [
          { targetSceneId: "5.5", type: "callback", description: "Exactitude's legal wish expertise" },
          { targetSceneId: "8.1", type: "callback", description: "War genies cancel each other" }
        ]
      },
      {
        id: "2.3",
        sequenceId: "SEQ_2",
        title: "2.3: 8 Weeks Later - Bar Life",
        pageNumber: 22,
        location: "INT. LAMPWICK BAR",
        timeOfDay: "DAY",
        summary: "TITLE: 8 WEEKS LATER. The bar has transformed into a refugee camp. Everyone is unkempt. Through the window: surreal dystopian Detroit.",
        scriptContent: `TITLE: 8 WEEKS LATER

INT. LAMPWICK BAR - DAY

The bar has transformed into a refugee camp. Cots separated by hanging sheets. Everyone looks unkempt.

THROUGH THE WINDOW: A SURREAL DYSTOPIAN DETROIT - new ruins built atop old ones. A WISHED-FOR STATUE OF LIBERTY arm protrudes from rubble while a DRAGON nests on its torch.

Random SUPERHEROES are visible in the sky.

Tim, still a french fry, does push-ups in a corner. Michael, now 7 months pregnant, sprawls miserably on a bed. Robbie sketches anime characters, trying to ignore June and Ed's CANOODLING sounds from behind a nearby sheet.

Ed's empty beers sit on the table near Robbie. He gets up to find another place to draw...

Daisy finds Robbie behind the bar.

DAISY
Just looking for a quiet place to read 'Threat Vector' again.

ROBBIE
Why you spend so much time alone?

DAISY
Guess I prefer a dive bar bathroom to sharing space with 7 people.

ROBBIE
Why are you hiding behind the bar?

ROBBIE
Kinda awkward to share space with your mom and her boyfriend.

DAISY
My dad left when I was young-- it's not the same but -- I kinda get it?

ROBBIE
That stinks. You could always wish him back?

DAISY
Ha, no. He wanted to leave so... His loss, right? Taught me to look after myself.

ROBBIE
Yeah.`,
        beats: [
          { id: "2.3-b1", description: "8 weeks time jump - bar is now refugee camp", completed: true },
          { id: "2.3-b2", description: "Outside: dystopian chaos, superheroes in sky", completed: true },
          { id: "2.3-b3", description: "Daisy/Robbie bond - both abandoned by fathers", completed: true },
          { id: "2.3-b4", description: "Ed still drinking despite health issues", completed: true }
        ],
        notes: [
          { id: "n2.3-1", author: "PG", type: NoteType.LOGIC, content: "Ed and June canoodling is funny, but then we reveal he has bad cough and is desperately sick. How bad is he really?" },
          { id: "n2.3-2", author: "AMZN", type: NoteType.LOGIC, content: "How sick is Ed? If it was life threatening, wouldn't Robbie just wish to cure him?" },
          { id: "n2.3-3", author: "PG", type: NoteType.CHARACTER, content: "I missed that Daisy and Alex were co-parenting Robbie until later. Make clearer they're both taking protective role seriously and connecting because of it." }
        ],
        tracking: [
          { category: "Global Stakes", description: "World in chaos - superheroes everywhere" },
          { category: "Character Arc", description: "Daisy/Robbie bond forming" },
          { category: "Character Arc", description: "Ed's health declining" },
          { category: "Found Family", description: "Daisy connecting with Robbie" }
        ],
        connections: [
          { targetSceneId: "4.3", type: "echo", description: "Daisy/Robbie bond deepens on road" },
          { targetSceneId: "8.3", type: "payoff", description: "Daisy's final wish is for Robbie" }
        ]
      },
      {
        id: "2.4",
        sequenceId: "SEQ_2",
        title: "2.4: Hope's Hollow Commercial",
        pageNumber: 25,
        location: "INT. LAMPWICK BAR",
        timeOfDay: "DAY",
        summary: "They watch news of nuclear-like 'scourings' destroying cities. Then a commercial for Hope's Hollow plays - a protected haven. They realize there might be safety out there.",
        scriptContent: `ON TV: LOCAL NEWSCAST

A FEMALE REPORTER stands before smoldering ruins of a city.

REPORTER
...These nuclear-like explosions have been occurring around the globe. They seem to violate the Genie Accord not to grant wishes that impact vast numbers of people--

A MASSIVE ORANGE BLAST detonates behind them. BARBARA IS VAPORIZED. The feed cuts to COLOR BARS.

DAISY
Even if we can leave one day, there's gonna be nowhere left to go...

A COMMERCIAL POPS ON THE TV:

COMMERCIAL ANNOUNCER (V.O.)
Hey there! Are you stuck inside a bomb shelter? Welcome to Hope's Hollow! A wish-protected haven with everything you miss from the old world!

QUICK CUTS of smiling people enjoying normal life - restaurants, parks, schools, waterslides, hospitals.

COMMERCIAL ANNOUNCER (V.O.)
All created by our visionary founder, the mystical, magical "Idea Man!" This month only, two unspent genies gets 5 people immediate entry!

TIM
The leader's magical! He could un-fry me!

ROBBIE
Mom, we can't stay here.

JUNE
What are you talking about?

ROBBIE
(quietly but firmly)
He's a mess.

Ed looks ashamed.

ROBBIE
His liver's done. He takes heart pills, blood thinners. If he goes you go and I can't lose you again.`,
        beats: [
          { id: "2.4-b1", description: "News shows 'scourings' - nuclear-like explosions", completed: true },
          { id: "2.4-b2", description: "Hope's Hollow commercial plays", completed: true },
          { id: "2.4-b3", description: "Idea Man introduced (Floyd in disguise)", completed: true },
          { id: "2.4-b4", description: "Robbie reveals Ed is dying - motivates leaving", completed: true }
        ],
        notes: [
          { id: "n2.4-1", author: "AMZN", type: NoteType.REWRITE, content: "The Scouring should be established as global threat by time we reach Hope's Hollow. Know where it started, where it's going, where it is relative to Lampwick and Habitats." },
          { id: "n2.4-2", author: "AMZN", type: NoteType.REWRITE, content: "Maybe see commercials for OTHER habitats to understand what resonates about Hope's Hollow sales pitch." },
          { id: "n2.4-3", author: "AMZN", type: NoteType.LOGIC, content: "Primary reason for leaving is Ed's health - is there something more immediate for whole group? Dwindling supplies? Scouring headed their way?" },
          { id: "n2.4-4", author: "PG", type: NoteType.LOGIC, content: "Deal doesn't make sense - 1 genie gets 3 friends in and 2 gets 5? Clarify." }
        ],
        tracking: [
          { category: "Scouring", description: "Nuclear-like explosions introduced" },
          { category: "Global Stakes", description: "World being destroyed" },
          { category: "Villain Plot", description: "Idea Man/Hope's Hollow introduced" },
          { category: "Character Arc", description: "Robbie's protector instinct - wants to save Ed to save June" }
        ],
        connections: [
          { targetSceneId: "5.1", type: "payoff", description: "They reach Hope's Hollow" },
          { targetSceneId: "6.3", type: "callback", description: "Floyd revealed as behind scourings" }
        ]
      },
      {
        id: "2.5",
        sequenceId: "SEQ_2",
        title: "2.5: Robbie's Transformation",
        pageNumber: 28,
        location: "INT. LAMPWICK BAR",
        timeOfDay: "NIGHT",
        summary: "Robbie wishes to become a Naruto-like anime hero. He transforms, accidentally shoots a fireball. The expedition team is formed.",
        scriptContent: `ROBBIE
Hey, Genie.

His genie appears. Robbie opens his Art of Naruto book to a specific page.

ROBBIE
Make me into this.

Robbie's genie snaps its fingers and VANISHES. Everyone watches, stunned, as Robbie RISES, surrounded by swirling energy. His hair grows and turns blue, muscles expand, features sharpen. He's dressed in a HIGH-COLLARED JACKET with silver trim. His eyes shift to amber.

Before Robbie can respond, a small FIREBALL forms in his palm--

ROBBIE
(panicked)
Wait--no, no, no--

He flings it away. The fireball RICOCHETS around the bar, everyone SHRIEKS. It EXPLODES against the liquor shelves. FLAMES ERUPT.

Will calmly grabs a fire extinguisher.

JUNE
(horrified)
Why would you do this?

ROBBIE
Hope's Hollow is real. I can feel it. I'll come back with help.

ALEX
He won't have to go alone. I'll go with him.

BRENDA
Me too. Michael, you need a doctor. Real prenatal care.

DAISY
(to no one in particular)
I mean, I don't wanna stay here either.

JUNE
(to Daisy)
I need you to keep my son safe. Will you do that for me?

Daisy freezes, caught in June's gaze.

DAISY
Okay.`,
        beats: [
          { id: "2.5-b1", description: "Robbie wishes to become anime hero", completed: true },
          { id: "2.5-b2", description: "Transformation is dramatic but he can't control powers", completed: true },
          { id: "2.5-b3", description: "Accidental fireball - shows danger of his new abilities", completed: true },
          { id: "2.5-b4", description: "Alex volunteers to go with him", completed: true },
          { id: "2.5-b5", description: "Brenda volunteers (Michael needs doctor)", completed: true },
          { id: "2.5-b6", description: "June asks Daisy to protect Robbie", completed: true }
        ],
        notes: [
          { id: "n2.5-1", author: "PG", type: NoteType.REWRITE, content: "Does Robbie's wish feel too quiet? Being in bed, at night, he quietly wishes. Does that feel enough like a movie moment?" },
          { id: "n2.5-2", author: "PG", type: NoteType.CHARACTER, content: "Why is Robbie special/powerful? What makes his powers more special? Why does Idea Man put so much belief in him?" },
          { id: "n2.5-3", author: "AMZN", type: NoteType.CHARACTER, content: "Would it be better if Robbie hits Daisy's flaw (e.g. 'I know it's a big decision--') and that's what makes her go?" },
          { id: "n2.5-4", author: "AMZN", type: NoteType.REWRITE, content: "Should identify Brenda as a Trekkie from the start so Enterprise wish doesn't come from nowhere." }
        ],
        tracking: [
          { category: "Character Arc", description: "Robbie uses wish to become protector" },
          { category: "Setup", description: "Robbie's powers - can't fully control them" },
          { category: "Found Family", description: "Expedition team forming" },
          { category: "Character Arc", description: "Daisy accepting responsibility for Robbie" }
        ],
        connections: [
          { targetSceneId: "3.3", type: "callback", description: "Robbie's powers in Ohio battle" },
          { targetSceneId: "6.2", type: "callback", description: "Floyd wants Robbie for his powers" }
        ]
      },
      {
        id: "2.6",
        sequenceId: "SEQ_2",
        title: "2.6: The Enterprise",
        pageNumber: 30,
        location: "EXT. LAMPWICK BAR",
        timeOfDay: "DAY",
        summary: "Brenda wishes for the USS Enterprise. The expedition team boards: Robbie, Daisy, Alex, Brenda, Tim. Goodbyes are said.",
        scriptContent: `BRENDA
We still need transportation. Texas is a thousand miles away. But with our extra wish now...

Her genie appears, sensing opportunity.

BRENDA
Do you know what I'm thinking?

BRENDA'S GENIE
(grinning)
Better than a magic carpet!

MICHAEL
Bunny, wait—

But Brenda's Genie is already dissolving in sparkling light.

The floor RUMBLES. Through the window, the USS ENTERPRISE FROM STAR TREK materializes, impossibly real.

TIM
Holy crap. Is that the Enterprise?

BRENDA
And I know how to fly it. I've seen every episode ten times.

TIME CUT:

The five expedition members gather belongings. Robbie, June, Ed, Michael, Brenda, say their goodbyes.

JUNE
(to Alex/Daisy re: Robbie)
Until you get back, this is your child, you understand?

They nod. June watches as her son gives Will a hug...

JUNE
He's always been the one trying to take care of others-- came into the world wired that way. But he's still a kid. Needs someone to look after him for a change.

EXT. LAMPWICK BAR - DAY

Our heroes emerge into the daylight. The Enterprise looms before them, impossible and magnificent.

They boldly climb the ramp, SYNTH MUSIC swelling.`,
        beats: [
          { id: "2.6-b1", description: "Brenda wishes for USS Enterprise", completed: true },
          { id: "2.6-b2", description: "Expedition team: Robbie, Daisy, Alex, Brenda, Tim", completed: true },
          { id: "2.6-b3", description: "June tells Daisy/Alex: 'This is your child now'", completed: true },
          { id: "2.6-b4", description: "Emotional goodbyes", completed: true }
        ],
        notes: [
          { id: "n2.6-1", author: "AMZN", type: NoteType.REWRITE, content: "Maybe the remaining two Genies act as Brenda's crew here and wear iconic Star Trek uniforms?" },
          { id: "n2.6-2", author: "RR", type: NoteType.THEME, content: "June's line about Robbie being a natural caretaker is key to his character" }
        ],
        tracking: [
          { category: "Setup", description: "Enterprise - wish-protected transportation" },
          { category: "Found Family", description: "June entrusts Robbie to Daisy/Alex" },
          { category: "Character Arc", description: "Daisy accepting parental responsibility" }
        ],
        connections: [
          { targetSceneId: "3.1", type: "causal", description: "Enterprise journey begins" }
        ]
      }
    ]
  },

  // ============================================================================
  // SEQUENCE 3: THE JOURNEY (Enterprise to Ohio)
  // ============================================================================
  {
    id: "SEQ_3",
    title: "SEQUENCE 3: THE JOURNEY",
    dramaticQuestion: "Can they survive the chaos outside?",
    climax: "Robbie kills a Kaiju but loses his innocence",
    resolution: "Enterprise destroyed, find Hellstorm bus",
    scenes: [
      {
        id: "3.1",
        sequenceId: "SEQ_3",
        title: "3.1: Enterprise Launch & Crash",
        pageNumber: 33,
        location: "INT. USS ENTERPRISE",
        timeOfDay: "DAY",
        summary: "They launch excitedly but within minutes a wizard in a spaceship attacks. The Enterprise is destroyed and crashes in Ohio.",
        scriptContent: `INT. USS ENTERPRISE - BRIDGE - DAY

The doors WHOOSH open. Sleek. Iconic. Sort of.

BRENDA
It looks just like the show!

ALEX
Lighting's kinda flat too.

Brenda hops in the Captain's chair. Hits a button. The ship HUMS. Outside, the ground falls away.

BRENDA
You guys ready... to boldly go where no man has gone before?

The ship BLASTS FORWARD, ROCKETING EVERYONE BACK. IT'S INSANELY FUN.

DAISY
This is actually pretty cool!

--A PROXIMITY ALARM WAILS--

ANOTHER SPACESHIP barrels toward them, piloted by a CACKLING OLD MAN with a wizard hat. It's FIRING LASERS!

ALEX
That guy's trying to kill us!

DAISY
What did I tell you?! Three goddamn seconds!

GREEN LASERS streak past-- A LASER BLAST hits the hull! The bridge SHUDDERS violently, panels SPARKING.

TIM
We're gonna die like redshirts!

The ship SPIRALS DOWNWARD. The saucer section SEPARATES and SPINS toward earth, passing the wreckage of other wish disasters.`,
        beats: [
          { id: "3.1-b1", description: "Enterprise launches - exciting moment", completed: true },
          { id: "3.1-b2", description: "Within minutes, attacked by wizard in spaceship", completed: true },
          { id: "3.1-b3", description: "Ship destroyed, crashes in Ohio", completed: true }
        ],
        notes: [
          { id: "n3.1-1", author: "AMZN", type: NoteType.LOGIC, content: "What does Tim need the salt for? Shore up Tim's 'fry rules' more. Does he have a shelf life? Do parts rejuvenate?" },
          { id: "n3.1-2", author: "RR", type: NoteType.ACTION, content: "The crash should be spectacular but not too long - get them to Ohio quickly" }
        ],
        tracking: [
          { category: "Action", description: "Enterprise attack and crash" },
          { category: "Global Stakes", description: "World is dangerous - random attacks" }
        ],
        connections: [
          { targetSceneId: "3.2", type: "causal", description: "Crash leads to Ohio battle" }
        ]
      },
      {
        id: "3.2",
        sequenceId: "SEQ_3",
        title: "3.2: Bexley Ohio - Superheroes",
        pageNumber: 36,
        location: "EXT. BEXLEY, OHIO",
        timeOfDay: "DAY",
        summary: "They stumble from crashed ship into a superhero battle. Beetlebug (11-year-old hero) recruits Robbie to help fight the Sinister Six Thousand.",
        scriptContent: `EXT. BEXLEY, OHIO - DAY

HANDHELD, SAVING PRIVATE RYAN MEETS POINT GREY VIBES

They stumble out of the RUINED SAUCER onto scorched asphalt. THE SHIP IS TOTALED.

The landscape is PURE CHAOS: collapsed buildings next to pristine wish mansions, STRANGE ENERGY bursts on the horizon.

SOMETHING SLAMS into the ground nearby! A FEMALE COSTUMED SUPERHERO rises.

BEETLEBUG
Welcome to Bexley, Ohio. Beetlebug. Official leader of the Megapal Justice Buddies, defenders of the Midwest.
(to Robbie)
I got one question. Good guy or bad guy?

ROBBIE
Good guy.

BEETLEBUG
Thought so. Kind eyes.

DAISY
We need to keep moving.

BEETLEBUG
You might want to get somewhere safe, like, now.

ON THE HORIZON: A NIGHTMARISH ARMY approaches - SUPERVILLAINS, led by a massive KAIJU DONKEY and BLACK MASK in armor.

BEETLEBUG
The Black Mask and his Sinister Six Thousand. We could use your firepower.

ROBBIE
I... don't know how to fight yet.

BEETLEBUG
Neither did I, until someone tried to kill me.

DAISY/ALEX
Absolutely not / Uhhh, no way--

ROBBIE
Are you serious? What's the point of being--

Robbie ACCIDENTALLY FIRES A FIREBALL into the air--`,
        beats: [
          { id: "3.2-b1", description: "Crash land in Ohio battlefield", completed: true },
          { id: "3.2-b2", description: "Meet Beetlebug (11-year-old superhero)", completed: true },
          { id: "3.2-b3", description: "Sinister Six Thousand approaching", completed: true },
          { id: "3.2-b4", description: "Beetlebug wants Robbie to fight", completed: true }
        ],
        notes: [
          { id: "n3.2-1", author: "AMZN", type: NoteType.REWRITE, content: "Need to understand what happened to other superheroes and how Robbie avoided similar fate. After glut of superheroes, they are now a rarity - hence Robbie's value." }
        ],
        tracking: [
          { category: "Global Stakes", description: "Superheroes are now rare" },
          { category: "Character Arc", description: "Robbie's first real test" },
          { category: "Action", description: "Major battle sequence" }
        ],
        connections: [
          { targetSceneId: "6.2", type: "foreshadow", description: "Robbie's rarity makes him valuable to Floyd" }
        ]
      },
      {
        id: "3.3",
        sequenceId: "SEQ_3",
        title: "3.3: The Battle - Robbie's First Kills",
        pageNumber: 40,
        location: "EXT. BEXLEY, OHIO - BATTLEFIELD",
        timeOfDay: "DAY",
        summary: "Beetlebug drags Robbie into battle. He accidentally kills villains. Beetlebug dies fighting Kaiju. Robbie, traumatized, destroys the Kaiju.",
        scriptContent: `EXT. BEXLEY OHIO - BATTLEFIELD - DAY

Beetlebug GRABS Robbie's arm and pulls him SKYWARD--

BEETLEBUG
If you have any energy projection, aim for the eyes!

She's already diving toward the MELEE BELOW, casually DROPPING ROBBIE OFF IN THE MIDDLE OF IT.

The battlefield is CHAOS - more brutal than a comic book. One of the Jeffs is CURBSTOMPED by a villain.

With a TERRIFIED SCREAM, UNCONTROLLED PURPLE ENERGY suddenly ERUPTS from Robbie's hands -- accidentally shooting into the mouths of villains, EXPLODING THEIR HEADS.

Robbie stares at his own hands, horrified.

Beetlebug flies over, covered in gore--

BEETLEBUG
It's down to us now!

ROBBIE
(panicking)
Let's get outta here! I wasn't ready for this!

The Kaiju breathes fire at Beetlebug, setting her cape ABLAZE. The Kaiju SQUEEZES Beetlebug like a Gogurt, then drops her limp body.

Robbie stares at her broken body.

BEETLEBUG
(dying)
It's up to you now, Gokashi.

ROBBIE
I can't... I'm only thirteen.

BEETLEBUG
I'm eleven.

SHE DIES. Robbie stares, his innocence shattered. His eyes begin to GLOW RED WITH FURY.

Robbie - now GLOWING and SPLIT INTO TWO ROBBIES - rains DEVASTATING BLOWS on the Kaiju. It EXPLODES in a shower of RED LIGHT, BLOOD, AND GUTS.

ALEX
(wipes gunk from face)
June is going to kill us.`,
        beats: [
          { id: "3.3-b1", description: "Robbie accidentally kills villains - horrified", completed: true },
          { id: "3.3-b2", description: "Beetlebug dies fighting Kaiju", completed: true },
          { id: "3.3-b3", description: "Robbie's rage awakens full power", completed: true },
          { id: "3.3-b4", description: "Robbie destroys Kaiju - loses innocence", completed: true }
        ],
        notes: [
          { id: "n3.3-1", author: "AMZN", type: NoteType.REWRITE, content: "Very R-Rated fight. Need to tone down for PG-13." },
          { id: "n3.3-2", author: "PG", type: NoteType.CHARACTER, content: "Robbie's motivation/connection to Mom - can we feel that more through second act? Talk about her?" }
        ],
        tracking: [
          { category: "Character Arc", description: "Robbie's first kills - trauma" },
          { category: "Character Arc", description: "Robbie's innocence lost" },
          { category: "PG-13 Flag", description: "Violence needs toning down" }
        ],
        connections: [
          { targetSceneId: "6.3", type: "echo", description: "Floyd weaponizes Robbie's trauma" }
        ]
      },
      {
        id: "3.4",
        sequenceId: "SEQ_3",
        title: "3.4: Hellstorm Bus - Vampires",
        pageNumber: 44,
        location: "INT. HELLSTORM BUS",
        timeOfDay: "DAY",
        summary: "Tim and Brenda find a tour bus, but it's occupied by vampire metal band. They fight and kill the vampires. Brenda and Tim bond.",
        scriptContent: `INT. PARKING LOT - DAY

Tim spots a GLEAMING TOUR BUS with "HELLSTORM" emblazoned on the side.

INT. HELLSTORM BUS - SAME

Tim and Brenda enter a heavy metal paradise: leather couches, mini-bar, instruments.

TIM
This is like, my dream bus. I love metal.

A door in back flings open, revealing a 4-MEMBER METAL BAND.

TIM
Oh, hey. You guys Hellstorm?

The frontman HISSES, baring vampire teeth.

LEAD VAMPIRE
(British accent)
Look lads. Groupies.

Tim and Brenda FIGHT. She grabs DRUMSTICKS and DRIVES one through the vampire's heart.

BRENDA
These go to eleven.

INSANITY as they battle remaining vampires. Tim creates a makeshift FLAMETHROWER with hairspray and lighter.

TIM
(breathless)
You're an amazing person.

BRENDA
(equally breathless)
Hell yeah!

A moment of electric connection between them. Brenda grabs a guitar and PLAYS A BLISTERING RIFF.

BRENDA
Played since I was twelve.

TIM
We should start a band!

BRENDA
We should get the others.`,
        beats: [
          { id: "3.4-b1", description: "Find Hellstorm tour bus", completed: true },
          { id: "3.4-b2", description: "Vampires attack", completed: true },
          { id: "3.4-b3", description: "Brenda kills vampire with drumstick", completed: true },
          { id: "3.4-b4", description: "Tim/Brenda bond during fight", completed: true }
        ],
        notes: [
          { id: "n3.4-1", author: "PG", type: NoteType.REWRITE, content: "Band moment feels broad. Why are they able to stop down and play music?" },
          { id: "n3.4-2", author: "AMZN", type: NoteType.CHARACTER, content: "Is Brenda's attraction to Tim a vestige of pregnancy craving that made her order fries? Biological imperative to excuse her infidelity?" }
        ],
        tracking: [
          { category: "Comedy", description: "Vampire metal band fight" },
          { category: "Character Arc", description: "Brenda/Tim chemistry begins" },
          { category: "Setup", description: "Hellstorm bus - wish-protected transportation" }
        ],
        connections: [
          { targetSceneId: "4.2", type: "callback", description: "Brenda/Tim kiss on road" },
          { targetSceneId: "6.1", type: "callback", description: "Brenda confesses affair to Michael" }
        ]
      }
    ]
  },

  // ============================================================================
  // SEQUENCE 4: THE ROAD
  // ============================================================================
  {
    id: "SEQ_4",
    title: "SEQUENCE 4: THE ROAD",
    dramaticQuestion: "Can they reach Hope's Hollow? What are they becoming as a group?",
    climax: "Scouring nearly kills them - saved by wish-protected bus",
    resolution: "Arrive at Hope's Hollow entrance",
    scenes: [
      {
        id: "4.1",
        sequenceId: "SEQ_4",
        title: "4.1: Road Trip Montage",
        pageNumber: 48,
        location: "EXT. AMERICAN HEARTLAND",
        timeOfDay: "DAY",
        summary: "The bus drives through transformed America. They see the world as it is now - beautiful and terrifying. Found family forming.",
        scriptContent: `EXT. AMERICAN HEARTLAND - DAY

The bus drives down an eerily empty highway through a gorgeous, surreal landscape. INDUSTRIAL GOTH ROCK POUNDS.

INT. HELLSTORM BUS - DAY

Brenda drives. Tim rocks out nearby.

TIM
Third flying house today. People really hate property taxes.

Brenda switches the music to FLEETWOOD MAC.

BRENDA
This was my mom's favorite song. She called me once after Mike and I moved out and played it over the phone...said it'd keep me safe.

AT THE BACK OF THE BUS: Daisy, Alex, and Robbie play UNO.

ROBBIE
Draw four, Alex.

ALEX
Are you using super uno powers?

DAISY
So... that was pretty insane back there. You okay?

Robbie nods tightly.

ROBBIE
A lot just happened. Like my body knew what to do.

DAISY
I don't think there's a normal anymore, Robbie.

A SMALL BALL OF ENERGY appears in his palm - steadier than before. Daisy reaches out and SNUFFS IT with her hand.

DAISY
No powerballs in the house.

ROBBIE
(quieter)
Thanks for coming to get me. I was pretty scared.

DAISY
--oh yeah, no, we're lying our faces off when we see her.

They laugh together.`,
        beats: [
          { id: "4.1-b1", description: "Road trip through transformed America", completed: true },
          { id: "4.1-b2", description: "Brenda's Fleetwood Mac memory", completed: true },
          { id: "4.1-b3", description: "Daisy/Robbie bonding - 'no powerballs in the house'", completed: true },
          { id: "4.1-b4", description: "Found family dynamics solidifying", completed: true }
        ],
        notes: [
          { id: "n4.1-1", author: "PG", type: NoteType.REWRITE, content: "Yearning for them to talk about what they think the Hollow will be like. Get their various perspectives." },
          { id: "n4.1-2", author: "AMZN", type: NoteType.THEME, content: "Let's use whatever we can - news broadcasts, genie broadcasts, anecdotes - to build picture of what's happening in world." }
        ],
        tracking: [
          { category: "Found Family", description: "Group bonding on road" },
          { category: "Character Arc", description: "Daisy acting maternal toward Robbie" },
          { category: "Global Stakes", description: "World transformed" }
        ],
        connections: [
          { targetSceneId: "5.3", type: "echo", description: "Found family bond tested in Hope's Hollow" }
        ]
      },
      {
        id: "4.2",
        sequenceId: "SEQ_4",
        title: "4.2: Campfire - The Kiss",
        pageNumber: 52,
        location: "EXT. OZARK NATIONAL FOREST",
        timeOfDay: "NIGHT",
        summary: "Campfire night. Alex and Daisy discuss wishes and almost kiss. Tim and Brenda dance and DO kiss. Robbie explores bus surveillance.",
        scriptContent: `EXT. OZARK NATIONAL FOREST - NIGHT

They sit around a campfire, stars above. The rising moon now has a face, stares at their food greedily.

Alex places a whiskey bottle between himself and Daisy.

ALEX
Seemed like we earned it.

DAISY
Last time we had a drink it didn't go well.

ALEX
I'm willing to give it a third shot.

DAISY
You ever figured out your wish?

ALEX
Probably something selfish but I'll pretend it's noble. Like I'd wish I knew when people are telling the truth and when they're not.

DAISY'S GENIE
You know, statistically, you're at very high risk of wish-lock.

DAISY
Wish-lock?

DAISY'S GENIE
The longer you wait to wish, the harder it gets. People get stuck overthinking forever.

AT THE CAMPFIRE: Brenda and Tim dance to JAZZ from the bus.

BRENDA
You're like, the most fun person I've ever hung out with.

She pulls him up. They dance. Then-- SHE KISSES HIM.

TIM
Your husband's pregnant?

BRENDA
It's just dancing, Tim. Michael hates to dance.

INT. HELLSTORM BUS - SAME

Robbie uses the bus's ULTRASCOPE surveillance system. Sees a FAMILY at distant campfire waving. They give thumbs up - also heading to Hope's Hollow.

Then he turns the dial further... sees an ORANGE GLOW approaching.`,
        beats: [
          { id: "4.2-b1", description: "Daisy's Genie warns about 'wish-lock'", completed: true },
          { id: "4.2-b2", description: "Alex hints at truth-wish", completed: true },
          { id: "4.2-b3", description: "Brenda kisses Tim", completed: true },
          { id: "4.2-b4", description: "Robbie sees Scouring approaching through scope", completed: true }
        ],
        notes: [
          { id: "n4.2-1", author: "PG", type: NoteType.CHARACTER, content: "Should Brenda tell Michael she only kissed - wasn't sex? 'Hooked up' is loose term." },
          { id: "n4.2-2", author: "RR", type: NoteType.THEME, content: "Wish-lock is key to Daisy's character - can't commit to anything" }
        ],
        tracking: [
          { category: "Character Arc", description: "Daisy's wish-lock introduced" },
          { category: "Character Arc", description: "Brenda/Tim affair" },
          { category: "Scouring", description: "Orange glow approaching" }
        ],
        connections: [
          { targetSceneId: "4.3", type: "causal", description: "Scouring nearly kills them" },
          { targetSceneId: "6.1", type: "callback", description: "Brenda confesses to Michael" }
        ]
      },
      {
        id: "4.3",
        sequenceId: "SEQ_4",
        title: "4.3: The Scouring",
        pageNumber: 56,
        location: "EXT. OZARK NATIONAL FOREST",
        timeOfDay: "NIGHT",
        summary: "A nuclear-like Scouring races toward them. They barely make it into the wish-protected bus. The family they waved at is vaporized.",
        scriptContent: `EXT. OZARK NATIONAL FOREST - NIGHT

Alex and Daisy share a smile, about to kiss, as the sky grows ORANGE behind them.

The ground SHAKES.

Down in the valley, the FAMILY is racing for cover, the DAD waving his arms: RUN.

They race down the hill. Alex TRIPS.

ROBBIE
Back on the bus now!

The ORANGE FIERY WAVE races toward them--

--racing toward the CAMPING FAMILY--

--Our crew is too far from the bus--

ROBBIE
We have to jump!

EVERYTHING GOES WHITE. Robbie JUMPS, then Tim, then Brenda. Alex takes Daisy's hand--

DAISY
DROP!

They leap, land with a horrible THUMP, climb in--

THE MOONROOF shuts behind them.

Safe on the wish-protected bus.

The explosion passes like a WAVE OF ORANGE DEATH...

Robbie opens the moonroof, looks out. Around them - NOTHING BUT SCORCHED EARTH. The family's campsite is gone.

ROBBIE
They were going to Hope's Hollow too.

DAISY
Who would do that? What was it?`,
        beats: [
          { id: "4.3-b1", description: "Scouring approaches - nuclear-like destruction", completed: true },
          { id: "4.3-b2", description: "Race to bus, barely make it", completed: true },
          { id: "4.3-b3", description: "Wish-protected bus saves them", completed: true },
          { id: "4.3-b4", description: "Family heading to Hope's Hollow is killed", completed: true }
        ],
        notes: [
          { id: "n4.3-1", author: "AMZN", type: NoteType.LOGIC, content: "The 'wish protected bus' feels convenient and lowers stakes when we want them to escalate. Think about where Scouring is relative to Lampwick, group, and HH." },
          { id: "n4.3-2", author: "RR", type: NoteType.THEME, content: "The family's death should hit hard - these are real people being killed by Floyd's scourings" }
        ],
        tracking: [
          { category: "Scouring", description: "Scouring shown in full destructive power" },
          { category: "Global Stakes", description: "Innocent family killed" },
          { category: "Villain Plot", description: "Floyd behind this (revealed later)" }
        ],
        connections: [
          { targetSceneId: "6.3", type: "callback", description: "Floyd revealed as behind scourings" }
        ]
      },
      {
        id: "4.4",
        sequenceId: "SEQ_4",
        title: "4.4: Arrival at Hope's Hollow",
        pageNumber: 58,
        location: "EXT. HOPE'S HOLLOW - HOLDING ZONE",
        timeOfDay: "DAY",
        summary: "They arrive at Hope's Hollow. Chaos at entrance - people desperate to get in. Alex uses his wish for truth-vision to identify real security.",
        scriptContent: `INT. HELLSTORM BUS - DAY

BRENDA
Oh my God.

ON THE HORIZON: A colossal glass-domed structure refracts sunlight like a diamond.

EXT. HOPE'S HOLLOW - HOLDING ZONE - DAY

A cross between stadium concourse and disaster encampment. Hopefuls cluster around bulletin boards.

TATTOOED FACE
HE'S GOT A GENIE!

A MOB descends on them--

CRAZED MOB
Tell the genie to pretend it's mine! / Please, I have children!

A MAN IN RED VALET JACKET pushes through--

RED VALET MAN
You have genies? I work for Hope's Hollow. Follow me--

BLUE VALET MAN
--NO! Don't go with him! He's lying.

ALEX
Should I just do my wish now?

ROBBIE
We need two wishes to get in. If we use one we can't.

ALEX
Screw it. Genie, I wish I knew who was telling the truth.

ALEX'S GENIE
That's great, enjoy that.

From ALEX'S POV: A RED X APPEARS OVER THE MAN IN RED. GREEN CHECKMARK over BLUE-JACKETED MAN.

ALEX
Him. Let's go!`,
        beats: [
          { id: "4.4-b1", description: "Arrive at Hope's Hollow dome", completed: true },
          { id: "4.4-b2", description: "Mob at entrance desperate for genies", completed: true },
          { id: "4.4-b3", description: "Conflicting guides - who to trust?", completed: true },
          { id: "4.4-b4", description: "Alex wishes for truth-vision", completed: true }
        ],
        notes: [
          { id: "n4.4-1", author: "PG", type: NoteType.LOGIC, content: "Should there be consequence for only having one genie when deal says two?" },
          { id: "n4.4-2", author: "AMZN", type: NoteType.LOGIC, content: "Deal is 2 genies for 5 people but group only has 1. Could Floyd be alerted to Daisy's presence and make allowance?" }
        ],
        tracking: [
          { category: "Character Arc", description: "Alex's wish - truth-vision" },
          { category: "Setup", description: "Alex can now see through lies" },
          { category: "Villain Plot", description: "Floyd pulling strings from inside" }
        ],
        connections: [
          { targetSceneId: "5.2", type: "causal", description: "Alex's truth-vision helps him see through Floyd" }
        ]
      }
    ]
  },

  // ============================================================================
  // SEQUENCE 5: HOPE'S HOLLOW
  // ============================================================================
  {
    id: "SEQ_5",
    title: "SEQUENCE 5: HOPE'S HOLLOW",
    dramaticQuestion: "Is Hope's Hollow really safe? Who is the Idea Man?",
    climax: "Floyd revealed as Idea Man - Daisy's rejected ex",
    resolution: "Group settles in, gives up Daisy's genie",
    scenes: [
      {
        id: "5.1",
        sequenceId: "SEQ_5",
        title: "5.1: Welcome to Hope's Hollow",
        pageNumber: 62,
        location: "INT. HOPE'S HOLLOW - ENTRANCE",
        timeOfDay: "DAY",
        summary: "They enter Hope's Hollow. Scanner reads their wish statuses. Tim's shows ERROR. Admin lets them in anyway - suspiciously easy.",
        scriptContent: `INT. HOPE'S HOLLOW - ENTRANCE - DAY

Illuminated ARROWS lead down a cheerful greenery-filled hall lined with advertisements: "SAFETY WITHIN, PEACE WITHIN, PURPOSE WITHIN."

CHEERFUL GUARD
Welcome to Hope's Hollow -- where wishes serve the greater good! Stand on the platform, genie beside you!

They step through SCANNERS. A HOLOGRAPHIC DISPLAY appears:

ALEX CHEN: USED (TRUTH-VISION)
ROBBIE GREEN: USED (ANIME TRANSFORM)
BRENDA CHEN: USED (TREK SHIP)
TIM DEBETHEM: USED (**SYSTEM ERROR 42-FRENCH-F1**)

CHEERFUL GUARD
Five people. One genie.

Tim immediately drops to his knees--

TIM
I should have a genie but mine hosed me! I'm literally food! I'll do ANYTHING. Do you like massages?

A PLEASANT BING and a nearby door slides open.

CHEERFUL GUARD
Admin's letting you in for some reason. Guess it's your lucky day.

CONCIERGE HARPER appears, perfect smile.

CONCIERGE HARPER
Welcome to Hope's Hollow where wishes serve the greater good! Idea Man is eager to meet you!`,
        beats: [
          { id: "5.1-b1", description: "Enter Hope's Hollow - utopian appearance", completed: true },
          { id: "5.1-b2", description: "Scanner reads wish statuses", completed: true },
          { id: "5.1-b3", description: "Only one genie but let in anyway - suspicious", completed: true }
        ],
        notes: [
          { id: "n5.1-1", author: "AMZN", type: NoteType.REWRITE, content: "Beyond sending jet for friends, group loses narrative drive once they reach HH. Consider cutting right to June/Ed/Michael arrival, amplifying Scouring threat, activating Alex's investigation." }
        ],
        tracking: [
          { category: "Villain Plot", description: "Floyd letting them in for his reasons" },
          { category: "Setup", description: "Hope's Hollow seems too perfect" }
        ],
        connections: [
          { targetSceneId: "5.2", type: "causal", description: "Meeting with Idea Man" }
        ]
      },
      {
        id: "5.2",
        sequenceId: "SEQ_5",
        title: "5.2: Floyd Revealed as Idea Man",
        pageNumber: 65,
        location: "INT. IDEA MAN'S OFFICE",
        timeOfDay: "DAY",
        summary: "The Idea Man is revealed to be FLOYD - Daisy's rejected ex. He's transformed, seems benevolent. Explains his wish. They give him Daisy's genie.",
        scriptContent: `INT. IDEA MAN'S OFFICE - DAY

An impressive building. Children's drawings pinned alongside architectural plans.

ASSISTANT
Please welcome the architect himself, the maven of our haven...The Idea Man.

The door OPENS. A FIGURE steps into the light:

It's FLOYD - Daisy's rejected ex. But TRANSFORMED. Gone is the sweaty man. This Floyd stands straight, calm yet energetic. Worn chambray shirt, rolled sleeves.

DAISY
Floyd?!

FLOYD
Surprise! When the system flagged your arrival I literally spilled my coffee.

DAISY
(dawning)
You let us in.

FLOYD
Daisy, I know our paths crossed in...let's call it an unfortunate way. But I'm so relieved you all made it here safely.

FLOYD
I really do owe you a thank you. What happened with us was awful but it was nothing new. My whole life, I'd had terrible judgment. Bad ideas. Mom called them "Floyd's Fuckups."

FLOYD
So when G-Day happened, I didn't wish to be stronger or richer. I wished for better ideas. Ideas people would believe in.

ALEX
But they're not your good ideas. They're granted to you--

FLOYD
You're right, I'm just the vessel. The ideas work, that's what matters.

DAISY
Actually, Floyd-- there's some people we were hoping could join us.

FLOYD
Alright, kid, let's see whatcha got.

Robbie demonstrates his powers - ENERGY SHOOTS OUT, ANIMATED SOUL BLADES spiral around him.

FLOYD
Send the jet for them.`,
        beats: [
          { id: "5.2-b1", description: "Idea Man revealed as Floyd", completed: true },
          { id: "5.2-b2", description: "Floyd explains his wish - 'better ideas'", completed: true },
          { id: "5.2-b3", description: "Alex skeptical but Floyd passes truth-check", completed: true },
          { id: "5.2-b4", description: "Robbie demonstrates powers - Floyd impressed", completed: true },
          { id: "5.2-b5", description: "Floyd agrees to bring their friends", completed: true }
        ],
        notes: [
          { id: "n5.2-1", author: "PG", type: NoteType.CHARACTER, content: "Can we make more of a meal for Floyd's wish/power? The duality (bad ideas BUT people think good) doesn't land until later. Need to feel it sooner." },
          { id: "n5.2-2", author: "AMZN", type: NoteType.CHARACTER, content: "What idea does Idea Man represent? How is he hero of his own story? His wish is that people THINK his ideas are good, not that they ARE good." },
          { id: "n5.2-3", author: "AMZN", type: NoteType.DIALOGUE, content: "ALEX: But they're not your good ideas. They're granted to you. -- Not sure this is true. We've seen wishes go wrong. There IS an art to making good ones." }
        ],
        tracking: [
          { category: "Villain Plot", description: "Floyd's true wish - people THINK ideas are good" },
          { category: "Character Arc", description: "Floyd still obsessed with Daisy" },
          { category: "Setup", description: "Robbie's value to Floyd" }
        ],
        connections: [
          { targetSceneId: "6.2", type: "foreshadow", description: "Floyd will weaponize Robbie" },
          { targetSceneId: "7.3", type: "callback", description: "Floyd's true nature revealed" }
        ]
      },
      {
        id: "5.3",
        sequenceId: "SEQ_5",
        title: "5.3: Genie Pool - Daisy Signs Away",
        pageNumber: 68,
        location: "INT. IDEA MAN'S OFFICE",
        timeOfDay: "DAY",
        summary: "Floyd asks them to store genies in the wishpool for 'the greater good.' Daisy reluctantly signs over her genie. Alex is suspicious.",
        scriptContent: `FLOYD
One thing. If you stay here, we ask you store your genie in the wishpool. Haven policy.

ALEX
I don't know about this.

FLOYD
There really is no need for genies here, we already have everything. But in emergency they serve the collective good. It's like a genie spa.

He gestures out the window -- THOUSANDS OF GENIES swimming beneath the FOUNTAINS.

DAISY'S GENIE
I am overdue for a massage...

Floyd meets Daisy's eyes, hopeful.

DAISY
Take her.
(to genie)
I promise I'll visit.

DAISY'S GENIE
You better, my lil hot mess bess.

FLOYD
Look at that - you finally said yes. Just sign this tablet.`,
        beats: [
          { id: "5.3-b1", description: "Floyd requests genies for wishpool", completed: true },
          { id: "5.3-b2", description: "Daisy signs over her genie", completed: true },
          { id: "5.3-b3", description: "Alex suspicious but outvoted", completed: true }
        ],
        notes: [
          { id: "n5.3-1", author: "PG", type: NoteType.LOGIC, content: "Seems too easy how Idea Man gets them to part with genie and sign tablet." },
          { id: "n5.3-2", author: "AMZN", type: NoteType.LOGIC, content: "Given genies flit in and out of existence, how can they be imprisoned by Idea Man? Are there rules for transfer from one person to next?" }
        ],
        tracking: [
          { category: "Genie Rules", description: "Genies can be stored/transferred" },
          { category: "Villain Plot", description: "Floyd collecting genies via fine print" },
          { category: "Character Arc", description: "Daisy's genie-bond being tested" }
        ],
        connections: [
          { targetSceneId: "8.1", type: "callback", description: "Freeing the genies from wishpool" }
        ]
      },
      {
        id: "5.4",
        sequenceId: "SEQ_5",
        title: "5.4: Settling In - One Week Later",
        pageNumber: 71,
        location: "EXT/INT. HOPE'S HOLLOW - VARIOUS",
        timeOfDay: "DAY",
        summary: "TITLE: ONE WEEK LATER. Everyone settling into utopia. Ed getting healthy. Robbie in school. Family reunited. But something feels off.",
        scriptContent: `LOWER THIRD: ONE WEEK LATER

EXT. HOPE'S HOLLOW - AERIAL VIEW - DAWN

A gleaming utopia. Perfect buildings, green parks.

MONTAGE:

-- Ed downs a green juice then heads out for a jog in a sleek new running outfit

-- June pulls a pie from the oven. Robbie walks through in SCHOOL UNIFORM, kisses June goodbye.

INT. CLASSROOM - MORNING

Robbie sits among TEENAGERS beneath Floyd's portrait.

TEACHER
Who can tell me what makes Hope's Hollow special?

FEMALE STUDENT
The Idea Man, who protects us all.

TEACHER
That's right. That's what's most important.

EXT. POOL - DAY

Tim sunbathes. His fry skin has BURNT EVEN MORE.

On TV: Floyd interviewed on the MORNING SHOW. Daisy watches, entranced.

FLOYD
(to camera)
And I'd like to pay for Ms. Wanless' drink. On me.

A perfect cocktail appears, glass engraved "Compliments of Idea Man."

DAISY
I almost got used to us having a kid.

ALEX
He's been at school all week. We haven't seen him once.`,
        beats: [
          { id: "5.4-b1", description: "One week time jump - everyone settled", completed: true },
          { id: "5.4-b2", description: "Ed getting healthy - suspicious transformation", completed: true },
          { id: "5.4-b3", description: "Robbie in school - Floyd's portrait everywhere", completed: true },
          { id: "5.4-b4", description: "Floyd paying special attention to Daisy", completed: true }
        ],
        notes: [
          { id: "n5.4-1", author: "PG", type: NoteType.LOGIC, content: "When did we skip to 8 months? Perhaps typo, meant to be 8 weeks?" },
          { id: "n5.4-2", author: "PG", type: NoteType.CHARACTER, content: "Is Ed still drinking even though he has trainer and is generally fit?" }
        ],
        tracking: [
          { category: "Villain Plot", description: "Brainwashing in full effect" },
          { category: "Character Arc", description: "Daisy falling under Floyd's spell" },
          { category: "Found Family", description: "Daisy/Alex miss being Robbie's 'parents'" }
        ],
        connections: [
          { targetSceneId: "6.1", type: "causal", description: "Brainwashing leads to conflict" }
        ]
      },
      {
        id: "5.5",
        sequenceId: "SEQ_5",
        title: "5.5: Exactitude - Genie Politics",
        pageNumber: 75,
        location: "INT. EXACTITUDE CONFERENCE ROOM",
        timeOfDay: "DAY",
        summary: "Floyd takes Robbie to Exactitude - a haven of wish-lawyers. He wants them to help attack Dougland. They refuse, accusing him of the scourings.",
        scriptContent: `INT. EXACTITUDE CONFERENCE ROOM - DAY

Floyd sits waiting. A long table MATERIALIZES with TWELVE LAWYERS.

FLOYD
I'll cut to the chase. Dougland is becoming a problem.

A HOLOGRAM shows DOUGLAND - men in military uniforms.

FLOYD
President Doug is stockpiling weaponry. They're working on a wish loophole that would erase every life-form on the planet. Leaving them with all genies and the last wish.

HEAD LAWYER
How do you know?

FLOYD
I have a Doug on the inside. We need preemptive action. A legally worded wish to weaken their defenses.

HEAD LAWYER
The treaty forbids first strikes.

FLOYD
(leaning forward)
Because I think it's a great idea--

HEAD LAWYER
That won't work on us, Mr. Faughn. We've also been looking into the scourings. Our sources say it's not Dougland... They say it was you.

FLOYD
(to Robbie)
Protect me.

Robbie hesitates.

FLOYD
They want to hurt us, Robbie. Protect me.

Robbie's hands GLOW with energy. He LEAPS ACROSS THE TABLE and NEUTRALIZES half the room in seconds.`,
        beats: [
          { id: "5.5-b1", description: "Floyd takes Robbie to Exactitude", completed: true },
          { id: "5.5-b2", description: "Exactitude lawyers immune to Floyd's influence", completed: true },
          { id: "5.5-b3", description: "Floyd accused of being behind scourings", completed: true },
          { id: "5.5-b4", description: "Robbie attacks when Floyd commands - brainwashed", completed: true }
        ],
        notes: [
          { id: "n5.5-1", author: "AMZN", type: NoteType.REWRITE, content: "If first meeting with Exactitude happens earlier - right after arriving at HH - can use it to lay out global stakes and learn more about Scouring." },
          { id: "n5.5-2", author: "AMZN", type: NoteType.LOGIC, content: "Why didn't Floyd wish stupidity on Exactitude lawyers from the get go? This inventive battle wishing is what we need more of." },
          { id: "n5.5-3", author: "PG", type: NoteType.CHARACTER, content: "How has Robbie become ULTRA brainwashed? Clarify rules behind how spell can be broken." }
        ],
        tracking: [
          { category: "Villain Plot", description: "Floyd revealed as scouring source" },
          { category: "Character Arc", description: "Robbie weaponized by Floyd" },
          { category: "Genie Rules", description: "Wish loopholes and legal language" }
        ],
        connections: [
          { targetSceneId: "8.1", type: "callback", description: "Exactitude attacks Hope's Hollow" }
        ]
      }
    ]
  },

  // ============================================================================
  // SEQUENCE 6: THE TRAP
  // ============================================================================
  {
    id: "SEQ_6",
    title: "SEQUENCE 6: THE TRAP",
    dramaticQuestion: "Can Alex break through the brainwashing? What is Floyd's true plan?",
    climax: "Floyd reveals his full plan to Daisy at dinner",
    resolution: "Daisy discovers Remnant Daisy; Alex rescues her",
    scenes: [
      {
        id: "6.1",
        sequenceId: "SEQ_6",
        title: "6.1: Brenda Confesses",
        pageNumber: 77,
        location: "INT. MICHAEL AND BRENDA'S HOUSE",
        timeOfDay: "MORNING",
        summary: "Brenda confesses her affair with Tim to Michael. He's devastated. Their marriage fractures.",
        scriptContent: `INT. MICHAEL AND BRENDA'S HOUSE - KITCHEN - MORNING

Michael, INSANELY pregnant, waddles around preparing breakfast.

MICHAEL
Nobody told me my nipples would get dark. They're like, goth nipples.

BRENDA
I hooked up with someone.

Michael's pancake flip fails, landing with a SAD PLOP.

BRENDA
It was like a Rumspringa, before the baby. Not a big deal.

MICHAEL
You hooked up with Alex?

BRENDA
No, not Alex. You don't know him.

MICHAEL
Yeah, I don't think anyone wants to BANG A PREGNANT GUY!

BRENDA
I didn't ask you to.

He exits. A DOOR SLAMS.

MICHAEL (O.S.)
Sorry! Baby kicked. Didn't mean to slam it.`,
        beats: [
          { id: "6.1-b1", description: "Brenda confesses affair to Michael", completed: true },
          { id: "6.1-b2", description: "Michael devastated", completed: true },
          { id: "6.1-b3", description: "Their relationship fractured", completed: true }
        ],
        notes: [
          { id: "n6.1-1", author: "PG", type: NoteType.CHARACTER, content: "This scene should get more honest between them. Chance to hash things out and leave Michael reflective of where HE's gone wrong too." },
          { id: "n6.1-2", author: "PG", type: NoteType.CHARACTER, content: "Brenda has valid points about unhappiness. We don't see her express frustrations to Michael directly. She's just apologetic. Add scene where she shares feelings and he takes accountability." },
          { id: "n6.1-3", author: "AMZN", type: NoteType.THEME, content: "Not sure Tim/Michael/Brenda love triangle should be focus when fate of world is at stake. Perhaps can play out in background." }
        ],
        tracking: [
          { category: "Character Arc", description: "Brenda/Michael conflict" },
          { category: "Character Arc", description: "Michael's controlling nature exposed" }
        ],
        connections: [
          { targetSceneId: "8.2", type: "callback", description: "Brenda/Michael reconciliation at birth" }
        ]
      },
      {
        id: "6.2",
        sequenceId: "SEQ_6",
        title: "6.2: Alex Investigates",
        pageNumber: 80,
        location: "INT. HOPE'S HOLLOW - MUSEUM",
        timeOfDay: "DAY",
        summary: "Alex, using truth-vision, investigates Hope's Hollow. Something's wrong but he can't pinpoint it. June is also immune - she's a remnant.",
        scriptContent: `INT. MUSEUM OF HOPE'S HOLLOW - DAY

Alex examines the exhibit: "THE MIRACLE OF HOPE'S HOLLOW." He laughs quietly at the propaganda.

DAISY appears beside him.

ALEX
It's amazing he built all this in just eight months.

ALEX
It's a little weird, though, right? It's like he's hypnotized everyone.

DAISY
Everyone except you?

ALEX
I think he's lying.

DAISY
Wouldn't your wish tell you if he was lying?

ALEX
No, it says he's telling the truth. But I think he--

DAISY
--Alex, would it kill you to admit something good happened?

INT. WILLIAMS FAMILY HOUSE - LATER

Alex meets with June.

JUNE
That's not my son.

ALEX
No it's not.

JUNE
It's not my husband either. I like that he's getting his act together but, that's not Ed.

ALEX
Daisy's the same way. The others too. Something really bad is happening here.

ALEX
I think my wish is protecting me somehow.

JUNE
Doesn't work on me either. Maybe cause I'm a remnant? You can't manipulate what's already gone.`,
        beats: [
          { id: "6.2-b1", description: "Alex investigates - something's off", completed: true },
          { id: "6.2-b2", description: "His truth-vision shows Floyd as truthful (his trick)", completed: true },
          { id: "6.2-b3", description: "June also immune - she's a remnant", completed: true },
          { id: "6.2-b4", description: "They recognize everyone else is brainwashed", completed: true }
        ],
        notes: [
          { id: "n6.2-1", author: "PG", type: NoteType.LOGIC, content: "Clarification needed: Why can only THIS group snap out of it? What's special about them besides Alex's wish? Why is Robbie ULTRA brainwashed?" },
          { id: "n6.2-2", author: "AMZN", type: NoteType.REWRITE, content: "How can Alex convert Daisy to the cause? Maybe key is breaking Daisy's genie out of captivity?" }
        ],
        tracking: [
          { category: "Villain Plot", description: "Floyd's brainwashing revealed" },
          { category: "Genie Rules", description: "Truth-vision fooled by Floyd's wish wording" },
          { category: "Genie Rules", description: "Remnants immune to brainwashing" }
        ],
        connections: [
          { targetSceneId: "7.2", type: "causal", description: "Alex and June ally to save others" }
        ]
      },
      {
        id: "6.3",
        sequenceId: "SEQ_6",
        title: "6.3: Dinner with Floyd - The Full Plan",
        pageNumber: 85,
        location: "INT. FLOYD'S MANSION - DINING ROOM",
        timeOfDay: "NIGHT",
        summary: "Floyd invites Daisy to dinner. Brainwashed, she accepts. He reveals his FULL plan: scour the planet, collect all genies, rule with her.",
        scriptContent: `INT. FLOYD'S DINING ROOM - NIGHT

Candlelight. Floyd gazes at Daisy in an elegant gown.

FLOYD
What's your one big wish?

DAISY
Alex thinks I'm "wish-locked."

FLOYD
Ridiculous. You just have high standards. But what if you had unlimited wishes? Anything, anytime?

DAISY
That's not how it works.

FLOYD
Right. That's not the way it works for anyone...Except me. Remember when you got here I asked if it'd be alright to take your wish for the greater good, and you signed? Well, I am that greater good.

DAISY
(nodding, entranced)
That's...clever.

FLOYD
Soon, I won't just have Hope's Hollow's wishes. I'll have every remaining genie on Earth.

DAISY
How?

FLOYD
Exactitude drafted an alliance preventing havens from attacking each other. But Robbie just helped ensure they'll attack ME, break the truce...

FLOYD
With those geniuses gone, I'll scour the whole planet, nuke every last living thing, and make all the genies come directly to me.

DAISY
But what about your family?

FLOYD
I'll kill them. Don't you think that's a good idea?

DAISY
(smiling despite internal battle)
Amazing.`,
        beats: [
          { id: "6.3-b1", description: "Floyd's romantic dinner with Daisy", completed: true },
          { id: "6.3-b2", description: "Reveals genies are HIS via fine print", completed: true },
          { id: "6.3-b3", description: "Reveals plan: scour planet, collect all genies", completed: true },
          { id: "6.3-b4", description: "Plans to kill his wished-family", completed: true },
          { id: "6.3-b5", description: "Daisy brainwashed into agreeing", completed: true }
        ],
        notes: [
          { id: "n6.3-1", author: "AMZN", type: NoteType.REWRITE, content: "While dinner scene could work as part of larger plan orchestrated by Alex, on its own it feels too small and divorced from global stakes." },
          { id: "n6.3-2", author: "RR", type: NoteType.THEME, content: "This is where Floyd's true nature is fully revealed - he doesn't care about ideas, only being seen as having them" }
        ],
        tracking: [
          { category: "Villain Plot", description: "Floyd's full plan revealed" },
          { category: "Villain Plot", description: "Floyd behind ALL scourings" },
          { category: "Character Arc", description: "Daisy fully under Floyd's spell" }
        ],
        connections: [
          { targetSceneId: "7.3", type: "causal", description: "Daisy discovers Remnant Daisy" }
        ]
      }
    ]
  },

  // ============================================================================
  // SEQUENCE 7: REVELATIONS
  // ============================================================================
  {
    id: "SEQ_7",
    title: "SEQUENCE 7: REVELATIONS",
    dramaticQuestion: "Can they break free before it's too late?",
    climax: "Ed dies, June vanishes - Robbie alone with Floyd",
    resolution: "Daisy freed from brainwashing, Exactitude attacks",
    scenes: [
      {
        id: "7.1",
        sequenceId: "SEQ_7",
        title: "7.1: Tim's Confession",
        pageNumber: 90,
        location: "EXT. HOPE'S HOLLOW - TOWN SQUARE",
        timeOfDay: "NIGHT",
        summary: "Tim confesses to Michael that HE was the one Brenda kissed. Michael beats Tim, then they reconcile slightly.",
        scriptContent: `EXT. HOPE'S HOLLOW - TOWN SQUARE - NIGHT

Michael sits near the wishpool fountains, rubbing his belly.

TIM
I need to tell you something. It was me. I'm the one Brenda hooked up with.

Michael stares at him.

TIM
It was a mistake! We were scared, there were vampires!

MICHAEL
I TOLD YOU ABOUT MY NIPPLES!

Michael lunges forward and SLAPS Tim across his fry face. Again and again.

TIM
Keep hitting me! I'm not fighting a pregnant person!

CHUNKS OF FRENCH FRY FLYING OFF.

MICHAEL
I TRUSTED YOU WITH MY FEELINGS!

TIM
Most things that break aren't broken for good. The mess looks worse than the actual damage.

MICHAEL
That's really wise.

TIM
...When you flush the toilet it enters my world.`,
        beats: [
          { id: "7.1-b1", description: "Tim confesses to Michael", completed: true },
          { id: "7.1-b2", description: "Michael attacks Tim", completed: true },
          { id: "7.1-b3", description: "Tim's wisdom about broken things", completed: true }
        ],
        notes: [
          { id: "n7.1-1", author: "PG", type: NoteType.CHARACTER, content: "Don't fully understand Tim's wishpool mission later." }
        ],
        tracking: [
          { category: "Character Arc", description: "Tim/Michael conflict and partial resolution" },
          { category: "Comedy", description: "French fry chunks flying" }
        ],
        connections: [
          { targetSceneId: "8.2", type: "foreshadow", description: "Tim's sacrifice for the group" }
        ]
      },
      {
        id: "7.2",
        sequenceId: "SEQ_7",
        title: "7.2: Floyd Takes Ed - June Vanishes",
        pageNumber: 95,
        location: "INT. WILLIAMS FAMILY HOUSE",
        timeOfDay: "NIGHT",
        summary: "Floyd comes for Robbie. June and Ed resist. Floyd wishes Ed to have a heart attack. June vanishes as Ed dies. Robbie, traumatized, goes with Floyd.",
        scriptContent: `INT. SUBURBAN HOUSE - NIGHT

A POUNDING at the door. Floyd stands flanked by GUARDS.

FLOYD
Robbie. Come with me.

JUNE
Excuse me?

ED
It's almost ten PM. Whatever it is can wait.

FLOYD
Exactitude is attacking earlier than expected.

JUNE
Absolutely not.

FLOYD
Mrs. Williams, I think that's a terrible idea.

JUNE
I don't care.

FLOYD
Ed, I think you should sit down.

Ed remains, mentally fighting. Floyd looks impressed.

FLOYD
You have gotten stronger. But still, your heart's weak.

Ed's face CONTORTS. He clutches his chest. Ed COLLAPSES, gasping.

JUNE
ED! What's happening?!

FLOYD
(calmly)
Call medical. Heart attack. Such a shame.

Robbie stares. June turns angrily.

JUNE
You wished for this?

Ed's breathing becomes labored. June's form begins to SHIMMER, becoming translucent.

JUNE
(panicking)
No, no, no! Robbie!

She reaches for her son as she VANISHES completely.

FLOYD
I'm so sorry, son. I tried to help him. Are you ready to protect what matters?

Robbie trembles. Then nods.`,
        beats: [
          { id: "7.2-b1", description: "Floyd comes for Robbie", completed: true },
          { id: "7.2-b2", description: "June and Ed resist", completed: true },
          { id: "7.2-b3", description: "Floyd wishes Ed to have heart attack", completed: true },
          { id: "7.2-b4", description: "June vanishes as Ed dies (remnant rule)", completed: true },
          { id: "7.2-b5", description: "Robbie, broken, goes with Floyd", completed: true }
        ],
        notes: [
          { id: "n7.2-1", author: "PG", type: NoteType.CHARACTER, content: "Want emotional response to Robbie coming to, realizing June and Ed are really gone." },
          { id: "n7.2-2", author: "AMZN", type: NoteType.LOGIC, content: "How do Daisy and Alex know Floyd killed Ed? How does the spell 'shatter' for the others?" }
        ],
        tracking: [
          { category: "Villain Plot", description: "Floyd kills Ed to isolate Robbie" },
          { category: "Genie Rules", description: "Remnant vanishes when wisher dies" },
          { category: "Character Arc", description: "Robbie loses both parents again" }
        ],
        connections: [
          { targetSceneId: "8.3", type: "callback", description: "Robbie breaks free, destroys Floyd" }
        ]
      },
      {
        id: "7.3",
        sequenceId: "SEQ_7",
        title: "7.3: Remnant Daisy - The Truth",
        pageNumber: 98,
        location: "INT. FLOYD'S MANSION - SECRET WING",
        timeOfDay: "NIGHT",
        summary: "Alex crashes dinner, leads Daisy to discover Floyd's secret wing where REMNANT DAISY lives - a wished-for copy. Daisy snaps out of brainwashing.",
        scriptContent: `INT. FLOYD'S MANSION - DINING ROOM

Floyd sits anxiously with engagement cake. ETTA JAMES plays...

A CRASH from next room. Daisy edges out.

INT. FLOYD'S MANSION - SECRET WING

A different aesthetic - Michigan suburban split-level. Family photos. Daisy pushes door open with Alex.

REMNANT DAISY stands at end of hallway, carrying cookies.

REMNANT DAISY
Husband will be here soon. Must have everything perfect for husband.

A CHILD steps into hallway carrying a football. Daisy's eyes widen in horror. The wife and child LOOK RIGHT AT THEM.

REMNANT DAISY
You can't be here. This area is off-limits except for family.

The child begins WAILING inhumanly:

CHILD
BAD MOMMY! BAD MOMMY!

ALEX
We need to get out of here. NOW.

Remnant Daisy approaches, jerky and threatening.

REMNANT DAISY
I want to wear your skin.

Real Daisy grabs A SMALL BUST OF FLOYD and smashes it against her clone's face--

They FIGHT. Remnant Daisy is FERAL. Daisy finally SMASHES a ceramic vase over her head.

DAISY
(horrified)
Am I like that?!

ALEX
You snapping out of it now?!

DAISY
I think so!`,
        beats: [
          { id: "7.3-b1", description: "Alex crashes dinner", completed: true },
          { id: "7.3-b2", description: "Daisy discovers Floyd's secret wing", completed: true },
          { id: "7.3-b3", description: "Remnant Daisy revealed - Floyd's wished-for copy", completed: true },
          { id: "7.3-b4", description: "Fight with Remnant Daisy", completed: true },
          { id: "7.3-b5", description: "Daisy snaps out of brainwashing", completed: true }
        ],
        notes: [
          { id: "n7.3-1", author: "AMZN", type: NoteType.REWRITE, content: "Very R-Rated fight. Need to tone down for PG-13." }
        ],
        tracking: [
          { category: "Villain Plot", description: "Floyd's obsession with Daisy revealed" },
          { category: "Character Arc", description: "Daisy freed from brainwashing" },
          { category: "PG-13 Flag", description: "Violence needs toning" }
        ],
        connections: [
          { targetSceneId: "8.1", type: "causal", description: "Daisy/Alex escape to save others" }
        ]
      }
    ]
  },

  // ============================================================================
  // SEQUENCE 8: CLIMAX
  // ============================================================================
  {
    id: "SEQ_8",
    title: "SEQUENCE 8: CLIMAX",
    dramaticQuestion: "Can they stop Floyd and save Robbie?",
    climax: "Daisy wishes for Robbie to be OK - breaks Floyd's control",
    resolution: "Robbie destroys Floyd, they return to the Lampwick",
    scenes: [
      {
        id: "8.1",
        sequenceId: "SEQ_8",
        title: "8.1: Battle of Hope's Hollow",
        pageNumber: 103,
        location: "EXT. HOPE'S HOLLOW - TOWN SQUARE",
        timeOfDay: "NIGHT",
        summary: "Exactitude's war genies attack. Floyd's genies counter. Tim sacrifices himself to break open the wishpool and free the genies.",
        scriptContent: `EXT. HOPE'S HOLLOW - OUTSIDE THE DOME

THOUSANDS of EXACTITUDE WAR GENIES float toward the dome. Some play WAR DRUMS.

EXT. HOPE'S HOLLOW - TOWN SQUARE

Daisy and Alex SPRINT toward the others.

ALEX
Floyd killed Ed. June's gone.

DAISY
Floyd is planning to WIPE OUT THE PLANET. He's using Robbie as a WEAPON.

They reel from that. Daisy stares at the Wishpool Fountains.

DAISY
We have to free the genies.

TIM
I know how we get them out. We block the main pressure feeder. Water hammer effect!

Tim wades into the fountain, his fry legs growing SOGGY.

TIM
I'm squishy and I know where I'm going. I'm tired of being useless.

Tim SQUISHES HIMSELF INTO THE PIPE.

IN THE BATTLE: War Genies and Hope Genies DISAPPEARING as wishes cancel.

GENERAL
Four hundred genies left!...Three-seventy-five!

On Tim, SEALING THE PIPE with his body.

TIM
WATER HAMMMMMERRRR!

The window ERUPTS. TIM IS VIOLENTLY ROCKETED out-- GENIES shoot upward in a spectacular COLUMN OF LIGHT.

THE GENIES ARE FREE.

Tim, misshapen and missing 80% of his mass:

TIM
Hey guys... did we win?`,
        beats: [
          { id: "8.1-b1", description: "Exactitude war genies attack Hope's Hollow", completed: true },
          { id: "8.1-b2", description: "Genies cancel each other out in battle", completed: true },
          { id: "8.1-b3", description: "Tim uses plumbing knowledge to break wishpool", completed: true },
          { id: "8.1-b4", description: "Tim's sacrifice - nearly destroyed", completed: true },
          { id: "8.1-b5", description: "Genies freed", completed: true }
        ],
        notes: [
          { id: "n8.1-1", author: "PG", type: NoteType.LOGIC, content: "Don't fully understand Tim's wishpool mission? How exactly did they beat Exactitude?" },
          { id: "n8.1-2", author: "AMZN", type: NoteType.LOGIC, content: "Feels tough to say Floyd is 'killing' the genies. Their reason for being is to grant wishes - we haven't been distressed seeing them used before." },
          { id: "n8.1-3", author: "PG", type: NoteType.LOGIC, content: "Why does Floyd not release wishpool genies to fight war genies?" }
        ],
        tracking: [
          { category: "Character Arc", description: "Tim's heroic sacrifice" },
          { category: "Genie Rules", description: "Opposing wishes cancel" },
          { category: "Action", description: "Major battle sequence" }
        ],
        connections: [
          { targetSceneId: "8.3", type: "causal", description: "Free genies enable final confrontation" }
        ]
      },
      {
        id: "8.2",
        sequenceId: "SEQ_8",
        title: "8.2: The Birth",
        pageNumber: 107,
        location: "EXT. HOPE'S HOLLOW - TOWN SQUARE",
        timeOfDay: "NIGHT",
        summary: "In the chaos, Michael goes into labor. Brenda delivers the baby. They reconcile.",
        scriptContent: `EXT. HOPE'S HOLLOW - WISHPOOL

MICHAEL
Oh God. I think it's happening. My water broke.

BRENDA
(rushing to him)
Now?! Of course now.

BRENDA
I'm here. We're in this together.

MICHAEL
But will you always be?

BRENDA
Of course.

The RUMBLING GROWING. Tim's sacrifice building--

BRENDA
HERE IT COMES!

MICHAEL
AGHHHHHHHH!

BRENDA
GREAT NEWS, IT'S COMING OUT OF YOUR BUTT!

MICHAEL
WHY'S THAT GREAT NEWS?!

Michael and Brenda cradle the newborn between them, both shocked and in awe.

MICHAEL
Oh my God, here you are. I made you with my body. I love you.

BRENDA
My family.`,
        beats: [
          { id: "8.2-b1", description: "Michael goes into labor during battle", completed: true },
          { id: "8.2-b2", description: "Brenda delivers baby", completed: true },
          { id: "8.2-b3", description: "They reconcile", completed: true }
        ],
        notes: [
          { id: "n8.2-1", author: "PG", type: NoteType.LOGIC, content: "How/where did his water break?" },
          { id: "n8.2-2", author: "PG", type: NoteType.CHARACTER, content: "Scenes where Brenda rises to deliver baby and commit to family don't feel totally earned at this point." }
        ],
        tracking: [
          { category: "Character Arc", description: "Brenda/Michael reconciliation" },
          { category: "Found Family", description: "New life born amid chaos" }
        ],
        connections: []
      },
      {
        id: "8.3",
        sequenceId: "SEQ_8",
        title: "8.3: Daisy's Wish - Saving Robbie",
        pageNumber: 110,
        location: "EXT. HOPE'S HOLLOW - TOWN SQUARE",
        timeOfDay: "NIGHT",
        summary: "Floyd confronts them with brainwashed Robbie. He gives Daisy her genie back, daring her to wish. She wishes for 'Robbie to be OK.' This breaks Floyd's control.",
        scriptContent: `EXT. HOPE'S HOLLOW - TOWN SQUARE

A BLUR OF MOTION -- Robbie LIFTS Alex by the throat, grips Daisy's shoulder.

FLOYD (O.S.)
There they are.

Floyd approaches, flanked by GUARDS.

FLOYD
You could have had everything! What would you do with a genie anyway? You didn't use it when you had a chance. Waiting for the perfect thing.

Floyd snaps his fingers.

FLOYD
Fine. Have your genie back. The wish is yours.

DAISY'S GENIE
He's not kidding, Daisy. I'm yours again.

FLOYD
Go ahead. Take your best shot.

Daisy's mind races, panic building. Floyd pulls out a MACHINE GUN. She fires into his chest. He's unharmed.

FLOYD
Wish-proof vest. Still can't decide. All cause life threw you a heartbreak when you were a kid?

FLOYD
(to Robbie)
Kill them.

Robbie advances, energy gathering.

ALEX
Snap out of it, Robbie!

Daisy looks at Robbie, sees his young hardened face. She CLOSES HER EYES, EXHALES:

DAISY
Whatever happens to us or anyone else, I wish for Robbie to be OK.

DAISY'S GENIE
Beautiful.

Daisy's genie FLASHES away. Robbie STAGGERS, then BUCKLES.

FLASHBACK - QUICK CUTS:
- June's hand on his cheek as infant
- Ed awkwardly helping with homework
- June's final words: "the real you - the boy inside - he's stronger than any wish."

Robbie's eyes clear. He turns to Floyd.

ROBBIE
I believe you can fly.

Robbie GRABS Floyd and HURLS him skyward--`,
        beats: [
          { id: "8.3-b1", description: "Floyd confronts them with brainwashed Robbie", completed: true },
          { id: "8.3-b2", description: "Floyd gives Daisy her genie back - daring her", completed: true },
          { id: "8.3-b3", description: "Daisy can't decide - classic wish-lock", completed: true },
          { id: "8.3-b4", description: "She wishes for 'Robbie to be OK'", completed: true },
          { id: "8.3-b5", description: "Robbie breaks free", completed: true },
          { id: "8.3-b6", description: "Robbie hurls Floyd into sky", completed: true }
        ],
        notes: [
          { id: "n8.3-1", author: "AMZN", type: NoteType.THEME, content: "We LOVE that Floyd transfers genie back to Daisy in fit of pique - daring her to make decision." },
          { id: "n8.3-2", author: "PG", type: NoteType.CHARACTER, content: "Don't buy that Daisy would make wish that only protects Robbie. Found family bond needs strengthening. Also 'okay' doesn't feel specific enough." },
          { id: "n8.3-3", author: "AMZN", type: NoteType.THEME, content: "Wishing for Robbie's safety feels too small if fate of world is at stake." },
          { id: "n8.3-4", author: "PG", type: NoteType.CHARACTER, content: "Why can Robbie kill Idea Man? Needs to be more clever. Not just throwing him to death." }
        ],
        tracking: [
          { category: "Character Arc", description: "Daisy overcomes wish-lock" },
          { category: "Character Arc", description: "Robbie freed by love, not violence" },
          { category: "Theme", description: "Found family saves the day" }
        ],
        connections: [
          { targetSceneId: "8.4", type: "causal", description: "Floyd defeated, return to Lampwick" }
        ]
      },
      {
        id: "8.4",
        sequenceId: "SEQ_8",
        title: "8.4: Return to the Lampwick - Will's Secret",
        pageNumber: 115,
        location: "INT. LAMPWICK BAR",
        timeOfDay: "DAY",
        summary: "EIGHT MONTHS LATER. They return to the Lampwick. Will reveals he's a genie who saved Earth from a previous G-Day. Robbie's 14th birthday. Hope.",
        scriptContent: `EXT. LAMPWICK BAR - DAY

The bar stands alone amid ruins. The Hellstorm pulls up.

LOWER THIRD: EIGHT MONTHS LATER

INT. LAMPWICK BAR - DAY

The door opens. Our heroes and their genies step in. Will smiles, not surprised.

WILL
Welcome back.
(grins at baby)
See you brought someone new along.

ALEX
The way back was way crazier than the way there. We'll tell you the story sometime.

Will pulls up a birthday cake.

WILL
I believe someone's 14 today.

ROBBIE
Has it been that long?

Robbie studies Will.

ROBBIE
Will... how do you always know what's going on?

WILL
C'mon, Robbie. Isn't it obvious by now? I'm a genie. I'll tell you the story sometime.

The room goes still.

WILL
But before we unpack all that and discuss the bigger game we're playing here -- the last wish -- someone's got to make an old fashioned one.

Robbie looks at the candles.

ROBBIE
I think I don't need to wish for anything.

WILL
(impressed)

ROBBIE
But it's nice to have options.

He closes his eyes, takes a slow breath--and blows...

CUT TO BLACK.

CREDIT SCENE:

EXT. COSMIC VOID - BEYOND TIME

Two COSMIC GENIES observe Earth.

COSMIC GENIE #1
The bartender interfered.

COSMIC GENIE #2
It's allowed. He earned it last cycle.

COSMIC GENIE #1
And the last wish?

COSMIC GENIE #2
Thousands of candidates. It's getting interesting.

Stars fill the sky like eight billion wishes.

COSMIC GENIE #1
Place your bets.`,
        beats: [
          { id: "8.4-b1", description: "Eight months later - return to Lampwick", completed: true },
          { id: "8.4-b2", description: "Will reveals he's a genie", completed: true },
          { id: "8.4-b3", description: "Robbie's 14th birthday", completed: true },
          { id: "8.4-b4", description: "Robbie chooses not to wish - growth", completed: true },
          { id: "8.4-b5", description: "Cosmic genies tease 'the last wish'", completed: true }
        ],
        notes: [
          { id: "n8.4-1", author: "AMZN", type: NoteType.REWRITE, content: "Gets way too easy in the end. Ending should be harder." },
          { id: "n8.4-2", author: "AMZN", type: NoteType.LOGIC, content: "Will's wish renders bar indestructible - bring back meaningfully in finale. Could final showdown take place in Lampwick - only thing left standing after Scouring?" }
        ],
        tracking: [
          { category: "Payoff", description: "Will revealed as genie" },
          { category: "Payoff", description: "Bar's protection comes full circle" },
          { category: "Theme", description: "Robbie doesn't need a wish anymore" },
          { category: "Setup", description: "'The Last Wish' - sequel tease" }
        ],
        connections: []
      }
    ]
  }
];
