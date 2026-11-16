/* Generated from project/implementation-roadmap.json. */
window.ROADMAP_DATA = {
  "schemaVersion": "0.1",
  "title": "Phase 0 plus five-stage implementation roadmap",
  "updatedAt": "2026-11-16",
  "statusPolicy": "Progress counts accepted deliverables, not subjective effort. Every draft task awaits Zhang Xinyue's review and assignment.",
  "tracks": [
    {
      "id": "M1",
      "label": "Member 1",
      "name": "Common Skeleton & LLM"
    },
    {
      "id": "M2",
      "label": "Member 2",
      "name": "World Model & Engine"
    },
    {
      "id": "M3",
      "label": "Member 3",
      "name": "Market & Lange Market Execution"
    },
    {
      "id": "M4",
      "label": "Member 4",
      "name": "Planning Boards & Labor Matching"
    },
    {
      "id": "X",
      "label": "Coordinator",
      "name": "Zhang Xinyue: Review, Assignment & Integration"
    }
  ],
  "phases": [
    {
      "id": "P0",
      "number": 0,
      "title": "Interface Discovery & Alignment",
      "summary": "Each owner first thinks through needed and provided interactions without writing a formal document; the team aligns twice, with interface drafting and assignment between the two meetings.",
      "gate": "The team has an agreed interaction map, named interface owners, reviewed v0.1 interface drafts, contract-test examples, and an explicit unresolved-question list; no production implementation is required.",
      "tasks": [
        {
          "id": "P0-M1",
          "track": "M1",
          "title": "Discover orchestration and policy interfaces",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Before the first meeting, think through what SimulationEngine, Policy, Mechanism, and WorldEngine must call, consume, and return; do not write a formal interface document yet.",
            "At the first alignment meeting, walk through one minimal round and identify timing, state ownership, failures, and missing interactions.",
            "After Zhang Xinyue assigns interface ownership, draft SimulationEngine, PolicyPort, MechanismPort, shared envelopes, and their contract-test examples."
          ],
          "deliverables": [
            "Confirmed M1 needs/provides interaction list",
            "Assigned M1 interface drafts v0.1",
            "M1 contract-test examples for the second alignment"
          ],
          "dependencies": [],
          "documents": [
            "architecture-v0-1.html",
            "development-collaboration-process.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P0-M2",
          "track": "M2",
          "title": "Discover WorldEngine interfaces",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Before the first meeting, think through what WorldEngine must receive and what StateView, WorldState, validation, and StepResult data it can provide; do not write a formal document yet.",
            "At the first alignment meeting, explain who may read or modify state and which failures must be returned to SimulationEngine.",
            "After assignment, draft WorldEnginePort, StateView, WorldState, StepResult, validation semantics, and contract-test examples."
          ],
          "deliverables": [
            "Confirmed M2 needs/provides interaction list",
            "Assigned M2 interface drafts v0.1",
            "M2 contract-test examples for the second alignment"
          ],
          "dependencies": [],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md",
            "docs/WORLD_CONFIGURATION_LAYERS.md"
          ]
        },
        {
          "id": "P0-M3",
          "track": "M3",
          "title": "Discover market and Lange-feedback interfaces",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Before the first meeting, think through required market views, order inputs, market outputs, and trial-price feedback without writing a formal document.",
            "At the first alignment meeting, explain the normal market call and the single-iteration Lange market call, including empty and failed outcomes.",
            "After assignment, draft Order, MarketResult, MarketFeedback, TrialPriceMarketPort, decision adaptation, and contract-test examples."
          ],
          "deliverables": [
            "Confirmed M3 needs/provides interaction list",
            "Assigned M3 interface drafts v0.1",
            "M3 contract-test examples for the second alignment"
          ],
          "dependencies": [],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P0-M4",
          "track": "M4",
          "title": "Discover planning and labor interfaces",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Before the first meeting, think through required planning views, reports, market feedback, plan outputs, and labor-matching inputs/outputs without writing a formal document.",
            "At the first alignment meeting, explain Lange, Cockshott, and labor interaction sequences and their failure/termination cases.",
            "After assignment, draft LangeState, PlanProposal, LaborAssignment, PlanningDecisionAdapter, and contract-test examples."
          ],
          "deliverables": [
            "Confirmed M4 needs/provides interaction list",
            "Assigned M4 interface drafts v0.1",
            "M4 contract-test examples for the second alignment"
          ],
          "dependencies": [],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P0-X",
          "track": "X",
          "title": "Run two-pass interface alignment and assign documentation",
          "status": "draft",
          "completed": 0,
          "total": 4,
          "responsibilities": [
            "Before the first meeting, ask every owner to prepare only a mental or whiteboard-level needs/provides sketch; do not request formal fields or class documents.",
            "Facilitate the first meeting around one minimal round, record agreed calls and open questions, then assign every interface document to an owner plus provider and consumer reviewers.",
            "Collect the formal drafts and contract-test examples, run the second alignment, and send unresolved research/economic questions to Li Wenhao and Liu Chong."
          ],
          "deliverables": [
            "First alignment interaction map and unresolved-question list",
            "Named interface-document assignments with provider/consumer reviewers",
            "Second alignment record and reviewed interface baseline v0.1",
            "Phase 0 gate decision"
          ],
          "dependencies": [
            "P0-M1",
            "P0-M2",
            "P0-M3",
            "P0-M4"
          ],
          "documents": [
            "implementation-roadmap.html",
            "development-collaboration-process.html",
            "docs/interfaces.md",
            "docs/meetings/",
            "docs/decisions/"
          ]
        }
      ]
    },
    {
      "id": "P1",
      "number": 1,
      "title": "Common Skeleton",
      "summary": "Parse configuration, freeze public contracts, connect empty implementations, and complete one fixed-result round.",
      "gate": "SimulationEngine completes one fixed round through FakePolicy, FakeMechanism, and FakeWorldEngine; all contracts serialize and the run artifacts can be read back.",
      "tasks": [
        {
          "id": "P1-M1",
          "track": "M1",
          "title": "Build the runnable skeleton",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Implement ConfigLoader, ScenarioResolver, public dataclasses, Ports, and SimulationEngine.",
            "Implement FakePolicy, FakeMechanism, FakeWorldEngine, and ArtifactStore.",
            "Create the one-round smoke test and example entry point."
          ],
          "deliverables": [
            "Public contract package and interface version",
            "SimulationEngine one-round smoke test",
            "Minimal run directory with manifest, events, and snapshot"
          ],
          "dependencies": [
            "P0-X"
          ],
          "documents": [
            "architecture-v0-1.html",
            "development-collaboration-process.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P1-M2",
          "track": "M2",
          "title": "Define the WorldEngine boundary",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Draft WorldState, StateView, WorldEnginePort, and StepResult fields.",
            "Specify ownership: only WorldEngine may publish the next WorldState.",
            "Provide FakeWorldEngine fixtures and contract tests consumed by SimulationEngine."
          ],
          "deliverables": [
            "WorldEngine interface draft",
            "Minimal WorldState fixture",
            "WorldEnginePort contract test"
          ],
          "dependencies": [
            "P1-M1"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md",
            "docs/WORLD_CONFIGURATION_LAYERS.md"
          ]
        },
        {
          "id": "P1-M3",
          "track": "M3",
          "title": "Define the market boundary",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Draft Order, MarketResult, MarketFeedback, and market StateView requirements.",
            "Implement a FakeMarketMechanism returning a fixed decision.",
            "Agree with M4 on TrialPriceMarketPort and excess-demand feedback."
          ],
          "deliverables": [
            "Market contract draft",
            "Fake market mechanism",
            "Market-to-Engine and Market-to-Lange contract examples"
          ],
          "dependencies": [
            "P1-M1",
            "P1-M2"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P1-M4",
          "track": "M4",
          "title": "Define planning and labor boundaries",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Draft PlanProposal, LangeState, LaborAssignment, and planning StateView requirements.",
            "Implement fixed Lange, Cockshott, and LaborMatcher test doubles.",
            "Agree with M3 on one-iteration trial-price feedback and with M2 on executable decisions."
          ],
          "deliverables": [
            "Planning and labor contract draft",
            "Fixed planning test doubles",
            "Lange loop interaction example"
          ],
          "dependencies": [
            "P1-M1",
            "P1-M2",
            "P1-M3"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P1-X",
          "track": "X",
          "title": "Review, assign, and freeze skeleton v0.1",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Confirm the named owner for M1-M4 and split work into GitHub Issues.",
            "Organize interface review between every provider and consumer.",
            "Collect contract tests and schedule the Gate 1 integration review."
          ],
          "deliverables": [
            "Approved task assignments",
            "Interface baseline v0.1",
            "Gate 1 checklist and integration record"
          ],
          "dependencies": [
            "P1-M1",
            "P1-M2",
            "P1-M3",
            "P1-M4"
          ],
          "documents": [
            "implementation-roadmap.html",
            "development-collaboration-process.html",
            "docs/tasks/",
            "docs/meetings/"
          ]
        }
      ]
    },
    {
      "id": "P2",
      "number": 2,
      "title": "Deterministic World without LLM",
      "summary": "Implement initialization and physical settlement, then run multiple steps with fixed behavior.",
      "gate": "The same scenario and seed produce byte-equivalent or semantically equivalent states across multiple steps; conservation, non-negative inventory, and capacity tests pass.",
      "tasks": [
        {
          "id": "P2-M1",
          "track": "M1",
          "title": "Run fixed policies across multiple steps",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Extend SimulationEngine from one step to episode execution and termination.",
            "Implement deterministic RulePolicy fixtures; keep all LLM code disabled.",
            "Persist per-step events, snapshots, failures, and minimal metrics."
          ],
          "deliverables": [
            "Multi-step SimulationEngine",
            "Fixed RulePolicy",
            "Replayable multi-step run artifacts"
          ],
          "dependencies": [
            "P1-X"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P2-M2",
          "track": "M2",
          "title": "Implement deterministic WorldEngine",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Implement WorldInitializer and immutable WorldState transitions.",
            "Implement production, transport, consumption, and health settlement stages.",
            "Implement StateLedger, invariant checks, deterministic RNG streams, and replay tests."
          ],
          "deliverables": [
            "Real WorldEngine",
            "Physical settlement unit tests",
            "Conservation and reproducibility test suite"
          ],
          "dependencies": [
            "P1-M2",
            "P2-M1"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/WORLD_CONFIGURATION_LAYERS.md",
            "configs/scenarios/closed-economy-fixed-transport-v1.1.yaml"
          ]
        },
        {
          "id": "P2-M3",
          "track": "M3",
          "title": "Support deterministic no-market runs",
          "status": "draft",
          "completed": 0,
          "total": 2,
          "responsibilities": [
            "Keep a fixed/no-op market implementation compatible with the real WorldEngine.",
            "Verify the market StateView contains no mutable WorldState references.",
            "Write contract tests for empty orders, fixed trades, and rejected settlements."
          ],
          "deliverables": [
            "No-op/fixed market adapter",
            "Engine-market contract tests"
          ],
          "dependencies": [
            "P1-M3",
            "P2-M2"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P2-M4",
          "track": "M4",
          "title": "Support deterministic fixed planning",
          "status": "draft",
          "completed": 0,
          "total": 2,
          "responsibilities": [
            "Keep fixed plan and labor assignment implementations compatible with the real WorldEngine.",
            "Verify WorldEngine rejection and partial/atomic failure semantics with M2.",
            "Write contract tests for empty and fixed plans."
          ],
          "deliverables": [
            "Fixed planning adapter",
            "Engine-planning contract tests"
          ],
          "dependencies": [
            "P1-M4",
            "P2-M2"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P2-X",
          "track": "X",
          "title": "Coordinate deterministic-world integration",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Confirm the settlement order and shared deterministic test fixture.",
            "Run the Gate 2 integration meeting and record failed invariants by owner.",
            "Prevent mechanism algorithms or LLM work from entering the phase scope."
          ],
          "deliverables": [
            "Approved deterministic fixture",
            "Gate 2 test report",
            "Updated task and dependency status"
          ],
          "dependencies": [
            "P2-M1",
            "P2-M2",
            "P2-M3",
            "P2-M4"
          ],
          "documents": [
            "implementation-roadmap.html",
            "development-collaboration-process.html",
            "docs/meetings/"
          ]
        }
      ]
    },
    {
      "id": "P3",
      "number": 3,
      "title": "Three Simplified Mechanisms",
      "summary": "Implement a minimal market, Lange price adjustment, Cockshott static plan, and labor matching against hand-calculable cases.",
      "gate": "Each simplified mechanism matches an independently written hand calculation and completes multiple steps through the same WorldEngine.",
      "tasks": [
        {
          "id": "P3-M1",
          "track": "M1",
          "title": "Provide mechanism selection and integration harness",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Select Market, Lange, or Cockshott through treatment configuration.",
            "Orchestrate the SimulationEngine-owned Lange loop without importing private implementations.",
            "Record every mechanism iteration and provide end-to-end test fixtures."
          ],
          "deliverables": [
            "Mechanism registry/selection",
            "Lange loop orchestration",
            "Mechanism integration test harness"
          ],
          "dependencies": [
            "P2-X"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P3-M2",
          "track": "M2",
          "title": "Execute mechanism decisions in one shared WorldEngine",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Expose sufficient read-only views to all three mechanisms under explicit information policies.",
            "Validate and settle trades, plans, transfers, allocations, and labor assignments.",
            "Provide the canonical tiny-world fixture and expected state transitions."
          ],
          "deliverables": [
            "Mechanism StateViews",
            "Decision validation and settlement",
            "Tiny-world state fixture"
          ],
          "dependencies": [
            "P2-M2",
            "P3-M1"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/WORLD_CONFIGURATION_LAYERS.md"
          ]
        },
        {
          "id": "P3-M3",
          "track": "M3",
          "title": "Implement simple market clearing",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Implement validated batch orders, deterministic sorting, matching, and a simple clearing price.",
            "Implement TrialPriceMarketPort and excess-demand calculation for Lange.",
            "Test empty books, ties, insufficient inventory, no clearing, and hand-calculated trades."
          ],
          "deliverables": [
            "Simple MarketMechanism",
            "Trial-price evaluation",
            "Market unit and hand-calculation tests"
          ],
          "dependencies": [
            "P3-M1",
            "P3-M2"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P3-M4",
          "track": "M4",
          "title": "Implement Lange, Cockshott, and labor matching",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Implement initial prices, price updates, convergence status, and iteration limits for Lange.",
            "Implement a single-step Cockshott plan using demand, resources, technology, and labor time.",
            "Implement deterministic LaborMatcher with unmatched reasons and hand-calculated tests."
          ],
          "deliverables": [
            "Simple LangePlanner",
            "Static CockshottPlanner",
            "Simple LaborMatcher and unit tests"
          ],
          "dependencies": [
            "P3-M1",
            "P3-M2",
            "P3-M3"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P3-X",
          "track": "X",
          "title": "Coordinate mechanism review and Gate 3",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Assign separate issues while keeping the shared interface baseline fixed.",
            "Organize M3-M4 trial-price integration before full end-to-end integration.",
            "Collect hand calculations for Li Wenhao and Liu Chong to review."
          ],
          "deliverables": [
            "Mechanism assignments",
            "Contract and integration report",
            "Signed-off hand-calculation cases"
          ],
          "dependencies": [
            "P3-M1",
            "P3-M2",
            "P3-M3",
            "P3-M4"
          ],
          "documents": [
            "implementation-roadmap.html",
            "development-collaboration-process.html",
            "docs/meetings/",
            "docs/decisions/"
          ]
        }
      ]
    },
    {
      "id": "P4",
      "number": 4,
      "title": "LLM Integration",
      "summary": "Add observations, prompts, structured actions, budgets, and failure handling while retaining rule-based baselines.",
      "gate": "A configured LLM policy can replace a rule policy without changing SimulationEngine, WorldEngine, or mechanism APIs; malformed output, timeout, and budget exhaustion have tested outcomes.",
      "tasks": [
        {
          "id": "P4-M1",
          "track": "M1",
          "title": "Implement the complete LLM policy path",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Implement ObservationBuilder, InformationPolicy, PromptBuilder, provider adapter, parser, and schema validation.",
            "Implement token/cost/latency tracing, budgets, retry, timeout, and explicit fallback.",
            "Run the same scenarios with RulePolicy and LLMPolicy for comparison."
          ],
          "deliverables": [
            "Versioned observation and prompt schemas",
            "LLMPolicy and provider adapter",
            "Failure/budget tests and rule-baseline comparison"
          ],
          "dependencies": [
            "P3-X"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md",
            "docs/给同学的LLM社会模拟阅读材料.md"
          ]
        },
        {
          "id": "P4-M2",
          "track": "M2",
          "title": "Expose safe observations and reject infeasible LLM actions",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Implement role-specific read-only StateViews and version checks.",
            "Validate LLM-originated actions using the same rules as rule-based actions.",
            "Test stale state, impossible quantities, unauthorized transfers, and replay behavior."
          ],
          "deliverables": [
            "Actor StateViews",
            "LLM-action WorldEngine validation tests",
            "No-direct-state-write proof"
          ],
          "dependencies": [
            "P4-M1",
            "P3-M2"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P4-M3",
          "track": "M3",
          "title": "Accept structured market behavior from policies",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Map structured AgentAction into market requests without parsing free text.",
            "Return explicit rejection reasons for malformed or infeasible orders.",
            "Compare LLM orders with RulePolicy orders on identical market fixtures."
          ],
          "deliverables": [
            "AgentAction-to-order adapter",
            "Invalid order tests",
            "Rule-vs-LLM market comparison"
          ],
          "dependencies": [
            "P4-M1",
            "P4-M2",
            "P3-M3"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P4-M4",
          "track": "M4",
          "title": "Accept structured reports and labor preferences",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Define which reports, needs, or labor preferences may come from LLM-controlled agents.",
            "Keep central planning algorithms deterministic in the first LLM integration unless separately approved.",
            "Test missing, inconsistent, and adversarial reports against plan and matching interfaces."
          ],
          "deliverables": [
            "Report/preference contracts",
            "Planning input validation tests",
            "Explicit scope for LLM-controlled roles"
          ],
          "dependencies": [
            "P4-M1",
            "P4-M2",
            "P3-M4"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md"
          ]
        },
        {
          "id": "P4-X",
          "track": "X",
          "title": "Coordinate LLM scope and Gate 4",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Confirm which roles use LLMs and which remain deterministic baselines.",
            "Review failure, budget, and privacy behavior with all interface consumers.",
            "Coordinate identical-scenario RulePolicy vs LLMPolicy acceptance runs."
          ],
          "deliverables": [
            "Approved LLM role scope",
            "Failure and budget policy",
            "Gate 4 comparison report"
          ],
          "dependencies": [
            "P4-M1",
            "P4-M2",
            "P4-M3",
            "P4-M4"
          ],
          "documents": [
            "implementation-roadmap.html",
            "development-collaboration-process.html",
            "docs/meetings/"
          ]
        }
      ]
    },
    {
      "id": "P5",
      "number": 5,
      "title": "Formal Experiments",
      "summary": "Run multi-seed, fair-information experiments with shocks, ablations, confidence intervals, failure traces, and complete cost records.",
      "gate": "A versioned experiment manifest reproduces all treatments; every reported estimate links to runs, seeds, failures, model settings, and costs.",
      "tasks": [
        {
          "id": "P5-M1",
          "track": "M1",
          "title": "Build reproducible experiment orchestration",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Implement ExperimentRunner for treatment matrices, multi-seed execution, resume, and failure accounting; each run delegates to SimulationEngine.",
            "Record code/config/model/prompt versions, tokens, costs, latency, and raw failure traces.",
            "Export run indexes suitable for downstream statistics without hiding failed runs."
          ],
          "deliverables": [
            "Experiment manifest and runner",
            "Complete LLM/cost provenance",
            "Run index including failures"
          ],
          "dependencies": [
            "P4-X"
          ],
          "documents": [
            "architecture-v0-1.html",
            "experiments/manifests/RUN-000-template.json",
            "docs/RESEARCH_CHECKLIST.md"
          ]
        },
        {
          "id": "P5-M2",
          "track": "M2",
          "title": "Provide fair shocks and reproducible world streams",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Create shared realized instances, shock schedules, and RNG substreams for all mechanisms.",
            "Guarantee identical physical rules and settlement across treatments.",
            "Provide replay, invariant, and state-difference diagnostics for experiment runs."
          ],
          "deliverables": [
            "Shared instance/shock bank",
            "Cross-treatment reproducibility tests",
            "State and invariant diagnostics"
          ],
          "dependencies": [
            "P5-M1",
            "P4-M2"
          ],
          "documents": [
            "docs/WORLD_CONFIGURATION_LAYERS.md",
            "configs/",
            "docs/RESEARCH_CHECKLIST.md"
          ]
        },
        {
          "id": "P5-M3",
          "track": "M3",
          "title": "Parameterize and diagnose market treatments",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Expose approved market parameters through treatment configuration.",
            "Record prices, volumes, unfilled orders, excess demand, and deterministic tie-break evidence.",
            "Support market-specific ablations without changing WorldEngine rules."
          ],
          "deliverables": [
            "Market treatment schema",
            "Market event diagnostics",
            "Market ablation tests"
          ],
          "dependencies": [
            "P5-M1",
            "P5-M2",
            "P4-M3"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md",
            "docs/RESEARCH_CHECKLIST.md"
          ]
        },
        {
          "id": "P5-M4",
          "track": "M4",
          "title": "Parameterize and diagnose planning treatments",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Expose approved Lange, Cockshott, and labor-matching parameters through treatment configuration.",
            "Record convergence, infeasibility, allocation, unmatched labor, and computation diagnostics.",
            "Support planning-specific ablations while preserving shared information budgets."
          ],
          "deliverables": [
            "Planning treatment schema",
            "Convergence/feasibility diagnostics",
            "Planning ablation tests"
          ],
          "dependencies": [
            "P5-M1",
            "P5-M2",
            "P4-M4"
          ],
          "documents": [
            "architecture-v0-1.html",
            "docs/interfaces.md",
            "docs/RESEARCH_CHECKLIST.md"
          ]
        },
        {
          "id": "P5-X",
          "track": "X",
          "title": "Coordinate preregistration, review, and final integration",
          "status": "draft",
          "completed": 0,
          "total": 3,
          "responsibilities": [
            "Turn the approved design into assigned experiment and analysis issues.",
            "Verify that information, resources, shocks, seeds, and budgets are comparable across mechanisms.",
            "Coordinate Li Wenhao's technical review, Liu Chong's economic review, and the final evidence audit."
          ],
          "deliverables": [
            "Approved experiment matrix",
            "Cross-mechanism fairness checklist",
            "Final integration and evidence report"
          ],
          "dependencies": [
            "P5-M1",
            "P5-M2",
            "P5-M3",
            "P5-M4"
          ],
          "documents": [
            "implementation-roadmap.html",
            "development-collaboration-process.html",
            "docs/RESEARCH_CHECKLIST.md",
            "docs/decisions/",
            "docs/meetings/"
          ]
        }
      ]
    }
  ]
};
