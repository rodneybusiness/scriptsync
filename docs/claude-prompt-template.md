# Claude Prompt Template for ScriptSync Projects

> Use this template with Claude, ChatGPT, or any AI tool to develop your screenplay through conversation, then export JSON for ScriptSync.

## Quick Start

Copy this prompt to start developing a new screenplay:

```
I want to develop a screenplay using a structured format. Help me build out my story through conversation.

**Working Title:** [Your Title]
**Genre:** [Genre(s)]
**Logline:** [One sentence description]

I'll develop this with you through discussion, and when ready, you'll export it as JSON that I can import into ScriptSync.

Let's start with [the premise / the main character / the opening scene / etc.]
```

---

## Full Project Schema

When you're ready to export, ask the AI to format your work using this schema:

```json
{
  "config": {
    "id": "my-project-slug",
    "title": "My Screenplay Title",
    "logline": "When [protagonist] faces [conflict], they must [action] or [stakes].",
    "genres": ["Drama", "Thriller"],
    "description": "Extended description of the project...",

    "characters": [
      {
        "name": "PROTAGONIST",
        "role": "main",
        "arc": "From doubt to conviction",
        "color": "#3B82F6",
        "traits": ["determined", "flawed", "resilient"]
      },
      {
        "name": "ANTAGONIST",
        "role": "supporting",
        "arc": "Revealed to have sympathetic motivations",
        "color": "#EF4444"
      }
    ],

    "theme": {
      "core": "What your story argues is true",
      "counterArgument": "The opposing view that makes it interesting"
    },

    "motifs": ["recurring image", "symbolic object", "visual pattern"],

    "ai": {
      "toneDescriptor": "Dark comedy with moments of genuine warmth. Sharp dialogue. Tarantino meets Coen Brothers.",
      "styleReferences": ["No Country for Old Men", "In Bruges", "Three Billboards"],
      "uniqueConstraints": [
        "All violence is off-screen",
        "No expository flashbacks",
        "Every scene must advance the deadline tension"
      ]
    }
  },

  "sequences": [
    {
      "id": "SEQ_1",
      "title": "Act One - Setup",
      "dramaticQuestion": "Will the protagonist accept the call?",
      "climax": "The point of no return",
      "resolution": "How the act ends",
      "scenes": [
        {
          "id": "SC-001",
          "sequenceId": "SEQ_1",
          "title": "Opening Image",
          "pageNumber": 1,
          "scriptContent": "INT. LOCATION - DAY\n\nDescription of the scene...\n\nCHARACTER\nDialogue here.",
          "summary": "Brief description of what happens",
          "status": "draft",
          "timeOfDay": "DAY",
          "location": "LOCATION NAME",
          "beats": [
            {
              "id": "beat_001",
              "description": "Establish the world before change",
              "completed": false
            }
          ],
          "notes": [],
          "tracking": [
            {
              "category": "Props",
              "description": "The briefcase - introduced here, crucial in Act 3"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Development Prompts

### Character Development

```
Help me develop [CHARACTER NAME]:
- What do they want? (external goal)
- What do they need? (internal growth)
- What's their fatal flaw?
- How do they speak? (verbal tics, rhythm, vocabulary)
- What's their relationship to [OTHER CHARACTER]?
```

### Scene Building

```
Let's develop the scene where [EVENT HAPPENS].
- Where does it take place?
- Who's present?
- What's the conflict?
- What's the emotional arc?
- What visual motifs should appear?
- What's the subtext beneath the dialogue?
```

### Theme Exploration

```
My story seems to be about [SURFACE THEME].
- What's the deeper argument?
- What's the counter-argument that makes it interesting?
- Which scenes best embody this tension?
- How does the ending resolve (or complicate) the theme?
```

### Structure Check

```
Review my current structure:
[Paste your sequence/scene outline]

- Are the act breaks clear?
- Is there a midpoint reversal?
- Does Act 2 have rising complications?
- Is the climax the logical culmination of everything before?
```

---

## Export Prompts

### Minimal Export (Just Get Started)

```
Export my screenplay development as minimal JSON for ScriptSync:
- Just the title, logline, and genres
- One sequence called "Act One"
- One scene with whatever we've discussed so far
- Status should be "draft" for everything
```

### Full Export

```
Export our complete screenplay development as JSON for ScriptSync, including:
- All characters with their arcs and traits
- Theme statement and counter-argument
- All motifs we've identified
- Each sequence with dramatic question, climax, resolution
- All scenes with script content, beats, and tracking items
- AI configuration (tone, style references, constraints)

Format it exactly like the ScriptSync schema.
```

### Incremental Export

```
Export just the new content we've developed since last time:
- New scenes: [list scene titles]
- Updated characters: [list names]
- New tracking items

I'll merge this with my existing project.
```

---

## Tips for AI Collaboration

### Be Specific About Tone
Instead of: "Make it funny"
Try: "Dark comedy in the vein of In Bruges - violent situations played with deadpan delivery"

### Provide Context for Each Session
```
Continuing work on [TITLE].
Last time we: [brief summary]
Today I want to: [specific goal]
Relevant constraints: [any rules we've established]
```

### Ask for Alternatives
```
Give me three different versions of this beat:
1. The obvious choice
2. The unexpected choice
3. The emotionally devastating choice
```

### Validate Continuity
```
Check for continuity issues:
- Does this scene contradict anything we established earlier?
- Are character motivations consistent?
- Does the timeline work?
```

---

## ScriptSync Format Reference

### Scene Status Values
- `draft` - Initial version, still developing
- `review` - Ready for feedback
- `polished` - Revised and refined
- `locked` - Final, no more changes

### Character Roles
- `main` - Protagonist, antagonist, deuteragonist
- `supporting` - Important secondary characters
- `featured` - Notable single-scene appearances

### Note Types (for scene.notes)
```typescript
type NoteType = 'general' | 'rewrite' | 'logic' | 'character' | 'theme';
```

### Time of Day Options
Common values: `DAY`, `NIGHT`, `DAWN`, `DUSK`, `CONTINUOUS`, `LATER`, `MOMENTS LATER`

---

## Troubleshooting Import

### "Invalid JSON" Error
- Ask the AI to validate the JSON syntax
- Check for trailing commas
- Ensure all strings use double quotes
- Verify brackets and braces match

### "Missing Required Fields"
Minimum required:
- `config.id` (slug format: lowercase, hyphens, no spaces)
- `config.title`
- At least one sequence with one scene
- Each scene needs `id`, `sequenceId`, `title`

### "Validation Warnings"
ScriptSync accepts partial data. Warnings about missing:
- Characters - can be added later
- Theme - develops through revision
- Beats - optional for each scene
- AI config - optional enhancement

---

*For more information, see the [ScriptSync README](../README.md) or visit the app at localhost:5173*
