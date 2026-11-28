## What and why

<!-- What changes for learners or teachers, and why now. One short paragraph. -->

## Product check

<!-- Answer each in a line or two. Write "n/a" only when it truly does not apply. These are the roadmap's decision rules and the house rules in CLAUDE.md. -->

- **Learning outcome:** which outcome in `docs/product/PRODUCT_VISION.md` does this serve?
- **Learner need:** which misconception or unanswered question does it address?
- **On the thread:** how does it strengthen space, time and motion, rather than add a new topic?
- **Predict, then evidence:** what does the learner predict, vary, observe and explain? Does anything reveal an answer before the evidence (including learning aids)?
- **Practice:** does it add practice? Which steps, and are they still within the budget (2+ at Beginner, 3–7 at Advanced)? Is any of it scored? (It must not be.)
- **Physics:** does it change a model in `src/physics/`? If so, which items of the change checklist in `docs/product/SCIENTIFIC_VALIDATION.md` did you cover (input domains, a limit or benchmark, invariants, sources for empirical values)?
- **Privacy:** does it store or send anything about a learner? (Sending: never. Storing: only the ratified opt-in, device-local progress.)
- **House rules:** does it change `CLAUDE.md`, the vision or a rule? If so, quote the product owner's sign-off here, or split that change into its own pull request.

## Testing

<!-- Tick a box only when you did it yourself; say what you saw. If you could not do something, leave it unticked and add "Not done: <reason>" on that line, e.g.
- [ ] Checked in a browser — Not done: no browser in this environment
A ticked box that says it was not done fails the PR checklist check. -->

- [ ] `npm test`
- [ ] `npm run audit:localization && npm run audit:localization:runtime`
- [ ] `npm run build`
- [ ] Checked in a browser (say what you looked at)
