# osea-web

Admin and client web interface for the Osea Project.

## This repository

This repository holds the admin and client web interface.

- Stack: React (Vite), TypeScript, Tailwind CSS, shadcn/ui.
- It only talks to the central server (`osea-server`), never to a microservice or a hypervisor.
- It never decides authorization. Hide or show UI for convenience only; the server enforces access.
- Types for API calls come from the shared contract (`osea-contract`).

## Osea Project

Osea is a virtualization manager for shared infrastructure, such as a university cloud where many teams share the same hardware. A central server connects to hypervisors (Hyper-V, Proxmox, others) or clusters, and administrators and clients manage virtual machines from a web interface. Tenants must never see or touch each other's VMs.

## Architecture

- Web interface (React) calls the central server (Express).
- The central server handles authentication, permissions, tenants and the audit log, and stores data in MongoDB. Users sign in through Active Directory or LDAP.
- The central server never talks to a hypervisor directly. It calls a microservice.
- Every microservice exposes the same REST API, described by one OpenAPI contract (`osea-contract`).
- Windows hypervisors (Hyper-V, Failover Cluster) are handled by an ASP.NET Core service using WMI.
- Every other hypervisor (Proxmox first) is handled by a Node.js service on Linux, using the Proxmox REST API with API tokens.
- Supporting a new hypervisor means writing one new microservice against the contract. The server and the web interface do not change.

## Repositories

| Repository | Content |
| --- | --- |
| `osea-web` | Admin and client web interface |
| `osea-server` | Central server |
| `osea-contract` | OpenAPI contract shared by all microservices |
| `osea-service-windows` | ASP.NET microservice for Hyper-V and Failover Cluster |
| `osea-service-linux` | Node.js microservice for Proxmox and other hypervisors |

## Security rules

- Every request is authorized on the server, per tenant. The web interface never makes that decision.
- Validate input at system boundaries (API requests, forms, files).
- Microservices are only reachable from the central server.
- Hypervisor credentials live in the microservices and nowhere else. No secrets in the code or in the repository.
- Tenant isolation is covered by automated tests. Do not weaken them.
- Dependencies are scanned and changes go through code review.

## Code rules

The code must be readable by a developer with one to three years of experience, in the frontend and the backend. The structure is the same in every microservice.

- Names say what a thing is or does: `getActiveUsers`, not `proc`. No obscure abbreviations. Booleans read like a question (`isValid`, `hasAccess`). Functions start with a verb.
- One function, one responsibility. Keep functions short (under about 30 lines) with few parameters (3 or 4 at most, otherwise an object).
- Use early returns instead of deep nesting.
- No magic numbers or strings: use named constants.
- No dead code, no commented-out code, no `TODO` without context.
- Pick the simplest solution. No abstraction "just in case". No clever one-liners; use named intermediate steps.
- A non-trivial regex gets a comment with an example of what it matches.
- Follow the conventions of the language, the framework and the existing code. Read the neighboring code first and match its style. Reuse existing utilities. Do not reformat or refactor code unrelated to the task.
- Never swallow an error. An empty `catch` is forbidden. Error messages say what failed, with which data (never secrets), and what to do.

## Comments and documentation

Code says what, comments say why.

- Do not paraphrase the code in comments. Comment workarounds, library limits, business constraints, performance choices and edge cases.
- Document public or non-trivial functions in the language's format (JSDoc, XML doc comments).
- When a choice has credible alternatives (library, algorithm, schema, architecture), record the context, the choice and why, the rejected alternatives, and the trade-offs. Use a local comment if the choice is local, otherwise a short file in `docs/decisions/NNNN-title.md`.
- When fixing a bug, leave a trail: symptom, root cause, fix, safeguards added (validation, limits, timeouts, tests), and known limitations. Put it in a short comment at the fix and in `docs/` if the topic is broader.
- A fixed bug comes with a test that fails before the fix and passes after. Test names describe the behavior (`rejects_expired_token`).
- Update any README, API schema or comment that your change makes obsolete, in the same change.

## Commits and pull requests

- Use Conventional Commits: `type(scope): description`, with the scope optional. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- The description is imperative, lowercase, without a trailing period, for example `feat(vm): add start endpoint`. Mark breaking changes with `!` after the type or scope, or a `BREAKING CHANGE:` footer.
- Messages contain only technical content: what, why, how to test. No essays for small changes.
- Never add attribution of any kind: no `Co-Authored-By` trailer, no "generated with" line, no mention of an AI tool in commits, pull requests, issues, code, comments or docs. The author is the git user configured on the machine.
- Never use `--no-verify`. The `commit-msg` hook rejects messages carrying AI attribution; if it rejects one, rewrite the message.
- Do not rewrite or amend history unless asked.
- Do not add emojis, decorative banners or assistant-style prose to code, comments, commits or docs.
- Do not commit `.claude/` or other local tool settings.
