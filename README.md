# TrustFlow — Financial Transparency

**Your data. Your call.**

TrustFlow is an independent interactive product-design concept for understanding and managing Open Finance data-sharing permissions. It explores how financial consent can be clearer, more understandable, and easier to control.

## Product experience

- At-a-glance overview of permissions, recipients, expiry and activity.
- Connection details that disclose recipients, purposes, scope and access duration.
- Guided consent simulation with progressive disclosure and a review step.
- Revocation simulation with consequence explanation and explicit confirmation.
- Activity timeline, local state persistence and reset.
- Motion designed for spatial continuity, feedback and hierarchy, with a reduced-motion alternative.
- Research framing, design decisions and validation hypotheses in the in-app case study.

## Technology

Next.js, React, TypeScript, Framer Motion and Lucide icons. The interface is responsive and built as a client-side prototype.

```bash
npm install
npm run dev
```

For production: `npm run build` and `npm start`.

## Design rationale

Consent without comprehension is not meaningful control. TrustFlow foregrounds five questions: **who** can access information, **what** can be accessed, **why**, **until when**, and **how to withdraw access**.

Interaction patterns prioritize transparent language, visible status, reversible navigation, explicit confirmation, keyboard access, and respect for the `prefers-reduced-motion` preference.

### Validation plan

1. **Findability:** Can people identify which recipient can access transactions? Measure completion, first-click accuracy and time on task.
2. **Comprehension:** Can people explain the effect and limits of revocation? Measure comprehension and confidence.
3. **Accessibility:** Can keyboard and reduced-motion users complete the primary tasks? Conduct manual and automated accessibility checks.

No usability study, business impact, user outcome or regulatory compliance is claimed as completed. Hypotheses and illustrative comparisons are not presented as research findings.

## Important limitations

**This is a fictional, educational front-end prototype.** Institutions, permissions, dates and access events are sample data. No customer bank information, bank credentials, or genuine authorization are requested or stored. Consent and revocation change local interface state only. The prototype is not connected to Open Finance Brasil, a bank, an authorization server or a real audit service.

## References

- [Banco Central do Brasil — Open Finance FAQ](https://www.bcb.gov.br/meubc/faqs/s/open-finance)
- [Banco Central do Brasil — Open Finance](https://www.bcb.gov.br/estabilidadefinanceira/openfinance)

These sources inform the design problem, not a claim of regulatory certification.

## License

MIT.
