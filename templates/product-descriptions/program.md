# Optimization Program: Product Descriptions

## Core Objective

Optimize the system prompt to produce product descriptions that sell by focusing on the customer's problem and desired outcome, not the product's specifications.

## Strategic Direction

### The AIDA Framework

The best product descriptions follow the AIDA pattern, even in short form:

1. **Attention** — Open with a hook that speaks to the reader's current pain or desire
2. **Interest** — Introduce the product as the bridge between their problem and their goal
3. **Desire** — Use sensory and emotional language to help them imagine life with the product
4. **Action** — Close with a specific, low-friction CTA

Guide the optimizer to embed AIDA thinking into the prompt without making it formulaic.

### Key Principles to Optimize Toward

- **Benefits over features, always.** "40-hour battery" is a feature. "A full work week on a single charge" is a benefit. The prompt should teach this translation consistently.
- **The customer is the hero.** The product is the tool that helps them succeed. Avoid "Our product does X" in favor of "You get X."
- **Specificity sells.** "Save time" is weak. "Cut your weekly reporting from 3 hours to 15 minutes" is strong. Push the prompt toward concrete outcomes.
- **Short paragraphs are non-negotiable.** Walls of text kill conversions on product pages. 2-3 sentences per paragraph, max.

### Common Failure Modes to Watch For

1. **Feature dumping** — Listing every feature without connecting them to outcomes
2. **Buzzword soup** — "Revolutionary AI-powered next-generation solution" says nothing
3. **Generic CTAs** — "Buy now" or "Learn more" without product-specific framing
4. **Tone mismatch** — Using enterprise language for a consumer product, or casual language for B2B
5. **Missing the pain point** — Describing what the product does without addressing why the reader should care
6. **Exceeding word count** — Product descriptions should be tight. 80-150 words is the sweet spot.

### Iteration Guidance

- **Early iterations (1-8):** Focus on getting the benefit-first structure right. The prompt should reliably produce descriptions that open with a customer outcome, not a product feature.
- **Mid iterations (9-16):** Refine emotional and sensory language. Push for descriptions that create a mental picture. Also ensure CTAs are specific to each product.
- **Late iterations (17-25):** Polish audience fit and tone matching. A B2B SaaS description should sound different from a protein bar description. The prompt should handle this range gracefully.

### What Good Looks Like

A strong product description for a $24/month coffee subscription should NOT read like:
> "Roast Republic delivers premium single-origin coffees with personalized flavor profiles and convenient monthly delivery."

It SHOULD read more like:
> "That first sip of truly fresh coffee -- the bright acidity, the clean finish, the aroma that fills your kitchen before the mug even reaches your lips. Grocery store beans lost that magic weeks ago. Roast Republic ships two single-origin coffees roasted within 48 hours of landing at your door..."

The optimizer should push the prompt toward outputs that feel like the second example.
