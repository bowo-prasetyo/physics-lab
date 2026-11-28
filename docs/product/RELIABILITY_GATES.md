# Scientific and educational reliability gates

These checks are regression controls, not a claim that automated tests can
replace scientific review, accessibility evaluation with assistive technology,
or observation with learners.

## Required checks

The pull-request and deployment workflows must run:

1. **Scientific correctness:** physics-engine unit tests, domain/boundary checks,
   conservation and invariant tests, analytical limits, and independent
   reference-value tests. Independent reference values must not be calculated
   by another helper from the same engine.
2. **Numerical answers:** reject malformed and non-finite input; accept documented
   decimal, decimal-comma and scientific notation; preserve sign; apply the
   documented relative tolerance and a bounded zero-target fallback.
3. **Graph interpretation:** graph questions must reference a real graph and a
   valid answer option. Function samples and table points must be finite, in
   domain, and inside the displayed axis range. Graph functions must continue
   to call the physics engine.
4. **Experiment evidence:** catalogue coverage must be backed by predictions
   learners can test, not by practice copy alone. The coverage-evidence test is
   the executable evidence map; layout and prediction tests protect the
   predict-before-explain sequence.
5. **Localization and accessible copy:** run both the static localization audit
   and the rendered-route audit for every supported locale.
6. **Browser and device smoke tests:** run the production build in Chromium,
   Firefox and WebKit at a narrow mobile viewport and a desktop viewport;
   check for uncaught page errors, horizontal overflow, a visible heading,
   keyboard reachability and accessible names for visible controls.

## Review requirements for changes to physics

Follow the scientific validation policy. In addition, the pull request must
state the model assumptions and units; the independent reference used; the
relevant analytical limit or invariant; numerical error/convergence behaviour
when applicable; and which learner-facing explanation or evidence changes. A
passing CI run establishes regression coverage only, not that the model is
empirically true or that learning effectiveness has been demonstrated.

## Scope and known limitations

The browser smoke suite is a cross-engine baseline, not exhaustive device
certification. It does not replace VoiceOver, NVDA or TalkBack testing, manual
keyboard review of every experiment, colour-contrast review, or testing on
physical low-powered devices. The project must continue to report these as
manual review items rather than imply that a smoke test establishes full WCAG
conformance.
