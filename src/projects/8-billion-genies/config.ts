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

// =============================================================================
// REWRITE GOALS - MASTER TRACKING TABLE
// =============================================================================
// Status Key: 🔴 REBREAK/NOT ADDRESSED | 🟡 POLISH | 🟠 REWORK

export type RewriteStatus = '🔴 REBREAK' | '🟡 POLISH' | '🟠 REWORK';
export type RewritePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RewriteGoal {
  id: string;
  goal: string;
  actsAffected: string[];
  priority: RewritePriority;
  status: RewriteStatus;
  passType?: string;
  sources: string[];
  concreteNextMove: string;
  currentDraftHandling: Record<string, string>;
  implementationNotes: string;
  whatsStillOff: string;
  parentItem?: string;
  subItems?: string[];
}

export const REWRITE_GOALS: RewriteGoal[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CRITICAL PRIORITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'idea-man-theme',
    goal: 'Idea Man Theme & Presence (Floyd)',
    actsAffected: ['All', 'esp. 1 & 2'],
    priority: 'CRITICAL',
    status: '🟡 POLISH',
    sources: ['Amazon p.3–4', 'PG/CC p.1'],
    concreteNextMove: `CUT the "Secret Wing/Clone" sequence. REPLACE it with a "War Room" where Floyd is coldly calculating acceptable losses. Emphasize ego, control, and his self-mythologizing—his belief that he is the exceptional one making hard choices for the greater good.
Replace the secret wing/clone run with a "war room" that visually lays out Floyd's Scouring math and VIP selection logic.
Sharpen his dialogue so he's obsessed with being remembered ("They'll know who saved them") not just with control.
Re-engineer his defeat so he loses specifically because he must take public credit, exposing his lie or overplaying his hand.`,
    currentDraftHandling: {
      'first-half': 'Need to look at this more closely for little touches that tee Idea Man up and keep his themes alive',
      'p.67': 'Justification of them getting let in. (guard can be more confused or we can justify another way)',
      'p.70-75': 'Floyd can play as a benevolent savior rather than a defensive villain.',
      'p.73': "Alex's Truth Vision shows a green check over Floyd; he believes his own lies and the seduction works.",
    },
    implementationNotes: `Simplify & front-load the key rule about Floyd: "His wish doesn't make his ideas good; it makes people believe they're good." Then:
1) show early micro-examples of bad-but-compelling Floyd ideas paying off and backfiring;
2) decide the minimum necessary techno-politics (e.g., pick 2: Hope's Hollow, Exactitude, Dougland) and give each a clear, differentiated function;
3) reframe the treaty and scouring plan into a cleaner villain line like "I'm going to force everyone's last wish into my hands."
Make the Hope's Hollow tour, museum, and dinner all covertly dramatize the same core thing: Floyd's ability to hijack consent.
- Opening montage: Floyd as "child genius" → mocked, sidelined adult
- Clarify theme: Floyd doesn't care about HAVING good ideas, only about being recognized as the person who had them
- Add more HH commercials / billboards in Act 1 as an extension of Floyd's ego and worldview
- Clarify HH rules (admission, brainwashing, what it offers, why Daisy can snap out of it)
- HH should reflect Floyd's priorities and shortcomings: branding, messaging, hierarchy`,
    whatsStillOff: `Pg 109: The "Sex Clone" / Remnant Daisy sequence is still present. This reframes Floyd from a "Misguided Messiah" into a creepy pervert and drags the tone back toward Point Grey comedy instead of sophisticated Act 2 villainy.
Floyd still reads closer to a generic tech messiah than a recognition-addicted Idea Man.
The "secret wing / sex-clone" material pulls him toward one-off Point Grey absurdity instead of a sophisticated, scary villain.
HH rules/brainwashing logic are still hazy, which blurs his worldview`,
  },
  {
    id: 'robbies-specialness',
    goal: "Robbie's Specialness",
    actsAffected: ['1', '2B', '3'],
    priority: 'CRITICAL',
    status: '🟡 POLISH',
    sources: ['Amazon p.4', 'Meeting notes', 'PG/CC p.1'],
    parentItem: 'Daisy & Alex as Co-Protagonists',
    concreteNextMove: `Rewrite Pg 33 so Robbie's wish visibly crosses a line: the fireball should blow the roof off the Lampwick, disintegrate a wall, or otherwise demonstrate "weapon-grade" power that legitimately terrifies June and the others into leaving.`,
    currentDraftHandling: {
      'p.1': "Robbie's age changed to 13.",
      'p.1-31': "Want to look for clear ways to really set up Robbie's specialness. If we do the change to how Robbie makes his wish (in the moment) then it should be teed up so it doesn't feel rushed/out of nowhere.",
      'p.33': 'His line about "Hope\'s Hollow is real" is good but can be expanded to express his specialness and special POV even more.',
      'p.35-37': "Look at June's defining of his specialness. (maybe put it all in the second part)",
      'p.71': "Robbie's \"Soul Blades\" demo for Floyd is visually strong and showcases raw power.",
      'p.75': 'Added connection between Floyd and Robbie — but is it unclear that Floyd maybe already knows who they are?',
      'p.80': "How soon until Alex calls out that these seem like a bad idea's person of a good idea? How long until he expresses his goal out loud?",
      'p.84': 'Can fine tune Floyd moment of outreach to Robbie in school',
    },
    implementationNotes: `Track Robbie with three clear phases:
(1) Escapist power fantasy,
(2) weaponized / dissociated,
(3) reclaimed self.
Give 1–2 small, human choices in each phase: e.g., an earlier moment where he refuses to hurt someone → Floyd's pressure → the exact choice where he knowingly crosses that line at Exactitude.
After Daisy's wish, give him a quiet beat post-Floyd where he actively chooses to be a kid again (or chooses responsibility in a non-magical way) so the guilt has time to metabolize into growth.
- ADD: Scene where June/Ed tell Daisy Robbie is a protector and why that matters
- Emphasize his instinct to help people (inherent + learned from his life circumstances)
- Give him Superman-level empathy: he feels responsible for others' safety
- Floyd recognizes Robbie as "one in a million" and projects his own exceptionalism onto him
- Consider withholding Robbie's wish until the end for emotional and mystery payoff
- Consider aging him back down to 13 (casting dependent, but thematically stronger)`,
    whatsStillOff: `Pg 33: The Act 1 transformation is still essentially copy-pasted from Draft 06. The fireball simply ricochets off a shelf instead of reading as weapon-grade power. It does not feel dangerous enough to force them out of the bar or justify June's fear.
His initial wish/Act-1 transformation still reads as "cool spectacle" more than a truly alarming "if he goes dark, we all go" moment.
Floyd doesn't clearly articulate Robbie as "one in a billion" mirror of his own exceptionalism.
The timing/shape of Robbie's wish isn't being fully exploited for mystery/payoff.`,
  },
  {
    id: 'daisy-alex-co-protagonists',
    goal: 'Daisy & Alex as Co-Protagonists',
    actsAffected: ['All'],
    priority: 'CRITICAL',
    status: '🟡 POLISH',
    sources: ['Amazon p.4', 'Meeting notes'],
    subItems: ['clarify-daisy-arc', 'clarify-alex-arc', 'clarify-daisy-alex-relationship', 'robbies-specialness'],
    concreteNextMove: `Refine Act 3 so Alex actively uses the Truth Wish to diagnose Robbie's corruption earlier and more precisely. The Truth Wish should be a tool in the climax, not just a past inciting device.`,
    currentDraftHandling: {
      'p.65': "Alex's Truth Wish launches the investigation.",
      'p.92': 'Alex spots the green-check glitch.',
      'p.94': 'Alex\'s line "That\'s not my son" lands strongly.',
    },
    implementationNotes: '',
    whatsStillOff: 'Co-protagonist dynamic is working overall; remaining issue is maximizing use of the Truth Wish in the finale mechanics rather than structure.',
  },
  {
    id: 'global-stakes-scouring',
    goal: 'Global Stakes / Track the Scouring',
    actsAffected: ['All', 'esp. 1 & 2A'],
    priority: 'CRITICAL',
    status: '🟡 POLISH',
    sources: ['Amazon p.2–3', 'PG/CC p.1'],
    concreteNextMove: `Might improve the clock: give a simple recurring frame ("three Scourings left," "x hours until it hits us") across news, Floyd's briefings, and hero dialogue. Ensure every Act-2 timecard and Scouring reference uses that same framework so global stakes feel unified and easy to track.`,
    currentDraftHandling: {
      'p.1-30': "Look for little ways to tee up idea of stakes and even the TV so that it doesn't come out of nowhere. Can look at beginning of 8 weeks later, and prior genie rules scene. Can look at really teeing up that it's not great there and they're thinking about leaving even before?",
      'p.30': 'Breaking News segment where Reporter Barbara is vaporized by an orange blast. (Tweak this — exposition can be hidden a bit more?)',
      'p.30-61': 'In 2A — read looking for little ways to keep the stakes alive. Maybe people are talking about the scouring to them.',
      'p.61': 'The Scouring visually chases the bus in Act 2. NEED TO CALL THIS OUT',
      'p.70s': 'When they meet Floyd he can talk about it more explicitly',
      'p.89': 'Floyd explicitly mentions Scouring weaponization by Dougland',
      'p.100': "Floyd lays out plan more explicitly to Daisy — he's getting genies to come to him so he has every remaining genie — through the scouring",
      'p.118': 'Stakes reasserted in all is lost moment after genies are defeated.',
    },
    implementationNotes: `- Seed news broadcasts throughout, tracking the Scouring's movement and timing
- Establish the Scouring as an immediate, concrete threat before they leave the Lampwick
- Show various habitat commercials (not just HH) to imply global response
- Make chaos and danger outside the bar visceral (violence, near-misses, environmental damage)
- Use the Scouring as a ticking clock through the entire second half`,
    whatsStillOff: `None. The threat is now visible, immediate, and cinematic. It successfully motivates the exit from the bar.
Clock language and geography can still be a touch fuzzy; the audience has to infer how Scouring timing, HH's schedule, and Floyd's plan interlock.`,
  },
  {
    id: 'ending-too-easy',
    goal: 'Ending – Too Easy',
    actsAffected: ['3'],
    priority: 'CRITICAL',
    status: '🔴 REBREAK',
    sources: ['Amazon p.7–8', 'PG/CC p.2'],
    concreteNextMove: '',
    currentDraftHandling: {
      'p.118': 'Stakes reasserted in all is lost moment after genies are defeated.',
      'note': "Don't they want us to change the thrown into the moon thing?",
    },
    implementationNotes: `- Make the final resolution feel more difficult and hard-won
- Clarify Tim's plumbing maneuver so the audience can track cause and effect
- Give Robbie a more clever, character-based way to beat Floyd than "just throwing" something
- Use Floyd's fatal flaw: his need to be recognized as Idea Man is the key to turning the tables
- Daisy's final wish must be bigger than just Robbie, specific enough to feel clever and emotionally inevitable
Treat the climax like a heist: in the rewrite, quietly set up each "move" before it happens (Tim explaining water hammer earlier in bar; a visual of shield/counter-wishes; an earlier near-abuse of the legal wish-ownership trick) and make sure the emotional beat is always foregrounded above plot business: Daisy's paralysis → wish choice; Robbie's internal war → turn; Tim's sacrifice → payoff of his insecurity; Michael/Brenda re-bonding over birth.
In action description, simplify language around genies' dueling wishes so we're never parsing jargon while we should be feeling.`,
    whatsStillOff: `Cause-and-effect in the climax is hard to follow; the water-hammer move feels improvised rather than planned.
Robbie's win is mostly brute force, not character-clever.
Floyd's defeat doesn't hinge on his Idea Man flaw (need for recognition).
Daisy's wish reads more generalized than "clever and inevitable."`,
  },
  {
    id: 'clarify-daisy-arc',
    goal: "Clarify Daisy's Character Arc and its Importance",
    actsAffected: ['All'],
    priority: 'CRITICAL',
    status: '🟡 POLISH',
    sources: [],
    parentItem: 'Daisy & Alex as Co-Protagonists',
    concreteNextMove: '',
    currentDraftHandling: {
      'p.1': 'Brings it out more in opening Floyd date.',
      'p.6/8': 'More character defining opportunities during their fight',
      'p.22': "Tracking that Daisy's Genie is kinda like her. We can call this out more subtly, even before Alex does.",
      'p.27': 'Might be an opportunity to hit Daisy character harder, define the way she avoids people. The Alex fight and Robbie conversation.',
      'p.30-36': "Look for tweaks to really convey Daisy's character.",
      'p.38': "June's send off and asking of them to take care of Robbie could include slightly more pointed assessment of who they are/where they are in their lives.",
      'p.67': "She's let in…why",
      'p.72': "Genie — you let this guy go?! She can convey a reason from her character.",
      'p.97': 'Added Daisy seeing a weird damaged genie — not sure yet if we keep!',
    },
    implementationNotes: `Build Daisy's arc as the moral spine of the movie:
1) Early: show concrete non-apocalypse examples of her bailing (family, work, relationships) so we feel the pattern.
2) Mid: dramatize how and why Floyd's version of commitment (safety, status, being "chosen") specifically appeals to her shame about being flaky.
3) Late: structure the Wish scene as a clear choice between several very good selfish options (her own safety, power, Floyd's offer) vs the scary, selfless "Robbie's okay" wish.
Make the beat where she can't decide painful, not just banter.`,
    whatsStillOff: '',
  },
  {
    id: 'clarify-alex-arc',
    goal: "Clarify Alex's Character Arc and its Importance",
    actsAffected: ['All'],
    priority: 'CRITICAL',
    status: '🟡 POLISH',
    sources: [],
    parentItem: 'Daisy & Alex as Co-Protagonists',
    concreteNextMove: '',
    currentDraftHandling: {
      'p.1-34': 'Look for little tweaks to really sell the character.',
      'p.34': "Alex goes - can this be teed up more. Make him more civic lesson-y, shame everyone.. (should June tee it up a bit more?).",
      'p.38': "June's send off and asking of them to take care of Robbie could include slightly more pointed assessment of who they are/where they are in their lives.",
      'act-2a': 'Tracking needed',
      'act-2b': 'Need to better track him as a co-protagonist and track his wish and active nature.',
    },
    implementationNotes: '',
    whatsStillOff: '',
  },
  {
    id: 'clarify-daisy-alex-relationship',
    goal: 'Clarify Daisy + Alex Relationship and them as Co-Protagonists',
    actsAffected: ['All'],
    priority: 'CRITICAL',
    status: '🟡 POLISH',
    sources: [],
    parentItem: 'Daisy & Alex as Co-Protagonists',
    concreteNextMove: '',
    currentDraftHandling: {
      'initial-date': 'Can make sure we are defining them well/setting them up as a "couple." In fight too.',
      'second-bathroom-fight': 'Can do things to define them as a couple, including other people noticing.',
      'reading-scene': 'When he comes out, reads book — keep them connected. This scene is really establishing THE THREE.',
      'leaving-fight': "When Alex presses Daisy to come - can look for little ways to communicate this? Why does he care if she comes, they hate each other, etc.",
      'p.38': "June's send off could include slightly more pointed assessment of their relationship thus far, all the stupid fighting they've done. (Can make it more of a shared Alex/Daisy promise to her and re-assert \"the three.\")",
      'p.38-42': 'Can do little tweaks to frame the Enterprise sequence and thereabouts through the Alex/Daisy/Robbie trio.',
      'act-2a': "Can frame some of their arguments through the lens of the promise they made to June to rise to the moment/get along. Others present (and Genies) can weigh in on that.",
    },
    implementationNotes: '',
    whatsStillOff: '',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HIGH PRIORITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'the-genies',
    goal: 'The Genies',
    actsAffected: ['All'],
    priority: 'HIGH',
    status: '🟡 POLISH',
    passType: 'Genies Rules Pass',
    sources: ['Amazon p.6', 'Meeting notes', 'PG/CC p.2'],
    subItems: ['genies-rules-pass'],
    concreteNextMove: `LOCK IT. Preserve Daisy's emotional-support genie, the Genie Spa payoff, and the Genie Vest button.`,
    currentDraftHandling: {
      'p.11-16': 'We can intro the whole concept, that they all have personalities, etc; then identify the genie. Should RECAST some so a bit younger-skewing. There\'s an opportunity to delightfully stunt cast even genies that have one line.',
      'p.22': "Tracking that Daisy's Genie is kinda like her.",
      'p.27': "More tracking with Daisy + Alex's genie — can hit harder.",
      'p.64': 'Daisy\'s genie plays as an "emotional support" alter ego.',
      'p.65': 'When Alex\'s genie gets wished away — feels like should be a bigger deal since we know them. For any genie we\'ve gotten to "know."',
      'p.117': 'The "Genie Spa" payoff lands.',
      'p.121': 'The "Genie Vest" moment is a nice added visual.',
      'p.119': 'Daisy/Genie reunion should be more emotional…what else?',
    },
    implementationNotes: `- Daisy's Genie: A "hero genie" with a Taylor Tomlinson / Jennifer Coolidge energy, shit-talker like Daisy, but emotionally attuned
- Alex's Genie: Nothing like him (downer, critical); Alex insists they're nothing alike while everyone else says they're exactly alike
- Keep genies visually and vocally present throughout, not just in set pieces
- Clarify genie rules: imprisonment, wish transfer, hive-mind knowledge, ability to comment on global events
- Use genies for exposition and to track world changes in a fun, character-based way
- Let Daisy's relationship with her genie grow, reflecting her internal arc`,
    whatsStillOff: 'None called out. Genies are playing as intended visually and thematically in these beats.',
  },
  {
    id: 'will-bar-payoff',
    goal: 'Will & The Bar Payoff',
    actsAffected: ['3'],
    priority: 'HIGH',
    status: '🔴 REBREAK',
    sources: ['Amazon p.5–6', 'PG/CC p.2'],
    concreteNextMove: '',
    currentDraftHandling: {},
    implementationNotes: `- Reveal that Will is a genie from a previous G-Day who chose to stay in human form
- Make him the most qualified person to help stop the Scouring (secret history, scars, regrets)
- Stage the final showdown inside the indestructible Lampwick, paying off everything we've set up about the bar
- Use Will's specific knowledge and past failures meaningfully in the climax`,
    whatsStillOff: '',
  },
  {
    id: 'leaving-lampwick',
    goal: 'Leaving the Lampwick',
    actsAffected: ['End of Act 1'],
    priority: 'HIGH',
    status: '🟡 POLISH',
    sources: ['Amazon p.4–5', 'PG/CC p.1'],
    concreteNextMove: `Fix the timeline: change the Pg 26 title card to "8 MONTHS LATER" and ensure dialogue across the script matches that timing so pregnancy and city infrastructure feel credible.`,
    currentDraftHandling: {
      'p.32': 'Scouring commercial helps justify leaving the Lampwick.',
      'p.34': "Ed's health provides added urgency.",
    },
    implementationNotes: `- Make the outside danger immediate and visceral at the threshold (someone almost killed, near-fatal moment)
- Give the group a stronger collective reason to leave than "Ed's health" alone
- Consider dwindling supplies + Scouring's approach as real pressure
- Justify the "8 weeks inside" timeline more clearly, or shorten it to something that feels urgent and believable`,
    whatsStillOff: `Pg 26 vs Pg 73 timeline clash. Title card reads "8 WEEKS LATER" while dialogue references "8 MONTHS," breaking pregnancy and city-build reality.`,
  },
  {
    id: 'villain-plot-visible-earlier',
    goal: 'Villain Plot Visible Earlier',
    actsAffected: ['2A', '2B'],
    priority: 'HIGH',
    status: '🔴 REBREAK',
    sources: ['Amazon p.5', 'PG/CC p.1'],
    concreteNextMove: `Surface Floyd's plan in early/mid-2A via visuals (Scouring models, population boards, VIP criteria) and incomplete explanations from him.
Give Alex a concrete investigative goal ("prove the numbers are wrong," "find the missing people") and an early win to hook us.
Let Daisy/Alex articulate a simple counter-plan before Act 3 (e.g., expose Floyd's lie and re-route the Scouring), so we're tracking a genuine cat-and-mouse`,
    currentDraftHandling: {},
    implementationNotes: `- Make Floyd's master plan readable by early Act 2 (even if not fully explained)
- Give heroes a proactive counter-plan once they understand his intent
- While others are brainwashed in HH, Alex investigates the inconsistencies and clues
- Alex frees Daisy's genie to help break Daisy out of HH control
- Build a genuine mystery to uncover around the Scouring and Floyd's real objective
- In Act 3, Floyd realizes too late he cannot actually control or stop the Scouring`,
    whatsStillOff: `Floyd's actual objective (weaponizing the Scouring to curate a "worthy" remnant) doesn't snap into focus until very late.
The heroes stay largely reactive; they lack a clear, proactive counter-plan in 2B.
Mystery elements (green checks, immunity, timing) aren't yet braided into one central investigative engine.`,
  },
  {
    id: 'immunity-rules',
    goal: 'The "Immunity" Rules (Daisy/Alex)',
    actsAffected: ['Act 2', 'Act 3'],
    priority: 'HIGH',
    status: '🟡 POLISH',
    sources: ['Draft 06 vs Draft 07 comparison', 'scanner scene around Pg 66'],
    concreteNextMove: `Restore a specific line in the Pg 66 scanner scene that flags a "glitch" or "genetic anomaly" in Daisy. This breadcrumb must clearly set up why she can resist/defeat Floyd's brainwashing in Act 3.`,
    currentDraftHandling: {
      'p.96': 'Daisy resists the brainwashing at dinner.',
      'p.66': 'Scanner scene establishes she is "Unused."',
      'p.80': "How soon until Alex calls out that these seem like a bad idea's person of a good idea? How long until he expresses his goal (and awareness about his wish as a possible immunity rule) out loud?",
      'p.103': "Daisy is brainwashed and we make a thing out of it — but then it's \"broken\" by Remnant Daisy — is the logic clear enough around how that happens (the breaking), why it works for Daisy before others, etc?",
    },
    implementationNotes: `Clarify why Daisy is immune to Floyd's brainwashing and how this pays off in Act 3.
Restore or invent a single explicit rule in the scanner scene that flags Daisy as different (anomaly, glitch, unclaimed wish, etc.).
Echo that rule later when she breaks HH conditioning and again in the finale, so her final act feels rule-consistent, not hand-of-writer.
Clarify in dialogue how Alex's Truth Wish complements this (he can see truth but isn't fully immune), so together they form the necessary combo.`,
    whatsStillOff: `Cause-and-effect in the climax is hard to follow; the water-hammer move feels improvised rather than planned.
Robbie's win is mostly brute force, not character-clever.
Floyd's defeat doesn't hinge on his Idea Man flaw (need for recognition).
Daisy's wish reads more generalized than "clever and inevitable."`,
  },
  {
    id: 'genies-rules-pass',
    goal: 'Genies Rules Pass',
    actsAffected: ['All'],
    priority: 'HIGH',
    status: '🟠 REWORK',
    sources: [],
    parentItem: 'The Genies',
    concreteNextMove: `— Maybe visualize rules and call them back a bit more.
— tie "contradictory wishes cancel each other out" explicitly Floyd's auto-counter system when it happens — call it back.

Shields/havens — visualize — Consider a tiny visual cue: when he wishes, the bar gets a thin shimmering outline for a second. Any outside genie effect that "touches" the walls fizzles with a consistent effect (like rain hitting an invisible umbrella).

Enterprise: when Brenda powers up, the ship's field looks like a scaled-up version of the bar outline. When lasers hit, they either bounce off or crack it.
Hellstorm: when the Scouring wave hits, show the same outline hugging the bus; the wave passes, outline flickers, but holds.

Payoff: Hope's Hollow
• The dome should visually be the same language as bar → Enterprise → Hellstorm, just at city scale.
• When Scouring is discussed, use holograms that clearly show why only wish-protected stuff survives.

Rename "Wish lock" so less a "thing"

Make clearer why Daisy doesn't quite fall for Floyd? (entry scene)

3.3 Wish ownership / Wishpool
Setup: Entry to Hope's Hollow
• Make the terms of transfer extremely clear:
    ◦ On the scanner screen for Daisy, instead of obscure "GENETIC ANOMALY," show:
        ▪ "WISH STATUS: UNUSED → TRANSFER REQUESTED (HH COLLECTIVE). CONFIRM?"
    ◦ Concierge: "To live here, you agree your genie serves the greater good of Hope's Hollow."
    ◦ Daisy taps "Accept" on the tablet. Genie screams as its essence is drawn.
• Show genies visibly flowing along conduits toward the fountain, so the audience understands the pool is literally everybody's wishes.
Echo: Idea Man confession
• When Floyd says "I asked if it'd be alright to take your wish," intercut quick flashes of multiple arrivals signing that same transfer screen.
• When he gives Daisy her wish back, reverse the VFX: a strand of light peels off the Wishpool, zips into her genie.
Payoff: War room + final
• In the war room, the holo should show remaining stored genies as a gauge that ticks down during the battle.
• When the Wishpool explodes (Tim's water hammer), we see genies re-attaching to owners all over Hope's Hollow.
This makes the climax clearly "we freed the hostages (wishes), not 'new genies suddenly exist.'"

3.4 Remnants
Setup: Abe Lincoln / Jim Morrison sequence
• Daisy's genie explicitly defines "remnants" and "if the wisher dies, the remnant goes." You already have that.
• Make the visual of Jim exploding and the remnant dust very distinct: white-blue "remnant dust" that's different from regular death.
Echo: June
• When June appears, give her a subtle remnant aura (same dust faintly clinging to her).
• When she fades as Ed dies, use the exact same visual as Jim's disappearance, but in slow, emotional mode.
Payoff: Remnant Daisy
• When Daisy and Alex find "wife Daisy," give her the same remnant aura so the audience knows instantly: "She's a clone, not the OG."
• When they kill her, her death should be physical + remnant dust, tying all three examples together.

Look at wording of Daisy's Robbie wish. Maybe "Make Robbie himself again" or "Give Robbie a choice."`,
    currentDraftHandling: {},
    implementationNotes: `Do a rules pass:
1) List every genie rule & exception; decide which ones matter for story stakes;
2) Combine / cut edge cases that only appear once;
3) Introduce each dramatically once as setup before payoffs (e.g., show a small-scale conflicting-wishes cancellation long before the War Genies vs shield), and echo key mechanics in visual form (e.g., same graphic language anytime a counter-wish triggers);
4) Make sure Daisy's final wish and Robbie's final act are clearly operating on previously-seen rules, not new ones.`,
    whatsStillOff: '',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDIUM PRIORITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'brenda-michael-complexity',
    goal: 'Brenda & Michael – Complexity',
    actsAffected: ['2', '3'],
    priority: 'MEDIUM',
    status: '🟡 POLISH',
    sources: ['Amazon p.7', 'PG/CC p.1–2'],
    concreteNextMove: `Rebuild the confrontation so it's primarily about betrayal and agency (Michael making choices for Brenda).
Clarify "hooked up" in PG-13-safe language so the emotional stakes are concrete.
Give Michael one clear accountability beat (naming how he's steamrolling her) and let Brenda recommit only after that, so their resolution feels earned.
Rewrite Pg 98 so the confrontation centers on betrayal, fear, and unmet expectations instead of slapstick. The scene should peak in emotional clarity and vulnerability, then resolve in a hug, not a headbutt.`,
    currentDraftHandling: {
      'p.19': "Brenda says she never wanted to bring kids into world. Can we soften/adjust this?",
      'between': 'When Brenda leaves → Tim hookup — look for little ways to get this story across, get across her energy so the hookup feels teed up.',
      'p.58': "Brenda's monologue about not wanting kids is strong.",
      'p.77': "Brenda and Michael's reunion plays sweet.",
      'p.114': 'Brenda and Michael payoff — she says she was "scared to bring a child into the world."',
    },
    implementationNotes: `- Make Michael's pregnancy experience less stereotypical, more specific and emotionally complex
- Clarify Brenda's frustration: Michael keeps deciding for her instead of with her
- ADD: Scene where Brenda directly articulates her valid frustrations to Michael
- Give Michael a moment of genuine accountability and change
- Earn Brenda's recommitment to the family (currently feels unearned around p.106–110)
- Clarify what "hooked up" means (vs. just kissing) to avoid tonal confusion

Clarify this as the "what does real partnership look like?" storyline:
1) Make the transfer wish clearly mutual or clearly not—that ambiguity is powerful if owned;
2) Ensure Brenda's "Rumspringa" choice is rooted in a specific fear/need that connects to the larger theme, not generic boredom;
3) Give Michael a real moment of non-jokey agency in forgiving (or not) Brenda/Tim;
4) Tie Tim's final pipe sacrifice and the birth beat so that his arc is "from shitty plumber to spiritual plumber" and Michael/Brenda's is "from fantasy of perfect partner to reality of flawed, chosen family."`,
    whatsStillOff: `Pg 98: The fight with Tim reads as slapstick—"chunks of french fry flying"—rather than emotionally grounded conflict about betrayal, fear, and their relationship.
The confrontation with Tim/Michael leans into broad slapstick, undercutting the emotional stakes.
What "hooked up" means remains unclear, which muddies the betrayal.
Brenda's recommitment feels a bit too easy—Michael doesn't fully own how he's been deciding for her.`,
  },
  {
    id: 'tim-character-sacrifice',
    goal: 'Tim – Character & Sacrifice',
    actsAffected: ['1', '2', '3'],
    priority: 'MEDIUM',
    status: '🟡 POLISH',
    sources: ['PG/CC p.1–2'],
    concreteNextMove: `Plant a clear, visual "Water Hammer" danger in Act 1 (during the toilet repair or similar plumbing beat) so the Act 3 payoff feels earned and legible. The audience should already know that this specific plumbing failure can unleash dangerous pressure.`,
    currentDraftHandling: {
      'p.117': 'The "Tater Tot" payoff is satisfying and emotionally sticky.',
    },
    implementationNotes: `- Make Tim feel more dangerous and unpredictable early, so his presence adds tension
- Clarify his wish-pool mission: what he believes he's doing and why
- Rework his sacrifice so it accomplishes something concrete in plot terms
- Avoid the impression that he sacrifices himself for nothing`,
    whatsStillOff: `Pg 111: The "Water Hammer" logic plays like technobabble. Audience does not understand why clogging a pipe frees the genies; it feels made up on the spot.`,
  },
  {
    id: 'act-2a-momentum',
    goal: 'Act 2A Momentum',
    actsAffected: ['2A'],
    priority: 'MEDIUM',
    status: '🔴 REBREAK',
    sources: ['Amazon p.6–7', 'PG/CC various'],
    concreteNextMove: '',
    currentDraftHandling: {},
    implementationNotes: `- CUT or compress much of the "settling in" material at HH
- Jump sooner to June/Ed/Michael's arrival to keep story moving
- Move the first Exactitude meeting earlier to establish stakes and ideology
- Make Alex's investigation the engine of 2A
- Let group survival needs and HH's structure drive behavior once they arrive`,
    whatsStillOff: '',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LOW PRIORITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'pg13-rating-discipline',
    goal: 'PG-13 Rating Discipline',
    actsAffected: ['All'],
    priority: 'LOW',
    status: '🟠 REWORK',
    sources: ['Amazon p.6'],
    concreteNextMove: `Run a surgical PG-13 pass on the flagged gags and kills. Replace graphic or juvenile lines with emotional terror or awe:
- Change "exploding heads" / "blood and guts" and "starchy fragments" language to imagery like "dissolving into dust" or "energy displacement."
- Excise "Goth Nipples," "Coming out of my GOOCH!," and "watching his pubies come in," and rephrase Michael's physical complaints as genuine fear about the life growing inside him.`,
    currentDraftHandling: {
      'p.5': 'Poopcan',
      'p.48': 'Language like "exploding heads" and "blood and guts."',
      'p.82': 'Language around "Goth Nipples" retained.',
      'p.116': '"Coming out of my GOOCH!" remains.',
      'p.58': '"watching his pubies come in."',
      'p.117': 'Tim blown into "starchy fragments."',
    },
    implementationNotes: `- Dial down graphic violence, especially the p.99 fight described as "very R-rated"
- Reduce profanity and harsh language where possible
- Aim consistently for a four-quadrant tone: intense but accessible to families`,
    whatsStillOff: `Draft 07 still leans into R-rated gore and juvenile body-humor that breaks the intended Spielbergian awe and PG-13, four-quadrant mandate. Amazon's "no exploding heads" line is being violated in both language and imagery.`,
  },
  {
    id: 'minor-clarity-fixes',
    goal: 'Minor Clarity Fixes and other things',
    actsAffected: ['Various'],
    priority: 'LOW',
    status: '🔴 REBREAK',
    sources: ['PG/CC p.2', 'Amazon p.8'],
    concreteNextMove: '— Pitch that Brenda craves french fries so craves Tim.',
    currentDraftHandling: {},
    implementationNotes: `- Clarify genie deal math (p.27) so audience can do it in their heads
- Make Ed's sickness level consistent across scenes
- Adjust Floyd killing genies so it reads as villainous, not just functional
- Clarify how Michael's water breaking works on p.106 (staging, cause)
- Sweep through remaining page-specific clarity notes`,
    whatsStillOff: '',
  },
  {
    id: 'replace-enterprise',
    goal: 'Replace Enterprise?',
    actsAffected: ['2A'],
    priority: 'LOW',
    status: '🟠 REWORK',
    sources: [],
    concreteNextMove: '',
    currentDraftHandling: {},
    implementationNotes: "Look at that section and decide if there's a better idea.",
    whatsStillOff: '',
  },
];

// =============================================================================
// HELPER FUNCTIONS FOR REWRITE TRACKING
// =============================================================================

export const getGoalsByStatus = (status: RewriteStatus): RewriteGoal[] =>
  REWRITE_GOALS.filter(g => g.status === status);

export const getGoalsByPriority = (priority: RewritePriority): RewriteGoal[] =>
  REWRITE_GOALS.filter(g => g.priority === priority);

export const getRebreakGoals = (): RewriteGoal[] =>
  REWRITE_GOALS.filter(g => g.status === '🔴 REBREAK');

export const getCriticalGoals = (): RewriteGoal[] =>
  REWRITE_GOALS.filter(g => g.priority === 'CRITICAL');

// Summary stats
export const REWRITE_SUMMARY = {
  total: REWRITE_GOALS.length,
  byStatus: {
    rebreak: REWRITE_GOALS.filter(g => g.status === '🔴 REBREAK').length,
    polish: REWRITE_GOALS.filter(g => g.status === '🟡 POLISH').length,
    rework: REWRITE_GOALS.filter(g => g.status === '🟠 REWORK').length,
  },
  byPriority: {
    critical: REWRITE_GOALS.filter(g => g.priority === 'CRITICAL').length,
    high: REWRITE_GOALS.filter(g => g.priority === 'HIGH').length,
    medium: REWRITE_GOALS.filter(g => g.priority === 'MEDIUM').length,
    low: REWRITE_GOALS.filter(g => g.priority === 'LOW').length,
  },
};

export default config;
