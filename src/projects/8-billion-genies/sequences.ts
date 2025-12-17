/**
 * 8 Billion Genies - Sequence and Scene Data
 *
 * Adaptation of the Image Comics series by Charles Soule & Ryan Browne
 */

import { Sequence, NoteType } from '../../config/types';

export const sequences: Sequence[] = [
  {
    id: "SEQ_1",
    title: "SEQUENCE 1: G-DAY",
    dramaticQuestion: "When 8 billion genies appear, who will make the first wish?",
    climax: "Will protects The Lampwick bar with his wish",
    resolution: "A group of strangers are trapped together as the world transforms",
    scenes: [
      {
        id: "1.1",
        sequenceId: "SEQ_1",
        title: "1.1: The Lampwick Bar - Before",
        pageNumber: 1,
        summary: "We meet our ensemble of strangers at The Lampwick, a dive bar in rural America, moments before G-Day.",
        tracking: [
          { category: "Setup", description: "Introduce all main characters in their 'before' state" },
          { category: "Found Family", description: "Strangers who will become family" }
        ],
        beats: [
          { id: "1.1-b1", description: "Daisy sits alone, avoiding eye contact, clearly running from something", completed: false },
          { id: "1.1-b2", description: "Alex enters, tech bro energy, on phone with investors", completed: false },
          { id: "1.1-b3", description: "Robbie (13) plays arcade games while Ed drinks at the bar", completed: false },
          { id: "1.1-b4", description: "Tim the plumber fixes the toilet, complaining about the job", completed: false },
          { id: "1.1-b5", description: "Brenda and Michael sit in a booth, tension about the pregnancy", completed: false },
          { id: "1.1-b6", description: "Will tends bar, oddly calm, watching everyone with knowing eyes", completed: false }
        ],
        notes: [
          { id: "n1.1-1", author: "RR", type: NoteType.CHARACTER, content: "Daisy should have a moment where she almost makes a decision but chickens out - sets up her arc." },
          { id: "n1.1-2", author: "AMZN", type: NoteType.THEME, content: "Make sure each character's 'wish potential' is visible in their before state." }
        ],
        connections: [
          { targetSceneId: "1.2", type: "causal", description: "Peaceful before leads to chaotic after" }
        ],
        scriptContent: `INT. THE LAMPWICK BAR - RURAL AMERICA - DAY

A classic American dive bar. Neon signs, sticky floors, the smell of decades of spilled beer.

DAISY (late 20s) sits alone at a corner booth, laptop open, pretending to work. She glances at her phone - 47 missed calls from "Floyd." She silences it.

At the bar, WILL (60s) polishes glasses with practiced ease. There's something ancient about his eyes.

ALEX (late 20s) bursts in, phone pressed to his ear.

ALEX
No, no, no - tell the board the pivot is STRATEGIC. We're not failing, we're...

He trails off, realizing how loud he is. The locals stare.

In the corner, ROBBIE (13) feeds quarters into an ancient arcade machine. Behind him, his stepfather ED (50s) nurses whiskey number three.

The TOILET FLUSHES. TIM (40s) emerges, plunger in hand.

TIM
That toilet's gonna need more than a plunger. You got roots in your septic.

A couple enters - BRENDA (30s, visibly pregnant) and MICHAEL (30s). They're mid-argument.

BRENDA
I told you, I don't want to talk about names yet.

MICHAEL
(hurt)
Bunbun, we only have four months-

BRENDA
Don't call me that.

Will watches them all. Waiting.`
      },
      {
        id: "1.2",
        sequenceId: "SEQ_1",
        title: "1.2: The Arrival",
        pageNumber: 5,
        summary: "8 billion genies appear simultaneously worldwide. The Lampwick gets its share.",
        tracking: [
          { category: "Global Stakes", description: "Every person on Earth gets a genie" },
          { category: "Genie Rules", description: "First look at what genies are" }
        ],
        beats: [
          { id: "1.2-b1", description: "A blinding flash of light", completed: false },
          { id: "1.2-b2", description: "Everyone in the bar now has a small floating entity beside them", completed: false },
          { id: "1.2-b3", description: "Genies introduce themselves - one wish, any wish, it will be granted", completed: false },
          { id: "1.2-b4", description: "Chaos outside - screams, explosions, the sound of wishes going wrong", completed: false },
          { id: "1.2-b5", description: "Will's genie appears - Will immediately wishes to protect the bar", completed: false }
        ],
        notes: [
          { id: "n1.2-1", author: "RR", type: NoteType.REWRITE, content: "The genie voices should be distinct and memorable - like having Jennifer Coolidge, Morgan Freeman, etc." },
          { id: "n1.2-2", author: "PG", type: NoteType.PRODUCTION, content: "VFX note: Genies should feel magical but not overly CG - practical elements where possible." }
        ],
        connections: [
          { targetSceneId: "1.3", type: "causal", description: "Will's wish creates the protected space" }
        ],
        scriptContent: `INT. THE LAMPWICK BAR - CONTINUOUS

A FLASH OF LIGHT. Blinding. Everyone shields their eyes.

When they can see again - floating beside each person is a small, luminous entity. GENIES.

DAISY'S GENIE
(Jennifer Coolidge-esque)
Hiiii. I'm your genie. You get one wish. Literally anything. No rules. Well, one rule - I can't kill another genie. But otherwise? Sky's the limit, baby.

ALEX
What the hell-

His genie (Paul Giamatti vibe) shrugs.

ALEX'S GENIE
She said what she said.

Outside, SCREAMING. The sound of a MASSIVE EXPLOSION.

Through the window, they see: A DRAGON. ACTUAL DRAGON. Flying past.

TIM
Holy shit.

TIM'S GENIE
(John Mulaney vibe)
Soooo, what's it gonna be, big guy?

Tim opens his mouth-

WILL
(urgent, to his genie)
I wish that The Lampwick and everyone currently inside it is protected from all wishes and all wish-related harm.

WILL'S GENIE
(Morgan Freeman vibe)
Done.

A SHIMMER passes through the bar. The walls seem to SOLIDIFY.

DAISY
What did you just do?

WILL
(calm)
I made us safe.

Outside, the world BURNS.`
      },
      {
        id: "1.3",
        sequenceId: "SEQ_1",
        title: "1.3: Tim's Mistake",
        pageNumber: 10,
        summary: "Tim accidentally wishes to become a french fry, establishing the stakes of careless wishes.",
        tracking: [
          { category: "Comedy", description: "First major comedic beat" },
          { category: "Genie Rules", description: "Wishes are literal and permanent" },
          { category: "PG-13 Flag", description: "Keep Tim's transformation family-friendly" }
        ],
        beats: [
          { id: "1.3-b1", description: "Tim, stressed, mutters 'I could really go for some fries right now'", completed: false },
          { id: "1.3-b2", description: "His genie interprets this as a wish", completed: false },
          { id: "1.3-b3", description: "Tim transforms into a sentient french fry", completed: false },
          { id: "1.3-b4", description: "Everyone realizes wishes are PERMANENT", completed: false },
          { id: "1.3-b5", description: "Daisy refuses to make any wish - 'I'm not deciding anything'", completed: false }
        ],
        notes: [
          { id: "n1.3-1", author: "AMZN", type: NoteType.THEME, content: "Tim's transformation should be funny but also establish real stakes - this is permanent." }
        ],
        connections: [
          { targetSceneId: "5.9", type: "foreshadow", description: "Tim's plumbing knowledge saves the day later" }
        ],
        scriptContent: `INT. THE LAMPWICK BAR - LATER

The group watches the chaos outside through the windows. FIRE. MONSTERS. A MAN FLYING. Another man falling.

TIM
(muttering, stressed)
Jesus. I could really go for some fries right about now.

TIM'S GENIE
Granted!

POOF.

Where Tim stood, there is now a LARGE SENTIENT FRENCH FRY. Golden, crispy, with tiny arms and Tim's panicked eyes.

TIM (AS FRY)
WHAT THE FUCK?!

ALEX
Did you just-

TIM'S GENIE
He wished to be a fry!

(beat)

I mean technically he said he "could go for some fries" which I interpreted as-

TIM (AS FRY)
CHANGE ME BACK!

TIM'S GENIE
Can't. One wish per customer.

(disappears)

Tim, now a french fry, SCREAMS.

DAISY
(to her genie, firm)
Don't do anything. I'm not wishing for anything.

DAISY'S GENIE
Sweetie, you're gonna have to eventually. That's how this works.

DAISY
Watch me.`
      }
    ]
  },
  {
    id: "SEQ_2",
    title: "SEQUENCE 2: THE WORLD TRANSFORMS",
    dramaticQuestion: "What happens when 8 billion wishes collide?",
    climax: "The group learns about Hope's Hollow and decides to leave the bar",
    resolution: "They embark on a journey through wish-transformed America",
    scenes: [
      {
        id: "2.1",
        sequenceId: "SEQ_2",
        title: "2.1: The New World",
        pageNumber: 15,
        summary: "Days pass. The bar group learns about the chaos outside through Will's TV.",
        tracking: [
          { category: "Global Stakes", description: "World has been fundamentally transformed" },
          { category: "Scouring", description: "First hints of the nuclear attacks" }
        ],
        beats: [
          { id: "2.1-b1", description: "News montage: Wish-chaos worldwide", completed: false },
          { id: "2.1-b2", description: "Superheroes have emerged - most are children who wished for powers", completed: false },
          { id: "2.1-b3", description: "Cities destroyed by contradictory wishes", completed: false },
          { id: "2.1-b4", description: "Mention of 'The Scouring' - mysterious nuclear-like explosions", completed: false },
          { id: "2.1-b5", description: "First mention of 'havens' - protected communities", completed: false }
        ],
        notes: [
          { id: "n2.1-1", author: "RR", type: NoteType.REWRITE, content: "This is our world-building dump - make it visual and entertaining, not exposition-heavy." }
        ],
        connections: [],
        scriptContent: `INT. THE LAMPWICK BAR - DAY 3

The TV plays. Everyone watches, shell-shocked.

NEWS ANCHOR
...the entity known as "Megapal Justice Buddies" - a team of child superheroes - successfully defended Ohio from what authorities are calling a "Kaiju Event."

Cut to: A DRAGON FIGHTING A GIANT ROBOT in downtown Cleveland.

NEWS ANCHOR (V.O.)
Leader "Beetlebug," believed to be approximately eleven years old, gave this statement-

Cut to: A KID IN A BEETLE COSTUME.

BEETLEBUG
We're just doing what the grown-ups can't. Someone has to help.

The TV cuts to static, then:

DIFFERENT ANCHOR
Breaking: Another "Scouring" event has destroyed most of Phoenix. Death toll estimated in the hundreds of thousands. This is the sixth such event since G-Day. The source remains unknown.

ROBBIE
What's the Scouring?

ALEX
Nuclear weapons?

WILL
(quiet)
Something worse.

ED
(drunk)
We gotta get out of here. Find somewhere safe.

ALEX
The bar IS safe.

ED
For how long?`
      },
      {
        id: "2.2",
        sequenceId: "SEQ_2",
        title: "2.2: Hope's Hollow",
        pageNumber: 20,
        summary: "They learn about Floyd's haven - Hope's Hollow - and Daisy's connection to it.",
        tracking: [
          { category: "Villain Plot", description: "Floyd's haven introduced" },
          { category: "Character Arc", description: "Daisy's past with Floyd revealed" }
        ],
        beats: [
          { id: "2.2-b1", description: "News report about Hope's Hollow - a protected haven", completed: false },
          { id: "2.2-b2", description: "It was founded by 'The Idea Man' - Floyd Faughn", completed: false },
          { id: "2.2-b3", description: "Daisy goes pale - she knows Floyd", completed: false },
          { id: "2.2-b4", description: "Flashback: Floyd proposed after one month, Daisy rejected him publicly", completed: false },
          { id: "2.2-b5", description: "Floyd's wish: Everyone thinks his ideas are great", completed: false }
        ],
        notes: [
          { id: "n2.2-1", author: "RR", type: NoteType.CHARACTER, content: "Floyd's wish is key - he didn't wish for GOOD ideas, he wished for people to THINK his ideas are good. Huge difference." },
          { id: "n2.2-2", author: "AMZN", type: NoteType.THEME, content: "Floyd represents the danger of seeking validation over substance." }
        ],
        connections: [
          { targetSceneId: "3.5", type: "foreshadow", description: "Hope's Hollow is their destination" }
        ],
        scriptContent: `INT. THE LAMPWICK BAR - CONTINUOUS

TV shows a GORGEOUS COMPOUND. Think: Silicon Valley utopia meets Coachella.

NEWS ANCHOR (V.O.)
Hope's Hollow, founded by entrepreneur Floyd Faughn - now known as "The Idea Man" - has become the most successful haven in North America.

FLOYD appears on screen. Handsome, confident, charismatic.

FLOYD (ON TV)
My wish was simple: I wanted to help. And now everyone agrees - my ideas are exactly what the world needs.

DAISY
(muttering)
You've got to be kidding me.

ALEX
You know him?

DAISY
(bitter)
He proposed to me. After one month of dating.

FLASHBACK - ONE YEAR AGO

A RESTAURANT. Floyd on one knee. Daisy horrified.

DAISY (V.O.)
I said no. Publicly. Loudly. It was... bad.

BACK TO PRESENT

DAISY
He wished for people to think his ideas are great. Not for him to HAVE great ideas. Just for people to THINK they are.

DAISY'S GENIE
(floating nearby)
Ooh, that's a distinction with a difference, honey.

ALEX
Wait, so everyone who meets him automatically agrees with him?

DAISY
Everyone except me. I knew him before.`
      }
    ]
  },
  {
    id: "SEQ_3",
    title: "SEQUENCE 3: THE JOURNEY BEGINS",
    dramaticQuestion: "Can this group of strangers survive the wish-transformed world?",
    climax: "Ed wishes June back, creating a Remnant",
    resolution: "The group bonds through shared danger",
    scenes: [
      {
        id: "3.1",
        sequenceId: "SEQ_3",
        title: "3.1: Ed's Wish",
        pageNumber: 30,
        summary: "Ed uses his wish to bring back Robbie's mother, June - but as a Remnant.",
        tracking: [
          { category: "Genie Rules", description: "Remnants introduced - wished-back people" },
          { category: "Character Arc", description: "Ed's redemption starts" },
          { category: "Found Family", description: "June becomes the group's moral center" }
        ],
        beats: [
          { id: "3.1-b1", description: "Ed, drunk, thinking about Robbie's pain", completed: false },
          { id: "3.1-b2", description: "Ed wishes for June (Robbie's mother) to be alive again", completed: false },
          { id: "3.1-b3", description: "June appears - confused, not quite right", completed: false },
          { id: "3.1-b4", description: "Genie explains: She's a Remnant - if Ed dies, she vanishes", completed: false },
          { id: "3.1-b5", description: "Robbie's emotional reunion with his mother", completed: false }
        ],
        notes: [
          { id: "n3.1-1", author: "RR", type: NoteType.THEME, content: "June keeps Robbie grounded. She's his anchor to humanity." },
          { id: "n3.1-2", author: "PG", type: NoteType.CHARACTER, content: "June should feel slightly 'off' - loving but not quite fully there. Uncanny valley of resurrection." }
        ],
        connections: [
          { targetSceneId: "5.7", type: "foreshadow", description: "Ed's health becomes critical later" }
        ],
        scriptContent: `INT. THE LAMPWICK BAR - NIGHT

Ed sits alone at the bar. Robbie sleeps on a booth.

ED
(to his genie, slurring)
You know what I wish?

ED'S GENIE
I'm listening.

ED
(tears in eyes)
I wish his mother was alive. June. I wish June was here.

A FLASH.

A WOMAN (50s) appears in the bar. JUNE. She looks around, confused.

JUNE
Ed? What... where am I?

ROBBIE
(waking)
Mom?

He RUNS to her. Hugs her fiercely. June holds him, crying.

JUNE
Robbie. My baby.

ED'S GENIE
(to Ed, quietly)
You should know - she's a Remnant. If you die, she disappears.

ED
(sobering immediately)
What?

ED'S GENIE
Your wish, your life force. She exists because you do.

Ed watches Robbie crying in his mother's arms. He looks at his drink. Sets it down.

ED
Then I better stop drinking.`
      },
      {
        id: "3.2",
        sequenceId: "SEQ_3",
        title: "3.2: Robbie's Transformation",
        pageNumber: 35,
        summary: "Robbie wishes to become a superhero - Naruto-style anime powers.",
        tracking: [
          { category: "Character Arc", description: "Robbie's protective instincts manifest" },
          { category: "Action", description: "Our main 'superhero' is established" },
          { category: "PG-13 Flag", description: "Keep Robbie's powers fun, not violent" }
        ],
        beats: [
          { id: "3.2-b1", description: "The group needs to leave the bar - danger approaching", completed: false },
          { id: "3.2-b2", description: "Robbie sees his friends in danger", completed: false },
          { id: "3.2-b3", description: "Robbie wishes to become like his favorite anime hero", completed: false },
          { id: "3.2-b4", description: "Transformation sequence - Robbie gains Naruto-style powers", completed: false },
          { id: "3.2-b5", description: "His genie nickname's him 'Gokashi'", completed: false }
        ],
        notes: [
          { id: "n3.2-1", author: "AMZN", type: NoteType.THEME, content: "Robbie's first instinct is ALWAYS to protect others. 'If he goes dark, we all go.'" }
        ],
        connections: [],
        scriptContent: `EXT. THE LAMPWICK BAR - DAY

MONSTERS approach the bar. Will's protection holds, but-

WILL
The wish is weakening. We need to go. Now.

ROBBIE
(looking at the monsters, then at his mom)
I wish I had powers. Like in anime. Like Naruto.

ROBBIE'S GENIE
Ooooh fun one.

A TRANSFORMATION SEQUENCE. Full anime style. Robbie's clothes shift to an orange jumpsuit. His eyes flash.

When it ends, ROBBIE hovers in the air, crackling with energy.

ROBBIE
(awed)
Whoa.

His genie grins.

ROBBIE'S GENIE
I'm calling you Gokashi.

ROBBIE
That's... kind of a mix of-

ROBBIE'S GENIE
Yep. Goku. Kakashi. The best of both. Now go save your friends, hero.

Robbie LAUNCHES at the monsters. It's not graceful. It's a thirteen-year-old learning to fly.

But he fights. For his mom. For his friends. For everyone.`
      }
    ]
  },
  {
    id: "SEQ_4",
    title: "SEQUENCE 4: HOPE'S HOLLOW",
    dramaticQuestion: "Is Floyd's haven the salvation it appears to be?",
    climax: "Alex discovers Floyd is behind the Scourings",
    resolution: "They must escape and expose Floyd",
    scenes: [
      {
        id: "4.1",
        sequenceId: "SEQ_4",
        title: "4.1: Arrival at Hope's Hollow",
        pageNumber: 50,
        summary: "The group arrives at Floyd's haven. It seems perfect - too perfect.",
        tracking: [
          { category: "Villain Plot", description: "Floyd's haven from the inside" },
          { category: "Theme", description: "False utopias" }
        ],
        beats: [
          { id: "4.1-b1", description: "The group approaches the gates of Hope's Hollow", completed: false },
          { id: "4.1-b2", description: "Concierge Harper greets them with unsettling enthusiasm", completed: false },
          { id: "4.1-b3", description: "Everyone is immediately charmed by Floyd's ideas", completed: false },
          { id: "4.1-b4", description: "Daisy is immune - she sees through everything", completed: false },
          { id: "4.1-b5", description: "Alex uses his wish: truth-vision (can see when people lie)", completed: false }
        ],
        notes: [
          { id: "n4.1-1", author: "RR", type: NoteType.REWRITE, content: "Alex's truth-vision wish should feel like a moment of growth - he's choosing to see reality, not just success." }
        ],
        connections: [],
        scriptContent: `EXT. HOPE'S HOLLOW - GATES - DAY

The group stands before massive gates. Everything is BEAUTIFUL. Too beautiful.

CONCIERGE HARPER
Welcome to Hope's Hollow! Floyd has been expecting you.

ALEX
(already charmed)
This place is amazing. What a great idea!

DAISY
(to herself)
Here we go.

INT. HOPE'S HOLLOW - LOBBY

Floyd appears. Handsome. Charismatic. Everyone LOVES him immediately.

FLOYD
Friends! Welcome! I had this idea that you'd come, and well - here you are!

Everyone nods enthusiastically. Except Daisy.

ALEX
(to his genie, quietly)
I wish I could see when people are lying.

ALEX'S GENIE
That's actually a good idea.

A shimmer passes over Alex's eyes. He looks at Floyd.

FLOYD
We're just trying to help people here. That's all I've ever wanted.

Alex sees it: A DARK AURA around Floyd's words. He's lying.

ALEX
(to Daisy, quiet)
You're right. Something's wrong here.`
      }
    ]
  },
  {
    id: "SEQ_5",
    title: "SEQUENCE 5: THE TRUTH",
    dramaticQuestion: "Can they stop Floyd before he destroys everything?",
    climax: "The final confrontation with Floyd",
    resolution: "Daisy finally makes her wish",
    scenes: [
      {
        id: "5.1",
        sequenceId: "SEQ_5",
        title: "5.1: Floyd's Plan Revealed",
        pageNumber: 70,
        summary: "Alex's truth-vision reveals Floyd is behind the Scourings - he's collecting genies.",
        tracking: [
          { category: "Villain Plot", description: "Floyd's true plan exposed" },
          { category: "Scouring", description: "The Scourings are Floyd's doing" },
          { category: "Global Stakes", description: "Floyd could end humanity" }
        ],
        beats: [
          { id: "5.1-b1", description: "Alex explores Hope's Hollow with truth-vision", completed: false },
          { id: "5.1-b2", description: "Discovers the 'wishpool' - thousands of trapped genies", completed: false },
          { id: "5.1-b3", description: "Realizes Floyd is causing the Scourings to collect unused genies", completed: false },
          { id: "5.1-b4", description: "Discovers Remnant Daisy - Floyd wished for a copy of her", completed: false },
          { id: "5.1-b5", description: "Floyd's endgame: Collect all genies, remake reality", completed: false }
        ],
        notes: [
          { id: "n5.1-1", author: "RR", type: NoteType.CHARACTER, content: "Floyd doesn't see himself as evil. He thinks he's saving the world. That's what makes him dangerous." }
        ],
        connections: [],
        scriptContent: `INT. HOPE'S HOLLOW - SECRET WING - NIGHT

Alex, using his truth-vision, follows the lies deeper into the compound.

He finds: A MASSIVE POOL OF LIGHT. Thousands of GENIES, trapped and swirling.

ALEX
(into earpiece)
Guys. I found something. It's... it's genies. Thousands of them.

DAISY (V.O.)
What?

ALEX
The Scourings. The explosions. He's causing them. Killing people who haven't made wishes yet so he can collect their genies.

He turns a corner and FREEZES.

In a luxurious apartment sits ANOTHER DAISY. A Remnant. Playing with a CHILD.

REMNANT DAISY
(to the child)
Daddy will be home soon. He always has the best ideas.

Alex backs away, horrified.

ALEX (V.O.)
Daisy. He made a copy of you. You need to see this.`
      }
    ]
  }
];

export default sequences;
