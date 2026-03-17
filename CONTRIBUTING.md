# Contributing to HonePrompt

Thanks for contributing! The best way to grow HonePrompt is by sharing templates that actually work — with measured results to prove it.

## How to Contribute a Template

Templates live in `templates/`. Each template is a self-contained directory with a prompt, test cases, config, and a README showing real run results.

### Step 1: Fork the repo

Fork [HonePrompt on GitHub](https://github.com/jerrysoer/honeprompt) and clone your fork locally.

```bash
git clone https://github.com/<your-username>/honeprompt.git
cd honeprompt
npm install
```

### Step 2: Copy the starter template

```bash
cp -r templates/_template/ templates/your-template-name/
```

Template names must be **lowercase kebab-case** (e.g., `cold-email-saas`, `code-review-python`, `tweet-hooks`).

### Step 3: Replace all `[REPLACE]` placeholders

Open each file in your new template directory and fill in every `[REPLACE]` marker:

| File | What to fill in |
|------|-----------------|
| `prompt.md` | Your initial prompt — this is the starting point HonePrompt optimizes from |
| `test-cases.json` | At least 5 diverse test inputs with expected outputs |
| `honeprompt.config.ts` | Category, model, iterations, scoring criteria |
| `program.md` | Description of what the prompt does and how scoring works |
| `README.md` | Template description, author, tags, sample run results |

### Step 4: Write 5+ test cases

Edit `test-cases.json`. Test cases must be diverse — different input lengths, tones, edge cases, and domains. Avoid duplicates or slight variations of the same input.

```json
[
  {
    "input": "...",
    "expected": "...",
    "description": "Short description of what this case tests"
  }
]
```

### Step 5: Run HonePrompt in your template directory

```bash
cd templates/your-template-name
honeprompt run
```

Or from the repo root:

```bash
npx honeprompt run --template your-template-name
```

This will iterate on your prompt and output a score progression. Let it run to completion.

### Step 6: Record results in README

Your README **must** include a `## Sample Run Results` section with a results table. The table should show at least one complete run:

```markdown
## Sample Run Results

| Iteration | Score | Notes |
|-----------|-------|-------|
| 0 (baseline) | 62 / 100 | Starting prompt |
| 1 | 68 / 100 | Improved specificity |
| 2 | 74 / 100 | Added output format |
| 3 | 79 / 100 | Tightened persona |

**Final improvement: +17 points over 3 iterations**
```

The improvement from baseline to final must be **5 points or more**.

### Step 7: Open a PR

Push your branch and open a pull request. Use the **Template Contribution** PR template — it will load automatically when you open a PR with a path under `templates/`.

Fill in the baseline score, final score, and a short description of what your template does and who it is for.

---

## Quality Bar

Pull requests that don't meet the following bar will be asked to revise before merging:

- **5+ point improvement** from baseline to final score in a real `honeprompt run`
- **5+ test cases** that are genuinely diverse (not minor variations of the same input)
- **No secrets or API keys** anywhere in the template files
- **Descriptive README** following the required format (see below)
- **Category set** to one of the valid options (see below)
- **Template name** is lowercase kebab-case

### README format

Your `README.md` must include these sections in order:

1. `# Template Name` (H1 — the human-readable name)
2. One-paragraph description of what the template does
3. `## Category` — one of the valid categories below
4. `## Author` — your GitHub username or name
5. `## Tags` — comma-separated keywords
6. `## Sample Run Results` — table as shown above

### Valid categories

| Category | Use for |
|----------|---------|
| `creators` | Content creators, writers, social media |
| `developers` | Code, commits, PR descriptions, docs |
| `marketers` | Ads, emails, SEO, product copy |
| `saas` | SaaS-specific flows: onboarding, support, changelogs |
| `general` | General-purpose prompts that don't fit another category |

---

## Credit Policy

Every merged template author is credited in two places:

1. **README.md** in their template directory (`## Author` field)
2. **registry.json** at the repo root — your name/handle appears next to the template entry

If you want to be linked to a GitHub profile, Twitter/X handle, or personal site, include it in the `## Author` section of your README.

---

## Other Contributions

Not all contributions are templates. Other valuable contributions include:

- Bug fixes in the CLI (`src/`)
- Improvements to the scorer or iteration engine
- Documentation fixes
- New test utilities

For non-template contributions, open a regular PR with a clear description of the problem and solution. No special template required.

---

## Questions?

Open a [GitHub Discussion](https://github.com/jerrysoer/honeprompt/discussions) or file an issue. We're friendly.
