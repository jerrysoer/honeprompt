# Optimization Program: SEO Meta Descriptions

## Core Objective

Optimize the system prompt to produce meta descriptions that satisfy both search engines (keyword relevance, proper length) and humans (compelling enough to click).

## Strategic Direction

### The Meta Description Paradox

Meta descriptions serve two masters:
1. **Google's algorithm** — Needs the target keyword, proper length, relevance to page content
2. **The human scanner** — Needs a reason to click THIS result over the 9 others on the page

The optimizer must balance both. A technically perfect meta description that no one clicks is worthless. A compelling description that gets truncated is also worthless.

### Key Principles to Optimize Toward

- **Front-load value.** Google truncates after ~160 characters, but many users only read the first 100. Put the most important information -- and the target keyword -- in the first half.
- **Active voice always wins.** "Learn how to file a tax extension" outperforms "A tax extension can be filed by following these steps" in both click-through rate and readability.
- **Power words earn clicks.** Words like "free", "proven", "essential", "step-by-step", "complete guide", and specific numbers (40%, 12 tools, 5 minutes) create click motivation.
- **Create an information gap.** Tell the reader enough to know the page is relevant, but not so much that they have their answer from the snippet alone. This is especially important for how-to and comparison pages.
- **Match search intent.** A product page meta description should have commercial intent ("shop", "compare prices", "free shipping"). A how-to page should have informational intent ("learn", "step-by-step", "guide").

### Character Count is Non-Negotiable

The 160-character limit is the single hardest constraint. The optimizer should push the prompt to:
- Treat 155 characters as the real target (5-char safety margin)
- Never go over 160 under any circumstances
- Avoid wasting characters on the brand name at the start (Google often prepends it anyway)
- Avoid quotation marks (Google sometimes uses them as truncation points)

### Common Failure Modes to Watch For

1. **Too long** — Over 160 characters. The most common and most damaging failure. Google will truncate with "..." and the CTA at the end gets cut off.
2. **Keyword stuffing** — Using the target keyword twice or more. Reads unnaturally and Google may flag it.
3. **Generic descriptions** — "Learn everything you need to know about X." Could describe any page on any site. Zero differentiation.
4. **No CTA** — Describes the page content but gives no reason to click. Missing the "so what" for the searcher.
5. **Brand-first opening** — "Greenleaf Architecture is a sustainable firm..." wastes the most valuable characters on information Google already shows in the URL.
6. **Passive voice** — "Your tax extension can be filed in 5 easy steps" vs. "File your tax extension in 5 easy steps." Active voice is shorter and stronger.
7. **Over-revealing** — Gives away so much information that the searcher does not need to click through. Especially problematic for comparison and how-to pages.

### Iteration Guidance

- **Early iterations (1-8):** Lock in the character count constraint. Every output must be under 160 characters. This is the foundation -- nothing else matters if the description gets truncated. Also ensure the target keyword appears naturally.
- **Mid iterations (9-16):** Improve click appeal. Push for power words, specific numbers, and clear CTAs. The descriptions should make the searcher feel like clicking is the obvious next step. Work on keyword placement (first half of the description).
- **Late iterations (17-25):** Refine intent matching across page types. A product page meta description should feel different from a blog post meta description. Ensure the prompt handles the full range of page types (commercial, informational, navigational) with appropriate tone and CTA style.

### What Good Looks Like

For a comparison blog post about Notion vs Obsidian:

**Bad (178 chars, too long, generic):**
> In this comprehensive article, we compare Notion vs Obsidian across all major features including pricing, collaboration, and more to help you make the right choice in 2026.

**Good (148 chars, keyword-first, specific, information gap):**
> Notion vs Obsidian in 2026: compare pricing, offline access, and collaboration. Find which app fits your workflow with our use-case matrix.

The second version is under 160 characters, places the keyword in the first 20 characters, includes specifics (pricing, offline access), and creates an information gap (the use-case matrix) that motivates a click.
