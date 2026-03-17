# Optimization Program: Cold Outreach Email

## Core Objective

Optimize the system prompt to produce cold emails that get replies by being genuinely personalized, respectfully brief, and easy to say yes to.

## Strategic Direction

### The Psychology of Cold Email

Cold email lives or dies on three things:
1. **The open** — Subject line must earn a click without being clickbait
2. **The first sentence** — Must prove you did your homework (or get deleted)
3. **The ask** — Must be small enough that saying yes costs nothing

Guide the optimizer to nail all three consistently.

### Key Principles to Optimize Toward

- **Specificity is personalization.** "I saw your LinkedIn post" is not personalized. "Your post about spending 2 days fixing a broken Salesforce sync" is. The prompt should demand specific references.
- **Brevity is respect.** Under 100 words is not a suggestion, it is a constraint. Every word must earn its place. The optimizer should ruthlessly cut filler.
- **Low-commitment CTAs convert.** "Worth a quick look?" beats "Schedule a 30-minute demo" every time. The CTA should feel like the next natural step, not a sales process milestone.
- **Peer-to-peer tone.** The sender is not begging for time. They are offering something potentially valuable. The tone should be confident but not arrogant, helpful but not desperate.

### Subject Line Rules

- 6 words or fewer, always
- Specific enough to be relevant, vague enough to create curiosity
- No ALL CAPS, no exclamation marks, no emoji
- Good: "That Salesforce sync problem" / "Quick question about Loom"
- Bad: "REVOLUTIONIZE Your Revenue Operations!" / "Partnership Opportunity for Loom Inc."

### Common Failure Modes to Watch For

1. **The filler opening** — "I hope this email finds you well" / "My name is X and I work at Y" / "I wanted to reach out because..." These waste the most valuable real estate in the email.
2. **Feature vomiting** — Listing product features instead of connecting to the prospect's specific situation.
3. **The multi-CTA** — "Would love to chat, but also feel free to check out our website, and here is a case study..." Pick one ask.
4. **The humble brag** — "We have helped 500+ companies including Google, Meta, and Amazon..." Social proof should be surgical (one relevant example), not a brag list.
5. **The essay** — Anything over 100 words. The reader decided to delete or reply within 8 seconds. Respect that.
6. **Template smell** — If you swap the prospect's name and the email still works, it is not personalized.

### Iteration Guidance

- **Early iterations (1-8):** Lock in the structure: specific hook, bridge to value, single CTA. Get the word count under control. Kill all filler phrases.
- **Mid iterations (9-16):** Sharpen personalization. The prompt should teach the model to extract the most compelling detail from the prospect context and lead with it. Also refine subject lines.
- **Late iterations (17-25):** Polish tone across different scenarios (sales vs. recruiting vs. partnerships). A recruiter email should feel different from a SaaS pitch, but both should follow the same structural principles.

### What Good Looks Like

For a SaaS founder reaching out after seeing a LinkedIn post:

**Bad:**
> Subject: DataPipe - Real-time Data Sync Solution
>
> Hi Jordan, I hope this email finds you well. My name is Maya and I am the co-founder of DataPipe. We help companies like yours sync their warehouse data to CRMs in real-time. I noticed you work in Revenue Operations and thought our solution might be relevant...

**Good:**
> Subject: That Salesforce sync nightmare
>
> Jordan -- your LinkedIn post about burning 2 days on a broken Salesforce sync hit close to home. We built DataPipe specifically for that problem: real-time warehouse-to-CRM sync that does not break.
>
> Worth 15 minutes to see if it fits your stack?
>
> Maya

The optimizer should push every output toward the second example.
