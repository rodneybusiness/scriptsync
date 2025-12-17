/**
 * 8 Billion Genies - Comprehensive Project Configuration
 *
 * Adaptation of the Image Comics series by Charles Soule & Ryan Browne
 * Second draft incorporating Amazon + Point Grey / Counter Culture notes
 *
 * FULLY ANALYZED - Maximum Intelligence Analysis
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ProjectConfig } from '../../config/types';

// =============================================================================
// EXECUTIVE SUMMARY
// =============================================================================
/**
 * STATUS: Second Draft Rewrite
 * PRIMARY TARGET: Address structural and thematic issues for four-quadrant PG-13
 *
 * EXECUTION ORDER:
 * 1. CRITICAL – Global stakes, Scouring clarity, Idea Man mechanics, Daisy & Alex as co-leads
 * 2. HIGH – Robbie's specialness, leaving the bar motivation, genie dynamics, Will/Lampwick payoff
 * 3. MEDIUM – Act 2A momentum, Brenda/Michael complexity, harder ending, Tim's arc
 * 4. LOW – PG-13 pass and line-by-line clarity/continuity cleanup
 */

// =============================================================================
// CHARACTER ARCS - DEEP ANALYSIS
// =============================================================================

/**
 * DAISY WANLESS - Primary Protagonist
 * ─────────────────────────────────────
 * CORE FLAW: Analysis paralysis / avoidance / drifts through life on instinct
 * ARC DESTINATION: Learns she is accountable, reasonable, and far more capable than she believes
 * THEMATIC FUNCTION: Steps into responsibility instead of defaulting to chaos
 *
 * WHAT MAKES HER SPECIAL:
 * - The ONLY character who keeps her genie until the very end
 * - Her history with Floyd makes her potentially immune to his spell
 * - Her decision paralysis is the inverse of Floyd's impulsive action without thought
 *
 * OPEN QUESTIONS (from notes):
 * - Is there one more level of connection between Daisy and Alex beyond the failed date?
 * - Should Floyd and Daisy have had a more substantial relationship and uglier fallout?
 * - Why does Daisy's final wish only protect Robbie? Needs stronger found-family bond
 * - "Analysis paralysis" vs Floyd's "act without thinking" - lean into this thematic contrast
 *
 * AMAZON NOTE: "Daisy feels like the obvious choice to lead our ensemble. She also
 * seems to be most directly tied to Floyd thematically."
 */

/**
 * ALEX CHEN - Co-Protagonist
 * ─────────────────────────────────────
 * CORE FLAW: Righteous idealist who has been overcoddled and insulated / overestimates himself
 * ARC DESTINATION: Realizes he's not as competent as he thinks / learns humility, listening, accepting limits
 * THEMATIC FUNCTION: The truth-seer who must learn to apply truth to himself
 *
 * WHAT MAKES HIM SPECIAL:
 * - His truth-vision wish lets him see through Floyd's spell
 * - The only one (besides June) who can initially see the lies
 * - His failing startup funded by parents = overcoddled + delusional about competence
 *
 * OPEN QUESTIONS (from notes):
 * - How do we further bind Alex to theme?
 * - "But they're not your good ideas. They're granted to you" - not true, there IS art to good wishes
 * - Alex should lead the investigation into Floyd's plan
 * - Perhaps Alex finds a way to convert Daisy to the cause by freeing her genie?
 *
 * AMAZON NOTE: "His ability to see the truth makes him the only one initially able to
 * see through the Idea Man's ruse."
 */

/**
 * ROBBIE GREEN - Emotional Heart
 * ─────────────────────────────────────
 * CORE TRAIT: Innate protector with Superman-level empathy
 * THEMATIC FUNCTION: "If he goes dark, we all go" - the moral compass
 * HIS WISH: Naruto-style anime powers (Gokashi = Goku + Kakashi)
 *
 * WHAT MAKES HIM SPECIAL (NEEDS CLARIFICATION):
 * - Why is Robbie so powerful?
 * - What makes his powers more special than other superheroes?
 * - Why does Idea Man put so much belief in Robbie?
 * - We need to set up his deep understanding of hero lore / his ingenuity
 *
 * OPEN QUESTIONS (from notes):
 * - Does the moment where Robbie wishes feel too quiet? Needs to feel like a "movie moment"
 * - Robbie's motivation/connection to his Mom - can we feel that more through Act 2?
 * - Why can Robbie kill Idea Man? Needs to be more clever than just throwing him to death
 * - Was he always special? This is possibly a first act issue that manifests in third act
 *
 * POINT GREY NOTE: "Why is Robbie special - was he always special (and how) - throughout
 * the movie do we need to see him realize he's special?"
 */

/**
 * FLOYD FAUGHN / THE IDEA MAN - Antagonist
 * ─────────────────────────────────────
 * CORE FLAW: Addiction to recognition - doesn't care about having good ideas,
 *            cares about being SEEN as the person who had them
 * HIS WISH: Everyone thinks his ideas are great (NOT that he HAS great ideas)
 * THEMATIC FUNCTION: The danger of seeking validation over substance
 *
 * BACKSTORY (from comics - potential flashback):
 * - Child celebrated for his ideas grows into a man mocked for them
 * - Publicly humiliated when Daisy rejected his proposal after one month
 * - His evil stems from that humiliation
 *
 * THE SCOURING:
 * - Floyd is behind the Scourings (not Dougland as in comics)
 * - He's causing nuclear-like explosions to collect genies from the dead
 * - Drives refugees to Hope's Hollow to accrue more genies
 *
 * OPEN QUESTIONS (from notes):
 * - Can we make more of a meal for Floyd's wish/power duality?
 * - Why can only THIS group snap out of it? What's special about them?
 * - How has Robbie become ULTRA brainwashed vs others?
 * - Should Floyd have a moment where he realizes he has no idea how to stop the Scouring?
 * - How do his interactions with other Habitats (Exactitude) fit his plan?
 *
 * AMAZON NOTE: "What idea does the Idea Man actually represent? How is he the hero of
 * his own story? His fatal flaw—addiction to recognition—is the key to defeating him."
 */

/**
 * WILL JENNINGS - The Mentor/Secret Weapon
 * ─────────────────────────────────────
 * SECRET: He is actually a genie who saved Earth from a PREVIOUS G-Day
 *         and was rewarded by living as a human
 * HIS WISH: To protect The Lampwick and everyone inside from all wishes
 * THEMATIC FUNCTION: The most qualified person to help stop the Scouring
 *
 * OPEN QUESTIONS (from notes):
 * - How does Will have his own genie if he's a genie? (genies get genies?)
 * - Should we age him down if we want Seth to play him?
 * - His reveal should come meaningfully at the finale
 * - Could the final showdown take place at The Lampwick - the only thing left standing?
 *
 * AMAZON NOTE: "From the very beginning we get the sense that there's something special
 * about Will, but we never find out what. Let's bring this back meaningfully in our finale."
 */

// =============================================================================
// WORLD RULES - GENIE MECHANICS
// =============================================================================

/**
 * GENIE RULES - NEEDS CLARIFICATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ESTABLISHED RULES:
 * - Every human on Earth gets one genie with one wish
 * - Genies operate as a hive mind - can answer any question truthfully
 * - Wishes are literal and permanent
 * - Contradictory wishes cancel each other out
 * - Remnants (wished-back people) vanish if their wisher dies
 * - The Lampwick is wish-protected and indestructible
 * - "The last wish wins" (important for final confrontation)
 *
 * NEEDS CLARIFICATION:
 * - How can genies be imprisoned by Idea Man? They flit in and out of existence
 * - Are there rules governing transfer of a genie from one person to another?
 * - Do genies know how many wishes are left globally?
 * - What can genies tell you vs. what they can't?
 * - Does making an effective wish require "legalese" to close loopholes? (Exactitude)
 * - How does Will have a genie if Will IS a genie?
 *
 * THE WISHPOOL:
 * - Floyd collects genies from people who die before wishing
 * - The Scourings kill people to harvest their genies
 * - Genies are somehow "trapped" in a pool of light
 * - Tim can free them using... plumbing knowledge? (needs work)
 *
 * AMAZON NOTE: "Let's get more specific about the rules around genies and their use."
 */

// =============================================================================
// STRUCTURAL ISSUES - ACT BREAKDOWN
// =============================================================================

/**
 * ACT ONE ISSUES
 * ─────────────────────────────────────
 * - Is 8 weeks too long inside the bar? Should it be shorter?
 * - What keeps them inside that's more personal than danger?
 * - Should a character die early to solidify staying in the bar?
 * - Need to show more danger outside (look out windows more, pg 24)
 * - The "wish protected bus" (pg 58) lowers stakes when we want escalation
 *
 * LEAVING THE LAMPWICK:
 * - Current motivation: Ed's health
 * - Better motivation options:
 *   a) The Scouring is headed their way (ticking clock)
 *   b) Dwindling supplies
 *   c) Will's protection is weakening
 *   d) Someone almost dies stepping outside (establishes danger)
 *
 * AMAZON NOTE: "Let's make sure we really understand why this group is so reluctant to
 * go outside. Just how dangerous is it out there?"
 */

/**
 * ACT TWO ISSUES
 * ─────────────────────────────────────
 * - Group loses narrative drive once they reach Hope's Hollow (pg 65)
 * - Floyd's plan only comes into view late in Act 2
 * - Most of the group is brainwashed, so they can't act until Act 3
 * - Tim/Michael/Brenda love triangle shouldn't be focus when world at stake (pg 81)
 * - Consider cutting right to June/Ed/Michael arrival and skip "settling in"
 *
 * HOPE'S HOLLOW ISSUES:
 * - Entry deal doesn't make sense: 1 genie = 3 people, 2 genies = 5 people? (pg 27)
 * - They only have 1 genie but get in anyway - should be consequence (pg 62)
 * - When did we skip to 8 months? Is that a typo for 8 weeks? (pg 69)
 * - Too easy how Idea Man gets them to part with genie and sign tablet (pg 71)
 *
 * AMAZON NOTE: "Beyond sending a jet to rescue their friends, the group lose their
 * narrative drive once they reach HH."
 */

/**
 * ACT THREE ISSUES
 * ─────────────────────────────────────
 * - Ending gets way too easy (Point Grey)
 * - How exactly do they beat Exactitude? (pg 110)
 * - Daisy's final wish (protecting only Robbie) feels too small for global stakes
 * - "Robbie to be okay" - not specific enough when stakes are this high (pg 114)
 * - Why didn't Floyd wish stupidity on Exactitude lawyers from the start? (pg 111)
 * - How do Daisy and Alex know Floyd killed Ed? (pg 103)
 * - How does the spell "shatter" for everyone? (pg 103-104)
 * - Final fight is very R-rated - needs PG-13 pass (pg 99)
 *
 * AMAZON NOTE: "Wishing for Robbie's safety feels too small if the fate of the world
 * is at stake."
 */

// =============================================================================
// GLOBAL STAKES - WORLD-BUILDING REQUIREMENTS
// =============================================================================

/**
 * BY THE TIME WE REACH HOPE'S HOLLOW, AUDIENCE MUST UNDERSTAND:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. The world has fallen into Chaos
 * 2. Charismatic leaders are trying to reboot society in "habitats"
 * 3. There is a global arms race to accrue genies
 * 4. After a glut of superheroes, they are now a rarity (hence Robbie's value)
 * 5. The Scouring is tearing across the world (unstoppable, unidentified)
 *
 * HOW TO TRACK THE WORLD:
 * - News broadcasts
 * - "Genie broadcasts" (genies as exposition devices)
 * - Anecdotes from fellow travelers
 * - Commercials for other habitats (contrast with Hope's Hollow pitch)
 * - Show where The Scouring started, where it's going, where it is relative to Lampwick
 *
 * THE SCOURING SPECIFICS:
 * - Floyd is secretly behind it (not Dougland)
 * - He's causing explosions to collect unused genies
 * - Many have tried to stop it and failed
 * - Could be used as ticking clock through second half
 * - May need to be further away if we want it as ongoing threat
 *
 * AMAZON NOTE: "Let's use whatever we can to build a picture of what's happening in the
 * world as we go."
 */

// =============================================================================
// PROJECT CONFIGURATION
// =============================================================================

export const config: ProjectConfig = {
  id: '8-billion-genies',
  title: '8 Billion Genies',
  description: `When every person on Earth simultaneously receives their own genie with one wish to grant,
chaos erupts. A group of strangers trapped in a protected bar must journey through a transformed
world to find safety, only to discover the haven they seek hides a villain whose plan could end humanity.

REWRITE STATUS: Second Draft
PRIMARY TARGET: Four-quadrant PG-13 studio movie
KEY FOCUS: Global stakes, villain clarity, Daisy & Alex as co-leads`,

  genres: ['Fantasy', 'Comedy', 'Action', 'Drama', 'Ensemble', 'Adventure', 'Sci-Fi'],

  logline: `When 8 billion genies appear and grant everyone on Earth one wish, a group of strangers
trapped in a protected bar must navigate a transformed world to reach Hope's Hollow—only to discover
the haven's visionary leader has sinister plans that could end humanity.`,

  characters: [
    // ═══════════════════════════════════════════════════════════════════════
    // MAIN CHARACTERS (5)
    // ═══════════════════════════════════════════════════════════════════════
    {
      name: 'DAISY WANLESS',
      role: 'main',
      description: `Late 20s. Online gig worker. Drifts through life on instinct and avoidance.

CORE FLAW: Analysis paralysis - can't make decisions, always running from commitment
ARC: Learns she is accountable, capable, and must step into responsibility
UNIQUE STATUS: The ONLY character who keeps her genie until the very end

THEMATIC CONNECTION TO FLOYD:
- Both fantasize about a better world
- Floyd acts without thinking; Daisy suffers from analysis paralysis
- She's immune to his spell because she knew him before

RELATIONSHIP WITH ALEX:
- Failed date one year ago (need more history here)
- Become surrogate parents to Robbie
- Need stronger found-family bond to earn final wish

OPEN QUESTIONS:
- Did their parents set them up? Did they know each other before the bad date?
- Should Floyd/Daisy relationship have been more substantial?
- Why does her final wish only protect Robbie? (needs earned connection)`,
      aliases: ['Daisy']
    },
    {
      name: 'ALEX CHEN',
      role: 'main',
      description: `Late 20s. Tech entrepreneur whose company is failing (funded by parents).

CORE FLAW: Righteous idealist who's been overcoddled - overestimates himself
ARC: Realizes he's not as competent as he thinks, learns humility and listening
HIS WISH: Truth-vision (can see when people lie)

WHY HE'S CENTRAL:
- Only one (besides June) who can see through Floyd's lies
- Leads the investigation into Floyd's plan
- Represents the audience's journey to truth

KEY SCENE: Uses truth-vision at Hope's Hollow entrance

OPEN QUESTIONS:
- "But they're not your good ideas. They're granted to you" (pg 68) - this isn't true
- How do we further bind him to theme?
- Should Alex free Daisy's genie to convert her?`,
      aliases: ['Alex']
    },
    {
      name: 'ROBBIE GREEN',
      role: 'main',
      description: `13 years old (turns 14 by end). Lost his mother, raised by alcoholic stepfather Ed.

CORE TRAIT: Innate protector with Superman-level empathy
STAKES: "If he goes dark, we all go"
HIS WISH: Become anime hero (Naruto-style powers) - nicknamed "Gokashi"

WHY IS ROBBIE SPECIAL? (needs clarification)
- Why are his powers more special than other superheroes?
- Why does Idea Man put so much belief in him?
- Was he always special? (first act issue that manifests in third act)
- Need to set up his deep understanding of hero lore / his ingenuity

EMOTIONAL CORE:
- Connection to Mom (June) needs to be felt more through Act 2
- First instinct is ALWAYS to protect others
- How he defeats Floyd needs to be more clever than just throwing him

OPEN QUESTIONS:
- Does the wish moment feel too quiet? (in bed, at night, quietly wishes)
- Need emotional response to realizing June and Ed are gone (pg 117)
- Why can Robbie kill Idea Man specifically?`,
      aliases: ['Robbie', 'Gokashi']
    },
    {
      name: 'FLOYD FAUGHN',
      role: 'main',
      description: `The Idea Man. 30s. Founder of Hope's Hollow.

CORE FLAW: Addiction to recognition (not substance, validation)
HIS WISH: Everyone THINKS his ideas are great (NOT that he HAS great ideas)
FATAL FLAW: This distinction is the key to defeating him

BACKSTORY (potential opening montage):
- Child celebrated for his ideas
- Grows into man who is mocked for them
- Publicly humiliated when Daisy rejected his proposal after one month

THE SCOURING:
- Floyd is behind the nuclear-like explosions (not Dougland)
- Killing people to collect unused genies
- Driving refugees to Hope's Hollow

HOPE'S HOLLOW RULES (needs clarification):
- Rules for admission
- Code of conduct
- How the brainwashing works
- Why can Daisy snap out of it when Robbie cannot?

THE REMNANT DAISY:
- Floyd wished for a copy of Daisy
- Lives in secret wing with a wished-for child
- Creepy manifestation of his obsession

OPEN QUESTIONS:
- What idea does the Idea Man represent? How is he hero of his own story?
- Can we show his ideas actually DON'T work? (Alex sees broken shit like THEY LIVE)
- Did Daisy say something more hurtful when declining proposal?
- Floyd realizes late he has no idea how to stop Scouring?`,
      aliases: ['Floyd', 'Idea Man', 'The Idea Man']
    },
    {
      name: 'WILL JENNINGS',
      role: 'main',
      description: `60s. Bartender at The Lampwick. Mysteriously prepared for G-Day.

SECRET REVEAL: He is actually a genie who saved Earth from a PREVIOUS G-Day
            Rewarded by being allowed to live out his life as human
HIS WISH: Protect The Lampwick and everyone inside from all wishes

WHY HE MATTERS:
- Most qualified person to help Daisy stop the Scouring
- His bar is wish-protected and indestructible
- Could be setting for final showdown - only thing left standing

OPEN QUESTIONS:
- How does Will have a genie if he IS a genie?
- Should we age him down if Seth is playing him?
- How do we make his reveal more meaningful in the finale?
- Should he be more specific early about why they should stay inside? (pg 16)`,
      aliases: ['Will']
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SUPPORTING CHARACTERS (6)
    // ═══════════════════════════════════════════════════════════════════════
    {
      name: 'JUNE WILLIAMS',
      role: 'supporting',
      description: `Robbie's deceased mother. 50s. Brought back as a "Remnant" by Ed's wish.

REMNANT RULES: If Ed dies, she vanishes
FUNCTION: Keeps Robbie grounded, group's moral center
PERSONALITY: Loving but slightly "off" - uncanny valley of resurrection

OPEN QUESTIONS:
- Emotional impact of Mom showing up (pg 17) - need better setup
- Need Robbie's emotional response when she's gone (pg 117)
- Can she see through Floyd's lies because she's not fully "real"?`,
      aliases: ['June', 'Mom', 'Robbie\'s Mom']
    },
    {
      name: 'ED MCCRAE',
      role: 'supporting',
      description: `50s. Robbie's alcoholic stepfather. Trying his best but struggling.

HIS WISH: Brings back June (ties his life to hers)
ARC: Stops drinking because if he dies, June vanishes
HEALTH ISSUES: Liver, heart - his death causes June to vanish

OPEN QUESTIONS:
- Seed the "stepfather" reveal earlier (pg 17 men's room opportunity)
- How sick is Ed really? Canoodling → desperately sick feels disconnected (pg 25)
- Is Ed still drinking even though he has a trainer and is fit? (pg 100)
- If Ed is life-threateningly sick, wouldn't Robbie just wish to cure him? (pg 25)`,
      aliases: ['Ed']
    },
    {
      name: 'TIM DEBETHEM',
      role: 'supporting',
      description: `40s. Plumber who came to fix the toilet.

HIS WISH: Accidentally wishes to become a sentient french fry
SACRIFICE: Uses plumbing knowledge to free the genies from wishpool

SHOULD BE MORE DANGEROUS:
- Missing darker human element within the group
- Would make his sacrifice more impactful
- "Think one of them in the group (TIM?) should feel more dangerous"

FRY RULES (needs clarification):
- What does Tim need salt for?
- Does he have a shelf life?
- Do parts of him rejuvenate?

OPEN QUESTIONS:
- Don't understand Tim's wishpool mission or how plumbing saves them
- Did Tim lose his life for nothing? (pg 110 - small print)
- Stop short of Tim saying "decide who is going to wish me back" (pg 22)
- Band moment with Brenda feels broad - why can they stop to play music? (pg 45)`,
      aliases: ['Tim', 'Fry Guy', 'French Fry']
    },
    {
      name: 'BRENDA CHEN',
      role: 'supporting',
      description: `30s. Pregnant woman who didn't really want kids. Star Trek superfan.

HER WISH: USS Enterprise (establish Trekkie identity earlier)
CORE CONFLICT: Michael is constantly choosing for her; she wants to live for herself

THE AFFAIR WITH TIM:
- She kisses Tim during the journey
- Is attraction a vestige of pregnancy craving? (biological imperative?)
- She has valid points about why she's unhappy
- Never expresses valid frustrations to Michael directly

WHAT'S MISSING:
- More complexity to her character (beyond pregnancy swap being broad)
- Michael doesn't really see her for who she truly is
- She needs to share feelings with Michael, he needs to take accountability
- Then they can authentically commit to family

OPEN QUESTIONS:
- "Hooked up" is loose - should she clarify just a kiss? (pg 78)
- When Michael takes baby without consent, doesn't feel like a favor (pg 19)
- Should remaining genies be Brenda's Enterprise crew in Star Trek uniforms? (pg 35)`,
      aliases: ['Brenda']
    },
    {
      name: 'MICHAEL CHEN',
      role: 'supporting',
      description: `30s. Brenda's husband since age 11. Deeply devoted but perhaps too controlling.

HIS WISH: Carries Brenda's pregnancy
FLAW: Constantly making choices FOR Brenda, not seeing her as individual
ARC: Needs to take accountability for how he's contributed to her unhappiness

PREGNANCY PORTRAYAL:
- Feels too broad and stereotypical
- Keep the funny stuff ("goth nipples")
- But add more complexity to his relationship with Brenda

OPEN QUESTIONS:
- Scene pg 77 with Brenda needs to be more honest
- How/where does his water break? (pg 106)
- Brenda committing to family doesn't feel earned (pg 106, 110)`,
      aliases: ['Michael', 'Bunbun']
    },
    {
      name: 'DAISY\'S GENIE',
      role: 'supporting',
      description: `The "Hero Genie" - stays with us from beginning to end.

VOICE: Jennifer Coolidge vibe
FUNCTION: Key to exposition, rules, and emotional connection
RELATIONSHIP: Forms genuine bond with Daisy

WHY SHE'S IMPORTANT:
- Daisy's growth journey is guided by her genie
- Emotional impact when Daisy parts with her at Hope's Hollow
- Even more emotional when Daisy's final wish means saying goodbye
- Alex could use her honesty to convince Daisy she's being lied to

NEEDS DEVELOPMENT:
- Keep her narratively and visually present through second half (currently disappears)
- Invest in her as a character
- She's imprisoned in the wishpool - Daisy eventually saves her`,
      aliases: ['Daisy Genie', 'Hero Genie']
    },

    // ═══════════════════════════════════════════════════════════════════════
    // MINOR CHARACTERS (10)
    // ═══════════════════════════════════════════════════════════════════════
    {
      name: 'WILL\'S GENIE',
      role: 'minor',
      description: 'Voice: Morgan Freeman vibe. Used immediately to protect the bar. First genie to grant a wish. Paradox: Will is a genie with a genie - needs explanation.'
    },
    {
      name: 'ALEX\'S GENIE',
      role: 'minor',
      description: 'Voice: Paul Giamatti vibe. Grants Alex truth-vision wish at Hope\'s Hollow entrance.'
    },
    {
      name: 'TIM\'S GENIE',
      role: 'minor',
      description: 'Voice: John Mulaney vibe. Grants the unfortunate french fry wish.'
    },
    {
      name: 'ROBBIE\'S GENIE',
      role: 'minor',
      description: 'Grants Robbie\'s Naruto transformation wish. Names him "Gokashi" (Goku + Kakashi).'
    },
    {
      name: 'BRENDA\'S GENIE',
      role: 'minor',
      description: 'Voice: Anna Faris vibe. Grants the USS Enterprise wish. Could wear Star Trek uniform.'
    },
    {
      name: 'BEETLEBUG',
      role: 'minor',
      description: 'Female superhero, leader of Megapal Justice Buddies. Only 11 years old. Dies fighting Kaiju in Ohio.',
      aliases: ['Beetle Bug']
    },
    {
      name: 'BLACK MASK',
      role: 'minor',
      description: 'Supervillain leading the Sinister Six Thousand. Fights our heroes in Ohio.'
    },
    {
      name: 'REMNANT DAISY',
      role: 'minor',
      description: 'Floyd\'s wished-for copy of Daisy. Lives in secret wing with a wished-for child. Creepy.',
      aliases: ['Fake Daisy', 'Copy Daisy']
    },
    {
      name: 'CONCIERGE HARPER',
      role: 'minor',
      description: 'Hope\'s Hollow concierge with perfect smile. Represents the haven\'s cult-like conformity.'
    },
    {
      name: 'HEAD LAWYER',
      role: 'minor',
      description: 'Leader of Exactitude, the wish-legal haven. Knows Floyd is behind the Scourings.'
    },
  ],

  themes: [
    // Core Themes
    'The Danger of Wishing Without Thinking',
    'Found Family',
    'What You Wish For vs What You Need',
    'Hope in Chaos',

    // Character-Specific Themes
    'Accountability vs Avoidance (Daisy)',
    'Humility vs Overconfidence (Alex)',
    'Protection & Sacrifice (Robbie)',
    'Recognition Addiction (Floyd)',

    // Relationship Themes
    'Surrogate Parenting',
    'Bodily Autonomy & Choice (Brenda)',
    'Redemption Through Sacrifice (Ed, Tim)',

    // World Themes
    'False Utopias',
    'The Last Wish Wins',
    'Child Heroes & Lost Innocence',
  ],

  ai: {
    styleReferences: [
      'Seth Rogen/Evan Goldberg (This Is The End, Superbad)',
      'The Hangover',
      'Ghostbusters (Original)',
      'Independence Day',
      'Edgar Wright (Shaun of the Dead, Hot Fuzz)',
      'Galaxy Quest',
      'Spy Kids (for four-quadrant family appeal)',
    ],
    toneDescriptor: `Four-quadrant PG-13 ensemble comedy with heart. High-concept fantasy grounded
by relatable character dynamics. Think: "What if This Is The End met Independence Day but was
appropriate for families while still being genuinely funny for adults."`,

    uniqueConstraints: [
      // Rating
      'MUST BE PG-13 - tone down violence and language throughout',

      // Protagonists
      'Daisy and Alex are CO-LEADS - narrative tilts toward them',
      'Robbie is the emotional heart but not the POV character',

      // Villain Rules
      'Floyd\'s wish: people THINK his ideas are good (NOT that they ARE good)',
      'Floyd\'s fatal flaw (recognition addiction) is the key to defeating him',
      'Floyd is behind the Scouring - he\'s collecting genies from the dead',

      // Genie Rules
      'Genies operate as hive mind - can answer any question truthfully',
      'Contradictory wishes cancel each other out',
      'The last wish wins (important for finale)',

      // Remnant Rules
      'Remnants (wished-back people) vanish if their wisher dies',

      // World Rules
      'The Lampwick is wish-protected and indestructible',
      'Will is secretly a genie - this revelation comes at the end',
      'Superheroes were common early but are now rare (hence Robbie\'s value)',

      // Structural
      'Daisy doesn\'t use her wish until the very end',
      'Daisy\'s genie is the "hero genie" - stays with us throughout',
    ],

    customInstructions: `
═══════════════════════════════════════════════════════════════════════════════
8 BILLION GENIES - AI WRITING GUIDANCE
═══════════════════════════════════════════════════════════════════════════════

KEY THEMATIC ANCHORS (from Meeting Notes):

DAISY'S ARC:
  Before: Drifts through life on instinct and avoidance
  After: Learns she is accountable, reasonable, and far more capable than she believes
  Growth: Stepping into responsibility instead of defaulting to chaos

  Her flaw (analysis paralysis) is the INVERSE of Floyd's flaw (acting without thinking)

ALEX'S ARC:
  Before: Righteous idealist who has been overcoddled and insulated
  After: Realizes he overestimates himself and is not as competent as he thinks
  Growth: Humility, listening, and accepting limits

  His truth-vision wish is a moment of GROWTH - choosing to see reality

ROBBIE'S CORE:
  Trait: Innate PROTECTOR with Superman-level empathy
  Instinct: First instinct is to help others, even when it costs him
  Stakes: "If he goes dark, we all go"

  He is the moral compass of the group

FLOYD / IDEA MAN:
  Flaw: Doesn't care about having good ideas
  Desire: Cares about being SEEN as the person who had them
  Defeat: His addiction to recognition is the key to defeating him

  He is the HERO of his own story - he thinks he's saving the world

═══════════════════════════════════════════════════════════════════════════════
GLOBAL STAKES TO TRACK (by time we reach Hope's Hollow):

1. The world has fallen into Chaos
2. Charismatic leaders are rebooting society in "havens"
3. Global arms race to accrue genies
4. Superheroes are now rare (hence Robbie's value to Floyd)
5. The Scouring is destroying everything (Floyd's doing, unknown to world)

Track using: news broadcasts, genie broadcasts, traveler anecdotes, haven commercials

═══════════════════════════════════════════════════════════════════════════════
EXECUTION PRIORITIES:

1. CRITICAL:
   - Global stakes visibility from Act 1
   - Scouring as ticking clock
   - Idea Man's wish mechanics crystal clear
   - Daisy & Alex as clear co-leads
   - Villain plot visible early so heroes can act against it

2. HIGH:
   - Why is Robbie special?
   - Why do they leave the bar? (more urgent than Ed's health)
   - Genie dynamics and rules clarified
   - Will + Lampwick payoff in finale

3. MEDIUM:
   - Act 2A momentum (don't lose drive in Hope's Hollow)
   - Brenda & Michael relationship complexity
   - Harder, more character-based ending
   - Tim's arc and dangerous edge

4. LOW:
   - PG-13 pass on violence/language
   - Line-by-line clarity and continuity cleanup

═══════════════════════════════════════════════════════════════════════════════
FOUND FAMILY DYNAMICS:

The group becomes a family unit. By the end, Daisy's wish must feel EARNED:
- Daisy and Alex as surrogate parents to Robbie
- June as the moral center
- Tim, Brenda, Michael as extended family
- This bond must be VISIBLE and DEVELOPED throughout
`,
  },

  trackingCategories: [
    // Priority Categories
    'CRITICAL - Global Stakes',
    'CRITICAL - Scouring',
    'CRITICAL - Villain Plot',
    'CRITICAL - Daisy/Alex Co-Lead',

    // Character Categories
    'Character Arc - Daisy',
    'Character Arc - Alex',
    'Character Arc - Robbie',
    'Character Arc - Floyd',
    'Character Arc - Other',

    // Story Categories
    'Genie Rules',
    'Theme',
    'Found Family',
    'Setup',
    'Payoff',

    // Production Categories
    'Comedy',
    'Action',
    'PG-13 Flag',

    // Issue Tracking
    'OPEN QUESTION',
    'PAGE NOTE',
    'NEEDS CLARIFICATION',
  ],

  noteAuthors: [
    'RR',      // Rodney Rothman
    'AMZN',    // Amazon
    'PG',      // Point Grey / Counter Culture
    'ANALYSIS' // Deep analysis notes
  ],

  meta: {
    version: '3.0.0',
    author: 'Rodney Rothman',
  },
};

// =============================================================================
// PAGE NOTES COMPILATION - AMAZON & POINT GREY
// =============================================================================

export const PAGE_NOTES = {
  amazon: {
    'p.12': 'Love showing the dangers/limitations of the wishes in such a fun way.',
    'p.16': 'Maybe Will can be a little more specific about why they might want to stay inside the bar?',
    'p.19': 'Brenda tells us later she didn\'t want a child but in this moment Michael feels like he\'s robbing her of something, not doing her a favor.',
    'p.24': 'Can they look out the windows more? Showing danger outside would explain why they take so long to leave.',
    'p.25': 'How sick is Ed? If life threatening, wouldn\'t Robbie just wish to cure him?',
    'p.32': 'Would it be better if Robbie hits Daisy\'s flaw (e.g. "I know it\'s a big decision--") and that\'s what makes her go?',
    'p.32-b': 'Should we identify Brenda as a Trekkie from the start so Enterprise wish doesn\'t come out of nowhere?',
    'p.35': 'Maybe the remaining two Genies act as Brenda\'s crew here and wear iconic Star Trek uniforms?',
    'p.36': 'What does Tim need the salt for? Can we shore up Tim\'s "fry rules" more? Shelf life? Rejuvenation?',
    'p.45': 'Does electrocution kill these vampires?',
    'p.45-b': 'Is Brenda\'s attraction to Tim a vestige of pregnancy craving? Biological imperative to excuse infidelity?',
    'p.58': 'Wish protected bus feels convenient and lowers stakes. Think about where Scouring is relative to everything.',
    'p.62': 'Deal is 2 genies for 5 people but group only has 1. Floyd alerted to Daisy\'s presence? Uses this to separate group?',
    'p.65': 'Group loses narrative drive once they reach HH. Consider cutting to June/Ed/Michael arrival and skip settling in.',
    'p.68': '"But they\'re not your good ideas. They\'re granted to you." - Not true. There IS an art to making good wishes.',
    'p.81': 'Tim/Michael/Brenda love triangle shouldn\'t be focus when fate of world at stake.',
    'p.83': 'If first meeting with Exactitude happens earlier, can lay out global stakes and learn about Scouring.',
    'p.90': 'Didn\'t Robbie kill supervillains earlier?',
    'p.91': 'Dinner scene feels too small and divorced from global stakes we\'re trying to maintain.',
    'p.99': 'Very R-Rated fight.',
    'p.103': 'How do Daisy and Alex know Floyd killed Ed? How does the spell "shatter" for everyone?',
    'p.106': 'How does Michael\'s water break?',
    'p.107': 'Tough sell to say Floyd is "killing" genies. Their reason for being is to grant wishes.',
    'p.111': 'Why didn\'t Floyd wish stupidity on Exactitude lawyers from the get go?! More inventive battle wishing needed.',
    'p.113': 'We love that Floyd transfers the genie back to Daisy in a fit of pique – daring her to make a decision.',
    'p.114': 'Wishing for Robbie\'s safety feels too small if fate of world is at stake.',
  },
  pointGrey: {
    'pg.10': 'Do we need to explain how Will was able to get his own genie, if he too is a genie?',
    'pg.17': 'Seed Ed as Robbie\'s stepfather sooner. Opportunity when Ed talks to himself in Men\'s Room.',
    'pg.17-b': 'Not sure if we get emotional impact from Mom showing up - may need to look at setup.',
    'pg.19': 'Brenda being this ok with Michael taking baby feels too easy. Layer in more hesitation/mixed feelings.',
    'pg.22': 'Stop short of Tim saying "decide who is going to wish me back" - makes it more tense.',
    'pg.25': 'Ed and June canoodling behind sheet then he\'s desperately sick? How bad is he really?',
    'pg.27': 'Deal doesn\'t make sense - 1 genie gets 3 friends in and 2 gets 5? Clarify.',
    'pg.27-b': 'ALEX line "Jesus, Daisy! Maybe don\'t terrify the kid?" - Is this supposed to be Daisy\'s Genie speaking?',
    'pg.45': 'Band moment between Brenda & Tim feels broad. Why can they stop and play music?',
    'pg.50ish': 'Yearning for them to talk about what they think the Hollow will be like. Get their perspectives.',
    'pg.62': 'Should there be consequence for only having one genie? Floyd tells Alex they have to live in shitty place?',
    'pg.69': 'When did we skip to 8 months? Perhaps typo for 8 weeks?',
    'pg.71': 'Seems too easy how Idea Man gets them to part with genie and sign tablet.',
    'pg.77': 'This scene between Brenda and Michael could get more honest. Chance to hash things out.',
    'pg.78': 'Should Brenda tell Michael she only kissed - it wasn\'t sex. "Hooked up" is loose.',
    'pg.100': 'Is Ed still drinking, even though he has a trainer and is generally fit?',
    'pg.106': 'How/where did his water break?',
    'pg.109': 'Why does Floyd not want to release the wishpool genies to fight the War genies?',
    'pg.106-110': 'Brenda rising to deliver baby and commit to family doesn\'t feel earned.',
    'pg.110': 'How exactly did they beat Exactitude? Did they have enough genies? Did Tim die for nothing?',
    'pg.114': 'Don\'t buy that Daisy would make wish that only protects Robbie. Bond not strong enough. "Okay" not specific enough.',
    'pg.117': 'Want emotional response to Robbie coming to and realizing June and Ed are really gone.',
  },
};

// =============================================================================
// OPEN QUESTIONS MASTER LIST
// =============================================================================

export const OPEN_QUESTIONS = {
  critical: [
    'Why is Robbie special? What makes his powers different from other superheroes?',
    'How does Floyd\'s brainwashing work? Why can THIS group snap out of it?',
    'Why is Robbie ULTRA brainwashed when others can break free?',
    'How does Daisy\'s final wish stop the Scouring if it only protects Robbie?',
    'How is Floyd defeated using his "recognition addiction" flaw?',
    'What is the mechanism by which Tim\'s plumbing knowledge frees the genies?',
  ],
  high: [
    'How does Will have a genie if Will IS a genie?',
    'What makes them leave the bar? (needs more urgency than Ed\'s health)',
    'What are the complete rules of Hope\'s Hollow admission?',
    'How can genies be imprisoned when they flit in and out of existence?',
    'Does Floyd realize he can\'t actually stop the Scouring with his bad ideas?',
  ],
  medium: [
    'Is 8 weeks in the bar too long? Should it be shorter?',
    'Should Floyd and Daisy have had a more substantial/uglier relationship?',
    'Did Daisy and Alex know each other before the failed date?',
    'Is Brenda\'s attraction to Tim a pregnancy craving vestige?',
    'Should one of the group (Tim?) be more dangerous?',
    'Does Robbie\'s wish moment feel like enough of a "movie moment"?',
  ],
  low: [
    'Should we age Will down if Seth is playing him?',
    'Should remaining genies wear Star Trek uniforms on the Enterprise?',
    'What exactly does Tim need salt for as a fry?',
  ],
};

export default config;
