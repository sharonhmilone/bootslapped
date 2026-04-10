# Bootslapped Brand Style Guide
*Version 3.1 — April 2026*

---

## Purpose of this document

This is the authoritative design and UI reference for everyone building on the Bootslapped brand -- including AI systems generating content or UI copy. It covers color, typography, spacing, components, and voice rules. When there is a conflict between this document and a prior decision, this document wins.

**Authority note:** Voice rules are authoritatively defined in the Editorial Playbook. The voice rules in this document are a UI-focused subset -- covering copy decisions that arise in interface, navigation, and component contexts. In case of conflict between this document and the Editorial Playbook on any voice question, the Editorial Playbook governs.

---

## Brand identity in one sentence

Bootslapped is a diagnostic resource and decision infrastructure for bootstrapped founders. The visual identity should feel like an instrument, not a blog. Every design decision asks: does this help a frustrated founder find the right answer faster?

### Brand character

The site should feel like you just landed somewhere that puts failure on display -- because fuckups are what lead to lessons, and lessons are what lead to breakthroughs. It should not overwhelm, but the structure should give off the energy of "you know it's failing, what do you want to do about it." The reader picks their poison and turns it into antidote. This is the emotional frame for every layout and copy decision.

---

## Color system

All colors are defined as CSS custom properties. Use token names, not hex values, when referencing colors in code or conversation.

### Tokens

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--soot` | Soot | `#0D0D0D` | Page background. The base. Never pure black. |
| `--cinder` | Cinder | `#141414` | Cards, sidebars, inset blocks, Ask AI block background |
| `--ash` | Ash | `#2A2A2A` | All borders, dividers, ruled lines, visible scaffolding |
| `--bone` | Bone | `#F0EDE6` | Primary text. Warm off-white, never pure white. |
| `--dust` | Dust | `#9E9893` | Secondary text, metadata, labels -- WCAG AA compliant against Soot |
| `--brick` | Brick | `#C45C44` | Primary accent. CTAs, tags, wordmark, diagnostic band. |
| `--kiln` | Kiln | `#D96B51` | Brick hover state only. |
| `--char` | Char | `#8C3F2E` | Brick pressed state. Decorative on Bone surfaces only. |
| `--brick-tint` | Brick Tint | `rgba(196,92,68,0.12)` | Interactive device backgrounds. See brick-tint usage rules below. |
| `--steel-teal` | Steel Teal | `#4A9B8E` | Secondary accent. Ask AI blocks and implementation-layer content only. |

### Rules

- The site is fully dark end to end. No light-mode sections.
- Depth comes from Soot → Cinder → Ash layering, not light/dark contrast flips.
- Brick is the primary accent. CTAs, tags, wordmark, article type labels, diagnostic band.
- Steel Teal is the secondary accent. Reserved exclusively for the Ask AI block (left border, label, copy button hover) and other implementation-layer content sections. It does not appear in navigation, cards, or general UI.
- Never use pure `#000000` or pure `#ffffff` anywhere on the site.
- The one full-bleed Brick moment is the diagnostic CTA band. Everywhere else Brick appears as an accent on dark surfaces.
- Dust is the minimum luminosity for readable text. Nothing goes lower.

### Brick Tint usage

`--brick-tint` was previously limited to category tag backgrounds. Its role has expanded to one additional use: interactive device zones. Specifically, sections of the page that the reader interacts with rather than reads passively -- such as the "What's the problem?" failure mode selector on the homepage -- use brick-tint as a full-bleed background to visually separate them from editorial content. Rules:

- Editorial content (articles, article rows, body copy) never uses brick-tint as a background.
- Brick-tint is reserved for category tag backgrounds and interactive device zones only.
- Internal borders within brick-tint zones use `rgba(196,92,68,0.25)` rather than `--ash` to stay within the zone's tonal identity.
- Hover states within brick-tint zones deepen to `rgba(196,92,68,0.18)` and activate a `3px solid var(--brick)` left border.
- Body text within brick-tint zones uses `rgba(240,237,230,0.55)` -- subordinated bone -- rather than dust, to stay within the warm register.

### Accessibility

| Pairing | Contrast | Level |
|---|---|---|
| Bone on Soot | 14.8:1 | AAA -- body copy |
| Dust on Soot | 4.6:1 | AA -- labels, metadata |
| Brick on Soot | 4.4:1 | AA -- large text, UI components |
| Steel Teal on Cinder | 4.6:1 | AA -- Ask AI label and border |
| Char on Bone | 4.8:1 | AA -- if any light surface is ever needed |

Never use Dust for body copy. Dust is for metadata, labels, and secondary information only.

---

## Typography

Three fonts. Fixed roles. No substitutions.

### Wordmark only: Oswald 700

Used exclusively for the `bootslapped` wordmark in nav and footer. Nowhere else in the UI.

- **Why Oswald here:** Better screen hinting than Barlow Condensed at small sizes. The wordmark needs to be immediately legible at 20px. Treat it as the logo -- it sits outside the editorial type scale entirely.
- **Nav size:** 20px, letter-spacing 0.01em
- **Footer size:** 28px, letter-spacing 0.01em

### Editorial headings: Barlow Condensed 700

Used for all headings across the editorial system. Weight is 700 throughout -- 900 is not used anywhere. This decision is closed.

- **Tracking rule:** Opens slightly as size decreases. Tight at hero, neutral at section headers, slightly positive at sub-sections.
- **Case:** Sentence case throughout. Never title case. Never all-caps.
- **Line-height:** `0.97` at hero/display, `1.0` at article title, `1.1` at section and subheadings.

### Footer tagline: Barlow Condensed 700

The footer tagline "For founders who figure it out" uses Barlow Condensed 700 at 18px, bone at 0.5 opacity. This treats it as a brand statement rather than body copy, visually distinct from the footer link text beneath it.

### Body and UI: DM Mono 400

Used for all body copy, UI text, labels, metadata, button text, Ask AI prompt text, and anything that is not a heading or wordmark.

- Running body copy in a monospaced font is an intentional brand signal. It reads as precise and practitioner-built. Do not replace.
- **Line-height:** `1.75--1.8` for body copy, `1.4--1.6` for UI elements.

### Type scale

| Token | Size | Font | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| `--wordmark` | `20px` | Oswald | 700 | `0.01em` | Nav wordmark only |
| `--wordmark-lg` | `28px` | Oswald | 700 | `0.01em` | Footer wordmark only |
| `--display` | `clamp(52px, 11vw, 108px)` | Barlow Condensed | 700 | `-0.01em` | Hero headline only |
| `--h1` | `clamp(36px, 5vw, 52px)` | Barlow Condensed | 700 | `-0.005em` | Article titles |
| `--h2` | `32px` | Barlow Condensed | 700 | `0em` | Section headers within articles, and section-level headings on page that do structural H2 work |
| `--h3` | `20px` | Barlow Condensed | 700 | `0.01em` | Sub-sections, card titles, tool names |
| `--body` | `15px` | DM Mono | 400 | `0` | Article body copy |
| `--small` | `13px` | DM Mono | 400 | `0` | Descriptions, secondary body |
| `--meta` | `12px` | DM Mono | 400 | `0` | Card metadata, article meta row |
| `--label` | `10--11px` | DM Mono | 400--500 | `0.12--0.16em` | Category tags, nav, rail labels -- always uppercase |

Note: H2 was updated from 26px to 32px in this version to create a clear visual gap over H3 at 20px. The previous 26px value produced insufficient hierarchy when scanning.

### Section headings vs section labels

Two different things. Do not treat them the same way.

**Section labels** (e.g. "Latest", "Featured", "In depth") are navigational signposts. They use the label treatment: DM Mono, 10px, UPPERCASE, dust color.

**Section headings** are H2-level prompts or titles that do editorial or structural work (e.g. "Where is your marketing broken?", "Not sure where your marketing is leaking?"). These use Barlow Condensed 700 at `clamp(28px, 5vw, 42px)`, bone color. If a line of text is doing H2 work -- directing the reader to act, framing a decision, or serving as a genuine structural heading -- it should be styled as an H2 regardless of where it appears on the page.

**Navigational H2 clarification:** Page-level section headings that function as navigational or action-directing prompts -- such as "Where is your marketing broken?" on the homepage failure-mode selector -- are genuine H2s, not section labels and not article headings. They use Barlow Condensed 700, not the label treatment. They may contain a question mark when the question is functional (directing the reader to act or choose), not rhetorical.

### Label treatment

The only uppercase context in the UI. Pattern:

- Font: DM Mono, 10--11px, UPPERCASE
- Letter-spacing: 0.12em standard, 0.16em for Ask AI label and section headers
- Color: Dust (inactive), Brick (active/brand labels), Steel Teal (Ask AI label only)
- Never bold

---

## Spacing and structure

### Grid and scaffolding

- All section breaks: `1px solid var(--ash)` ruled lines, not whitespace. This decision is made and enforced.
- `border-radius: 0` on everything -- containers, cards, blocks, buttons. Sharp corners throughout.
- No color shadows. Box shadows use pure black at low opacity only.

### Layout token

The article reading column is `max-width: 680px`. This is the canonical layout token for the Astro build. All article page content constrains to this width.

### Layout -- Article page

- Reading column: max-width 680px, centered, padding 20px mobile / 48px desktop
- Mobile: single column
- Note: left rail (table of contents) and right rail (diagnostic CTA, related links) are planned for the Astro build but not yet implemented in the design review HTML files.

### Layout -- Homepage

- Hero: headline left, recent articles right (320px column) separated by a ruled vertical divider
- Content: editorial article list in ruled rows -- not a card grid
- Failure mode selector: full-width brick-tint zone, three cells horizontal on desktop
- Mobile: stacked single column throughout

### Layout -- Tools page

- Page header, then featured deals (3-up grid on desktop), then In depth spotlight (editorial feature with sidebar on desktop), then compare by category, then full directory
- Directory rows: tool name | description | tags/affiliate flag

### Homepage article row grid

```
Desktop grid: 100px | 1fr | 80px
Mobile:       single column

Left (100px):  Brick, DM Mono, 10px, UPPERCASE -- article type label
Center (1fr):  Barlow Condensed 700, 22px, opacity 0.88 -- title
               DM Mono, 12px, Dust -- description
Right (80px):  DM Mono, 10px, Dust, right-aligned -- topic tag only (no read time)

Hover: background var(--cinder), Brick arrow → at right edge
```

The left column was widened from 72px to 100px to accommodate COMPARISON and DIAGNOSTIC at full width without overflow. Do not reduce below 100px.

### Article page meta row

Format: `Topic · X min read`

Topic first (confirmation signal -- reader verifies they're in the right place), read time second (commitment signal -- reader decides if they have time). Both are kept for SEO and LLM/agent parsing value. Topic tag alone on homepage cards; both on article pages.

### Noise texture

SVG fractalNoise overlay at `opacity: 0.032`, fixed, full viewport. The Brick diagnostic band has its own grain at `opacity: 0.07`.

---

## Page structure

### Homepage section order

1. Nav
2. Hero -- failure-first headline, body copy, two CTAs, desktop aside with latest/featured articles
3. "What's the problem?" -- brick-tint interactive zone, three failure-mode cells
4. Article list -- ruled rows, topic tag only in meta (no read time)
5. Diagnostic CTA band -- headline → steps → single CTA button
6. Footer

### Tools page section order

1. Nav
2. Page header
3. Featured deals -- affiliate/partner slots, 3-up grid on desktop
4. In depth spotlight -- one editorial feature pick per cycle
5. Compare by category -- pill links grouped by category
6. Full directory -- category-grouped ruled rows

### What moved off the homepage

Compare by category and tool finder pills now live exclusively on the tools page. They were removed from the homepage to simplify the page's job: diagnose the problem, read the content, take the diagnostic.

---

## Components

### Category tag

```
Background: var(--brick-tint)
Border:     1px solid var(--brick)
Text:       var(--brick), DM Mono, 10px, UPPERCASE, letter-spacing 0.14em
Padding:    3px 9px
Radius:     0
Values:     DIAGNOSTIC / GUIDE / COMPARISON only
```

These three values are the content taxonomy. They are not interchangeable with verb forms (Diagnose, Compare) -- the noun form is the category label and applies consistently across all article tags, nav filters, and directory labels.

### Failure mode selector (homepage)

The interactive zone below the hero. Treated as a device, not editorial content.

```
Zone background:   var(--brick-tint)
Zone border-top:   1px solid var(--ash)
Zone border-bottom:1px solid var(--ash)

Heading (H2):
  Font:            Barlow Condensed 700, clamp(28px, 5vw, 42px), line-height 1.0
  Color:           var(--bone)
  Padding:         22px 20px 20px mobile / 22px 32px 20px desktop
  Border-bottom:   1px solid rgba(196,92,68,0.25)
  Note:            This is a genuine H2, not a section label. May contain a question
                   mark as a functional navigational prompt.

Cells (mobile: stacked, desktop: horizontal flex):
  Border between:  1px solid rgba(196,92,68,0.2)
  Border-left:     3px solid transparent (activates to var(--brick) on hover)
  Padding:         24px 20px mobile / 28px 32px desktop
  Hover bg:        rgba(196,92,68,0.18)

  Title:           Barlow Condensed 700, 26px mobile / 24px desktop
  Body:            DM Mono, 12px, rgba(240,237,230,0.55), line-height 1.6
  CTA:             DM Mono, 11px, var(--brick), underline border rgba(196,92,68,0.4)
  CTA hover:       var(--kiln)
```

### Diagnostic CTA band

Full-bleed Brick section. Appears on all article pages and the homepage. Not written by the AI content system -- structural, rendered automatically by the CMS.

```
Background:  var(--brick)
Grain:       fractalNoise SVG overlay, opacity 0.07

Layout (desktop): two-column grid, 1fr | 1fr
  Left col:  overline label + headline (H2) + mobile CTA
  Right col: three steps + desktop CTA

Overline:    DM Mono, 10px, UPPERCASE, rgba(240,237,230,0.6)
Headline:    Barlow Condensed 700, clamp(32px, 7vw, 48px), bone
Steps:       Step number (DM Mono, 10px, Dust-toned) + step text (DM Mono, 13px, bold, bone)
CTA button:  Bone fill, Soot text -- inverse of standard primary button

Three steps only. No fourth step.
```

### Ask AI block

Steel Teal is the exclusive accent for this component. It does not appear elsewhere in the UI.

```
Border-left: 3px solid var(--steel-teal)
Background:  var(--cinder)
Padding:     20px

Header:
  Label:       "Ask AI" -- Steel Teal, DM Mono, 10px, UPPERCASE, letter-spacing 0.16em
  Action:      "Copy this prompt. Paste it into your AI assistant." -- Dust, 12px
  Not a table.
  Never:       Use grey/Dust for bracket text. The ghost background is the only distinction needed.

Prompt text:
  Bracketed placeholders use ghost-highlight treatment:
    Background: rgba(74,155,142,0.15)
    Border:     1px solid rgba(74,155,142,0.3)
    Padding:    1px 4px

Footer:
  Note:        Dust, 10px -- "Fill in the brackets. The more specific, the more useful the answer."
  Button:      Ghost style. Hover: border-color and text shift to Steel Teal.
  Border-top:  1px solid var(--ash)
  Function:    Copies full prompt to clipboard. Confirms "Copied ✓" for 2 seconds.
```

No LLM brand names in the Ask AI block. "Your AI assistant" only.

### Citable claim block

One per article. For standalone, attributable declarative statements only.

```
Border-left: 4px solid var(--brick)
Background:  var(--cinder)
Padding:     18px 20px
Text:        Barlow Condensed, 700, 20px, line-height 1.25, var(--bone), letter-spacing 0.01em
```

### Tool recommendation block

**Conditional component.** Rendered only when the brief nominates a specific primary tool as the recommendation. Not present on every article. Never rendered when the commercial path is scenario-dependent -- the platform tier table carries that layer instead.

```
Outer border: 1px solid var(--ash)

Header:
  Label:       "RECOMMENDED TOOL" -- Dust, 10px, UPPERCASE
  Disclosure:  Dust, 10px, italic -- "Affiliate link"
  Background:  var(--cinder)

Body:
  Tool name:   Barlow Condensed, 700, 22px, letter-spacing -0.005em
  Description: DM Mono, 13px, Dust, line-height 1.6
               Must connect the tool specifically to the problem the article addresses.
               Not a generic product description.
  Tags:        DM Mono, 10px, UPPERCASE, border 1px solid ash, padding 3px 8px
  CTA:         Primary button (Brick fill), "Visit [Tool] →"
```

When the recommended tool block is absent and the commercial layer is carried by the platform tier table instead, no placeholder or empty state is shown. The tier table follows the article body directly.

### Platform tier table

**Conditional component.** End of diagnostic and comparison articles only. Not used in guides unless the guide resolves to a specific platform decision.

```
Outer border: 1px solid var(--ash)

Row grid: 160px | 1fr
  Left (tier label): DM Mono, 10px, UPPERCASE, Dust, border-right 1px ash, padding 14px 16px
  Right (tools):     DM Mono, 13px, Bone, padding 14px 16px

Tier label colors:
  "Built for this"        → Dust
  "Can do it with effort" → Dust
  "Will fight you"        → Brick (warning signal)
  "Will fight you" tools  → Dust (dimmed)

Three tiers maximum. Tools appear under the tier that honestly reflects their capability
for this specific use case -- not their general quality.
```

### Featured tool card (tools page)

Three-up grid on desktop. Swappable affiliate/partner entries -- each card is a self-contained data object for Astro templating.

```
Card:          var(--cinder) background, full-bleed row
               Hover: #1c1c1c

Top row:
  Left:        Tool name (Barlow Condensed 700, 28px, bone) +
               Category (DM Mono, 10px, UPPERCASE, brick)
  Right:       Deal badge (Brick fill, bone text, 11px) +
               Pricing note (Dust, 11px)

Body:          DM Mono, 13px, bone at 0.75 opacity, line-height 1.7

Tags:          DM Mono, 10px, UPPERCASE, Dust, border 1px ash

Footer:        Border-top 1px ash
  CTA text:    DM Mono, 11px, Brick -- "Visit [Tool] →"
  Note:        DM Mono, 10px, Dust, italic -- editorial note on fit or use case
```

### In depth spotlight (tools page)

One editorial feature per cycle. Sits between the featured cards and the compare by category section on the tools page. This is a paid or affiliate placement written to the same voice standard as editorial content. It is not generated through the brief-to-draft pipeline -- written and placed by the editor.

The "In depth" label uses Steel Teal (same as Ask AI label) to signal that this is implementation-layer content: a deeper look at one specific tool, not a general editorial article.

```
Section label: "In depth" -- Steel Teal, DM Mono, 10px, UPPERCASE, letter-spacing 0.14em
Disclosure:    "Affiliate link" -- Dust, 10px, italic (right-aligned, same header row)
Border-bottom: 1px solid var(--ash) under header row

Layout (desktop): two-column -- main content left, quick specs sidebar right

Main content:
  Tool name:    Barlow Condensed 700, clamp(32px, 6vw, 48px), bone
  Category:     DM Mono, 10px, UPPERCASE, Brick
  Hook:         DM Mono, 14px, bone at 0.82 opacity, line-height 1.75
                One sentence. The reason this tool matters at a specific stage.
  Detail:       DM Mono, 12px, Dust, line-height 1.7
                Two to three sentences. What specifically earns the recommendation --
                not a feature list, an editorial judgment about where the tool does
                something others don't.
  Tags:         Same as tool directory tags
  Footer:       Border-top 1px ash
    CTA:        Primary button (Brick fill) -- "Visit [Tool] →"
    Pricing:    DM Mono, 12px, Dust -- "From $X/mo · [one honest note on pricing]"

Quick specs sidebar (desktop only):
  Label:        "Quick specs" -- DM Mono, 10px, UPPERCASE, Dust
  Items:        Bold label + plain text value, border-bottom 1px ash between items
    Best for:   Who this is right for, specifically
    Not for:    Who should skip it
    Migration:  Honest note (Easy / Moderate / Plan a weekend)
    Free tier:  Yes/No + one detail if relevant
    Compare:    Links to related comparison articles
```

Voice standard for the In depth spotlight: practitioner-level, peer-level tone. Same rules as editorial content -- no vendor language, no inflated claims, no "powerful" or "seamlessly." The hook and detail paragraphs should read as if a trusted peer is telling you which tool they'd actually use and exactly why.

### Article row (homepage and article list pages)

```
Desktop grid: 100px | 1fr | 80px

Left:   Article type tag (DIAGNOSTIC / GUIDE / COMPARISON)
        Brick, DM Mono, 10px, UPPERCASE

Center: Title -- Barlow Condensed 700, 22px, bone at 0.88 opacity
        Description -- DM Mono, 12px, Dust, line-height 1.55

Right:  Topic tag only -- DM Mono, 10px, Dust, right-aligned
        (No read time on homepage cards. Both topic and read time on article pages.)

Hover:  Background var(--cinder), Brick arrow → appears at right edge
```

---

## CSS architecture

### Current state (design review)

Each HTML file contains its own full inline `<style>` block. This is intentional for design review flexibility -- it allows per-file iteration without build tooling. Known drift between files (e.g. font-size differences) should be audited before the Astro build.

### Pre-Astro build requirement

Extract all shared styles into `bootslapped.css` before the Astro build begins. Shared styles include: CSS custom properties (tokens), nav, footer, base reset, noise texture, and button components. Page-specific styles (article layout, tools page grid, homepage hero) remain in their respective component or page files.

---

## Voice rules

**Authority:** These voice rules govern interface copy, navigation, and component contexts. For the full editorial standard -- including article body, brief generation, and draft production -- the Editorial Playbook is the authoritative document.

### Always

- Second person. The reader is "you." No "I," no "we."
- Sentence case for all headings. Never title case.
- Specific CTAs: "Visit Kit →" not "Learn More"
- Arrow (→) on all CTAs and nav links. Plain text, not an icon.
- Affiliate disclosure: one plain sentence near article opening.
- Open articles with the failure mode, not the topic.
- At least one citable claim per article.
- At least one Ask AI prompt per article.

### Never

- Em dashes (--). Use en dashes (--) or rewrite.
- "I" in any context.
- Exclamation marks in UI copy.
- "Learn More" / "Get Started" / "Click Here"
- "Simply" / "just" / "easy" / "powerful" / "seamlessly"
- Rhetorical questions as headings in article body copy.
- "It depends" without resolving the dependency.
- Any LLM brand name in Ask AI blocks or diagnostic copy.

**Navigational H2 exception:** Page-level section headings that function as navigational or action-directing prompts are exempt from the rhetorical question rule. A heading like "Where is your marketing broken?" or "Not sure where your marketing is leaking?" is a genuine H2 -- it directs the reader to act or choose, uses Barlow Condensed 700, and may contain a question mark. The distinction from a rhetorical heading: navigational H2s appear at the page level and create reader action; rhetorical questions in article body copy exist for effect and do not. The exception applies to page-level structural headings only -- not to subheadings within article body copy.

### Affiliate disclosure

Correct: `Some links earn commission -- doesn't change the recommendation`

On the tools page featured section: `Affiliate links -- doesn't change the recommendation`

### Copy examples

| Situation | Correct | Incorrect |
|---|---|---|
| Primary CTA | Take the Diagnostic → | Get Started Today! |
| Tool link | Visit Kit → | Learn More |
| 404 | That page doesn't exist. Here's where to go instead. | Oops! We can't find that page. |
| Article opening | Opens on the exact failure state | Opens with definition or background |
| Diagnostic CTA | Opens directly in your AI assistant | Powered by ChatGPT |
| Diagnostic GPT label | Try this GPT · No email required | Free tool · No email required |
| Ask AI block label | Ask AI | Ask ChatGPT / Ask Claude |
| In depth spotlight | Honest editorial judgment on fit | Feature list or vendor language |

---

## What this design is not

- **Not a blog.** Articles live in ruled lists, not card grids.
- **Not a landing page.** No hero images, testimonial carousels, animated blobs, or alternating light/dark sections.
- **Not a startup template.** No Inter, no Space Grotesk, no purple gradients, no rounded cards, no glassmorphism.
- **Not generic dark mode.** Depth from Soot/Cinder/Ash layering, not inverting a light design.
- **Not a growth hacker brand.** Brick appears at specific moments. When everything is Brick, nothing is.
- **Not orange.** Brick is a pigmented clay-red. If it reads as "tech orange" in any context, the surrounding components are not doing their job.
- **Not a tool comparison site.** The tool directory exists to support the editorial content, not replace it. Recommendations earn their place through the diagnostic and guide content, not through listing.

---

## Changelog

| Version | Date | Summary |
|---|---|---|
| 1.0 | April 2026 | Initial spec. Persimmon accent, Barlow Condensed 900/700, DM Mono. |
| 2.0 | April 2026 | Accent: Persimmon → Brick (#C45C44) + Kiln hover + Char pressed. Added Steel Teal (#4A9B8E) for Ask AI layer. Typography: Barlow Condensed 700 throughout editorial scale (900 removed), Oswald 700 for wordmark only as logo outside the scale. Ask AI locked to Treatment B single paragraph with ghost-highlight brackets. Platform tier table component added. No LLM brand names in UI copy. |
| 3.0 | April 2026 | H2 updated 26px → 32px. Homepage rebuilt: failure-first hero, failure mode selector as brick-tint interactive zone, article list in ruled rows replacing card grid, compare by category moved to tools page. Tools page added: featured deals, editorial spotlight, compare by category, full directory. Brick-tint usage expanded to interactive device zones with full usage rules. Section heading vs section label distinction formalised. Article meta row format locked as Topic · read time (topic first). Homepage article cards: topic only, no read time. Homepage article type label column widened 72px → 100px to accommodate DIAGNOSTIC and COMPARISON without overflow. Diagnostic CTA band simplified: no body copy, steps directly under headline, single CTA, three steps only (04 removed). Footer tagline switched to Barlow Condensed 700 brand statement. ASCII planned but not implemented -- section headers identified as primary placement. CSS architecture documented. Navigational question heading exception added to voice rules. |
| 3.1 | April 2026 | Authority note added (Editorial Playbook governs voice questions). Navigational H2 exception formalised with full definition and scope. Component optionality rules added: tool recommendation block and platform tier table now documented as conditional components with explicit rules for when each renders. In depth spotlight fully specced as a named component: Steel Teal label, two-column layout, quick specs sidebar, voice standard, editorial vs. vendor language distinction. Voice rules section updated with authority note and In depth spotlight copy example. |
