# REGEN MAP MVP

---

[Ai MOCKUPS←](https://www.notion.so/Ai-MOCKUPS-1f257947396f80138d3ddce0ee7994bf?pvs=21)

---

<aside>
💡

Notes to explore building the MVP for the regen map website 

</aside>

[City 🌱 Digital Garden](https://digitalgarden.hypha.coop/city)

[Untapped : Knowledge Map](https://untappedjournal.com/knowledge-map)

[regen-league.vercel.app](https://regen-league.vercel.app/map)

[next-auth-human-wallet/apps/web-app at main · j-h-scheufen/next-auth-human-wallet](https://github.com/j-h-scheufen/next-auth-human-wallet/tree/main/apps/web-app)

[The New Earth Ecosystem — Gaianet](https://www.gaianet.earth/ecosystem)

https://docs.google.com/presentation/d/12_bQmjse9M2erCPQ-5s0t33xRY5N3-rqGyYAbJM7b8c/edit?slide=id.g25b32e88a54_0_78#slide=id.g25b32e88a54_0_78

[PositiveBlockchain.io | Explore the Positive Blockchain Database](https://positiveblockchain.io/database)

[ReFi Ecosystem](https://www.refidao.com/ecosystem)

[Big Map to Save the Future](https://bigmaptosavethefuture.net/)

[Restor](https://restor.eco/)

[Murmurations](https://github.com/MurmurationsNetwork)

[Catalist Network](https://www.catalist.network/)

[GEO-INFER/GEO-INFER-INTRA/docs at main · ActiveInferenceInstitute/GEO-INFER](https://github.com/ActiveInferenceInstitute/GEO-INFER/tree/main/GEO-INFER-INTRA/docs)

---

---

## INFORMATION ARCHITECTURE

Key Information Categories for Node Profiles
Core Identity Information

Name/Title
Type (individual, project, organization, company)
Location (geographic coordinates for globe mapping)
Focus area (permaculture, architecture, philosophy, etc.)
Scale of operation (local, regional, global)
Founding/start date

Relationship Information

Collaborations (past, present, planned)
Mentorship connections
Knowledge/resource sharing relationships
Funding relationships
Inspiration/influence connections

Activity Information

Projects (current, completed, planned)
Events (hosted, participated in)
Publications/resources created
Innovations/methodologies developed
Impact metrics (quantitative when available)

Dynamic Information

Recent communications/exchanges
Current initiatives/campaigns
Seasonal activities (for agricultural/ecological nodes)
Growth trajectories
Evolution of focus over time

Visualization Elements
Node Representation

Size: Could represent reach/impact/influence
Color: Primary focus area or domain (architecture, permaculture, etc.)
Shape: Type of entity (individual, organization, company, project)
Border style: Age/maturity of entity (dotted for new, solid for established)
Opacity: Activity level (more opaque = more active)
Animation: Pulsing for current high activity, still for dormant

Edge (Connection) Representation

Thickness: Strength of relationship
Color: Type of relationship (collaboration, mentorship, funding)
Line style: Duration of relationship (dotted for new, solid for established)
Direction: Flow of resources/knowledge (arrows)
Animation: Active exchanges (flowing particles along connection)

Force Graph Dynamics

Clusters naturally forming around focus areas
Temporal view option to see how connections evolve
Ability to filter by various attributes
"Gravitational pull" based on compatibility/synergy
Interactive elements that reveal deeper information on hover/click

Globe Visualization Specifics

Heat maps showing concentration of activity
Arc connections showing long-distance collaborations
Elevation representing longevity or impact in region
Time-lapse functionality showing spread of practices/ideas
Regional ecosystem health indicators

Specialized Visualization Features

Knowledge Flow Visualization: Animated particles showing how information and practices move through the network
Resource Exchange Mapping: Visual representation of material, financial, and knowledge resources being shared
Impact Ripples: Expanding circles showing how initiatives create ripple effects in communities and ecosystems
Regenerative Potential Indicator: A specialized metric that combines various factors to show where high potential for regenerative impact exists
Bioregional View: Option to group and view entities by bioregion rather than political boundaries
Complementarity Highlighter: Tool that identifies potentially complementary projects/organizations that aren't yet connected
Temporal Rhythms: Visualization of seasonal activities, showing how the network's focus shifts with natural cycles

---

Below is an **“information blueprint”** you can use as a scaffold while you collect data and later feed it into a 3-D globe (lat/long positioned) and a force-directed network graph (topology/relationship driven).

It is deliberately modular so you can start simple and keep enriching the same objects as new data arrives.

---

## 1. Core Graph Objects

| Object | Description | Typical Cardinality |
| --- | --- | --- |
| **Person** | An individual actor in the regenerative / metamodern space. | 5 000–20 000 |
| **Org** | A formal or informal collective: company, DAO, foundation, lab, fund, network, community of practice, etc. | 1 000–5 000 |
| **Edge** | A directed or undirected connection between any two nodes. Multiple edge types allowed between the same pair. | 10 × nodes (≈50 000–200 000) |

---

## 2. Node Fields (what you store on every object)

### 2.1 **Person**

| Cluster | Field (camel-case) | Example / Allowed values | Why it matters |
| --- | --- | --- | --- |
| **Identity** | `fullName` | “Dr. Karen O’Brien” | canonical label |
|  | `aka` | “Karen OBrien”, “@karenobri” | alias search |
|  | `pronouns` | “she/her” | ethical UX |
| **Position & Affiliation** | `primaryRole` | “Professor of Human Geography” | quick glance |
|  | `affiliations[]` | [{orgId, role, start, end}] | time-sliced ties |
| **Location** | `hqLat`, `hqLon` | 59.91, 10.75 | globe coordinates |
|  | `locality` | Oslo, Norway | hover-text |
| **Movement Focus** | `domainTags[]` | “Regenerative Ag”, “Metamodernism” | hierarchical faceting |
|  | `sdgTags[]` | SDG03, SDG13, SDG17 | UN comparability |
|  | `methodTags[]` | “Doughnut Economics”, “Permaculture” | “how they work” |
| **Outputs & Influence** | `keyWorks[]` | [{title, year, uri, type}] | drill-downs |
|  | `metrics` | {citations, followers, hIndex,…} | node size/weight |
| **Contact & Media** | `urls[]` | web, X, LinkedIn, ORCID | harvest pipelines |
| **Meta** | `lastVerified` | ISO 8601 | freshness filter |

### 2.2 **Organization**

| Cluster | Field | Example / Allowed values | Purpose |
| --- | --- | --- | --- |
| **Identity** | `orgName` | “Re-Alliance” | primary label |
|  | `aka` | “ReAlliance” | alt search |
|  | `legalType` | non-profit, DAO, B-Corp, coop, public-benefit LLC… | governance insights |
| **Mission & Scope** | `mission` | one-sentence statement | on-hover summary |
|  | `foundedYear` | 2018 | timeline |
|  | `regionScope` | local, national, regional, global | map filter |
|  | `programAreas[]` | “Ecovillage retrofit”, “Field schools” | tag-based legend |
| **Financial** | `fundingModel` | grants, crowd-fund, blended-finance… | edge heuristics |
|  | `assetsUSD` | 8 500 000 | size encoding |
| **Location** | `hqLat`, `hqLon`, `locality` | as above | globe layer |
| **Impact** | `impactKPIs[]` | {indicator, unit, value, year} | bubble scaling |
| **Links** | `urls[]` | site, GitHub, Obsy DAO gateway | live crawl |
| **Meta** | `lastVerified` | ISO 8601 | recency |

---

## 3. Tagging Ontology (pick lists)

### 3.1 *Domain* (WHAT they work on)

Regenerative Ag • Biodiversity • Water Cycles • Circular Materials • Post-capitalist Finance • Distributed Governance • Systems Literacy • Inner Development (IDGs) • Culture & Story • Crisis Response • Tech4Good • Planetary Health • Indigenous Stewardship • etc.

### 3.2 *Method* (HOW they work)

Permaculture • Doughnut Economics • Active Inference • TEAL-Organization • Biomimicry • Holonic Finance • Community Land Trust • Web3/DAO • AI-augmented Research • Citizen Science • Adaptive Management • etc.

### 3.3 *SDG Cross-walk*

Use official SDG codes (SDG01-17) so your dataset can plug into existing ESG dashboards.

### 3.4 *Theory / Lens* (WHY they frame the meta-crisis the way they do)

Complexity Science • Metamodernism • Integral Theory • Game B • Indigenous Cosmology • Systems Poetics • Deep Adaptation • Cybernetics • Polymathic Futures • etc.

---

## 4. Edge Types & Edge Fields

| Edge type (`edgeType`) | Typical direction | Minimal fields | Optional |
| --- | --- | --- | --- |
| **Collaboration** | Person↔Person, Person→Org, Org↔Org | {since, until, projectName} | weight (hours), fundingUSD |
| **Employment / Affiliation** | Person→Org | {role, start, end, FTE%} |  |
| **Funding / Investment** | Org→Org | {amountUSD, date, vehicle} | SDG alignment |
| **Membership** | Person→Org, Org→Org | {membershipType, since} | duesUSD |
| **Mentor / Advisor** | Person→Person | {since, intensity1-5} |  |
| **Publication Co-authorship** | Person↔Person | {workId} | citations |
| **Event Participation** | Person→Org (event host) | {eventId, role, date} |  |
| **Shared Board Seat** | Person↔Org, Person↔Person | {orgId, since} |  |

*Universal edge metadata:* `sourceDoc` (URL or DOI), `lastVerified`, `confidenceScore` (0-1).

---

## 5. Visual-Encoding Recipe

| Visual Surface | Encoding | Rationale |
| --- | --- | --- |
| **3-D Globe** | *Latitude/Longitude* → node position | “Real world” anchor |
|  | Node size → `metrics.influence` (people) / `assetsUSD` or `impactKPIs` (orgs) | easy scan |
|  | Node color → top-level `domainTags` (12-color palette) | thematic clustering |
|  | Halo / ring → `methodTags` frequency | show methods diversity |
| **Force-Graph** | Node charge by influence metric | denser hubs repel/attract |
|  | Link thickness → `weight` or `amountUSD` | importance |
|  | Link color → `edgeType` (collab, funding, mentor…) | multi-layer legibility |
|  | 2-D or 3-D toggle | network vs geo-agnostic view |

Edge bundling + curved links help readability when many ties converge on hubs.

---

## 6. Recommended Data Pipeline (high-level)

1. **Seed list** – start from 50–100 well-known exemplars (e.g., Daniel Christian Wahl, Buckminster Fuller Institute, Re-Alliance, Common Earth, Kevin Kelly, Nori, etc.).
2. **Automated enrichment** – scrape ORCID, Crossref, Crunchbase, GitHub, Mastodon, X/Twitter bios, IRS-990 datasets, Open Secrets, EU NGO register.
3. **Manual curation** – vet tags, merge duplicates, score confidence.
4. **Graph database** – Neo4j or TigerGraph with spatial extension (point data) + GraphQL/GRANDstack API.
5. **Visualization layer** –
    - Globe: Deck.gl + ScatterplotLayer + ArcLayer for edges.
    - Force graph: three.js or d3-force-3d with node-search sidebar.
6. **Feedback loop** – public “suggest a node/correction” form feeding into moderation queue.

---

## 7. Stitching the Two Layers Together

- Treat **Person ↔ Org** edges as one full sub-graph; hide or show them on demand.
- In globe mode you may want to **collapse local clusters** into “city-spheres” (convex hull of points within e.g. 30 km) when zoomed out.
- Force graph can run **two simultaneous layouts** (people only / orgs only) and blend them with a slider to reveal cross-links.

---

### Quick-start JSON schema snippet (simplified)

```json
{
  "nodes": [
    {
      "id": "person:1234",
      "type": "Person",
      "fullName": "Dylan Tull",
      "hqLat": 45.7108,
      "hqLon": -85.9846,
      "domainTags": ["Regenerative Design", "Metamodernism"],
      "methodTags": ["Holonic Finance"],
      "metrics": {"followers": 12000}
    },
    {
      "id": "org:5678",
      "type": "Org",
      "orgName": "Blue Horizon Properties",
      "hqLat": 45.1621,
      "hqLon": -86.0213,
      "programAreas": ["Eco-development"],
      "assetsUSD": 12000000
    }
  ],
  "edges": [
    {
      "source": "person:1234",
      "target": "org:5678",
      "edgeType": "Founder",
      "since": "2024-04-19"
    }
  ]
}

```

---

### How to expand from here

- **Test-import** a micro-dataset (20 nodes) into Neo4j → run basic Cypher queries to validate your schema.
- **Develop tagging guidelines** so multiple curators apply tags consistently.
- **Define edge-weight rules** (e.g., funding = log(amountUSD), co-authorship = #papers) before you design visual thickness scale.
- **Iterate the ontology**: as soon as you spot “Other” values piling up, split or merge tags until the distribution feels balanced.

---

Use this blueprint as a living document—every field, tag list, and edge type can grow organically as the map matures, but starting with clear, granular categories today will spare you painful retro-fits later. Good luck charting the regenerative constellation!

---

---

Below is a **field-by-field catalogue** that merges everything a person or organization typically publishes across LinkedIn, X/Twitter, Facebook, GitHub, Medium, Crunchbase, company registries, grant databases, etc.

Each entry notes **where the data usually lives**, **how to store it**, and **why it is useful** for your globe layer or force-graph analysis.

Use it as a master checklist—you can ignore fields that feel noisy and add custom ones later.

---

## 1 · PERSON NODE

| 🔑 Cluster | Field (DB key) | Typical Source(s) | Storage Type | Graph / UX Value |
| --- | --- | --- | --- | --- |
| **Identity** | `fullName` | LinkedIn name card | string | Primary label |
|  | `displayHandle` | @handle on X, Mastodon | string | Mention parsing / handle hover |
|  | `aka[]` | other spellings, native scripts | array | Fuzzy dedup |
|  | `profileImage` | LinkedIn, X avatar URL | uri | Quick-ID thumbnail |
|  | `pronouns` | LinkedIn | enum | Inclusivity search |
|  | `birthYear` | FB profile, ORCID | int | Age cohort analytics |
|  | `citizenship[]` | FB “from”, LinkedIn “location” | array | Diaspora patterns |
| **Professional** | `headline` | LinkedIn headline | string | One-line tooltip |
|  | `currentTitle` | LinkedIn Experience[0] | string | Role inference |
|  | `currentOrgId` | LinkedIn | fk → Org | Edge: Employment |
|  | `workHistory[]` | LinkedIn Experience list | array {orgId, title, start, end} | Tenure timelines |
|  | `education[]` | LinkedIn Education list | array {school, degree, field, gradYear} | Alumni clustering |
|  | `certifications[]` | LinkedIn, Credly | array | Skill credibility |
| **Skills & Expertise** | `skills[]` | LinkedIn + endorsed count | array{skill, endorsements} | Similarity edges (“people who code regenerative-finance”) |
|  | `languages[]` | LinkedIn, ORCID | array | Multilingual connectors |
| **Influence Metrics** | `followersX`, `followersLinkedIn`, `newsletterSubs`, `hIndex` | APIs / scraping | ints | Node sizing, time-series growth |
|  | `listsOnX`, `twitterEngageRate` | X | ints / floats | Engagement quality |
| **Content & IP** | `pinnedTweets[]`, `topPosts[]` | X, LinkedIn articles | array | Topic mining |
|  | `publications[]` | ORCID, Crossref | array {doi, year, title} | Co-authorship edges |
|  | `repos[]` | GitHub | array | Open-source graph |
|  | `speakingEvents[]` | Event sites, YouTube | array{eventId, role, date} | Influence layer |
| **Networks & Memberships** | `groupsLinkedIn[]` | LinkedIn | array | Hidden affinity edges |
|  | `fbGroups[]` | FB | array | Community clusters |
|  | `daoMemberships[]` | Snapshot, DeepDAO | array | Web3 sub-graph |
|  | `mentors[] / mentees[]` | LinkedIn “volunteering” or self-declared | array | Career pathways |
| **Tags / Taxonomy** | `domainTags[]`, `methodTags[]`, `sdgTags[]`, `theoryTags[]` | manual + NLP | arrays | Faceted filtering |
| **Contact** | `emailHash`, `publicEmail`, `dmLinks[]` | LinkedIn, website | hashed / uri | Outreach workflow |
| **Trust & Verification** | `blueCheckX`, `credentialedLinkedIn`, `humanIDProof` | platform flags / PoH | booleans | Weighting confidence |
| **Geodata** | `hqLat`, `hqLon`, `locality`, `timeZone` | LinkedIn, FB, IP clues | geo types | Globe pin position |
| **Meta** | `dataSources[]`, `lastScraped`, `confidenceScore` | internal | arrays / ISO date / float | Provenance & freshness |

---

## 2 · ORGANIZATION NODE

| 🔑 Cluster | Field (DB key) | Typical Source(s) | Storage Type | Graph / UX Value |
| --- | --- | --- | --- | --- |
| **Identity** | `orgName` | LinkedIn Page, Crunchbase | string | Primary label |
|  | `aka[]` | DBA names, native lang | array | Search / dedup |
|  | `legalType` | Sec filings, OpenCorporates | enum | Governance analysis |
|  | `brandLogo` | Website, FB page | uri | Pin icon |
| **Mission, Vision, Values** | `tagline`, `missionStmt`, `visionStmt` | Website / LinkedIn “About” | strings | Tooltip blurb |
|  | `coreValues[]` | handbook, B-Corp report | array | Cultural compatibility edges |
| **Sector & Scope** | `industryCodes[]` | NAICS, B-Corp, Crunchbase | array | Sector filtering |
|  | `regionScope` | global / regional / local | enum | Map zoom presets |
| **Operational Scale** | `employeeRange`, `revenueRangeUSD`, `assetsUSD` | LinkedIn, D&B, IRS-990 | int / ranges | Node radius |
|  | `volunteerCount` | FB causes, Annual report | int | *Civil-society heft* |
| **Financial Lineage** | `fundingRounds[]` | Crunchbase | array{roundType, amountUSD, date, leadInvestorId[]} | Investor-startup graph |
|  | `grantsReceived[]` | Foundation Center, EU CORDIS | array{funderId, amountUSD, program, date} | Grant network |
|  | `grantsGiven[]` | 990-PF, Ledger of Harms | array{recipientId,…} | Philanthropy map |
| **Impact Metrics** | `impactKPIs[]` | Annual impact report | array{indicator, value, unit, year} | Scaled bubbles |
|  | `sdgContribution[]` | SDG report | array | Global goal overlay |
| **Certifications** | `bCorpScore`, `iso14k`, `fairTrade`, `scienceBasedTargets` | directories | booleans / numerics | Trust filters |
| **Programs & Products** | `flagshipProjects[]` | website / GitHub | array{name, uri, domainTags[]} | Content drill-down |
| **Org Structure** | `parentOrgId`, `subsidiaryIds[]`, `daoTokenContract` | OpenCorporates, Etherscan | ids / address | Corporate tree |
|  | `boardMembers[]`, `execTeam[]` | LinkedIn | array | Force-graph bipartite |
| **Community Presence** | `followersX`, `followersLinkedIn`, `newsletterSubs` | APIs | ints | Influence sizing |
|  | `eventSeries[]` | Eventbrite, FB Events | array{eventId, cadence} | Temporal pulse |
| **Repositories & IP** | `openSourceRepos[]`, `patentIds[]`, `datasets[]` | GitHub, USPTO | array | Innovation lens |
| **Contact & Channels** | `hqLat`, `hqLon`, `locality` | LinkedIn page | geo | Globe anchor |
|  | `urls[]` | site, docs, FAQ, support email | array | Outreach |
| **Meta** | `dataSources[]`, `lastScraped`, `confidenceScore` | internal | bookkeeping |  |

---

## 3 · CROSS-PLATFORM DEDUP & NORMALISATION

1. **Resolve by handle → entity**
    
    *Hash canonical handles* (`@karenobri`) to the same person ID even if platforms differ.
    
2. **Merge duplicate name + location + org trifecta**
    
    –  Levenshtein < 2 → probable duplicate.
    
    –  Manual override flag `mergeConfirmed`.
    
3. **Attribute-level freshness**
    
    Keep a `lastSeen.platform` dict and always surface the newest value unless an older value has higher authority (e.g., SEC filing trumps a LinkedIn volunteer estimate).
    
4. **Source weighting for confidenceScore**
    
    Government registry = 1.0, SEC file = 0.9, LinkedIn self-report = 0.5, scraped tweet = 0.3.
    
    Propagate **min(confidence of attributes)** to node-level score for visual opacity.
    

---

## 4 · DERIVED EDGES (how the new fields unlock insights)

| Edge Logic | Source Field(s) | Use-case |
| --- | --- | --- |
| **Skill-Affinity** | Jaccard similarity of `skills[]` > 0.3 | Suggest collaborators; cluster the force-graph |
| **Hashtag-Discourse** | Top X hashtags ↔ Org domains | Trace narrative memes |
| **Co-Event** | `speakingEvents[]` overlap | Timeline-based community snapshots |
| **Open-Source Dependency** | `repos[]` forks & stars | Software sub-ecosystem |
| **Investor→Startup** | `fundingRounds[].leadInvestorId` | Capital flows |
| **Shared Values** | Cosine similarity on `coreValues[]` | Partnership prediction |
| **Mentions / Retweets** | π-day window of X data | Real-time influence ripples |

---

## 5 · WHY EACH PLATFORM ADDS UNIQUE SIGNAL

| Platform | “Extra” Fields Not Found Elsewhere | Value Added |
| --- | --- | --- |
| **LinkedIn** | Endorsement counts, Recommendations, Alumni graph | Quantifies reputation & tacit mentoring lines |
| **X/Twitter** | Hashtag taxonomy, real-time retweet network, Lists follows | Maps live discourse & opinion leaders |
| **Facebook** | Group membership, Event RSVPs | Grass-roots communities & offline gatherings |
| **GitHub** | Commit graph, Issue mentions | Technical collaboration intensity |
| **Medium/Substack** | Article claps, comment threads | Long-form thought leadership |
| **Crunchbase/AngelList** | Funding chronology, investor syndicates | Financial scaffolding |
| **ORCID/Crossref** | DOI-backed outputs, citation graph | Academic authority |
| **OpenCorporates** | Directors, legal filings, UBO data | Compliance & governance relationships |

---

## 6 · IMPLEMENTATION CHECKLIST

1. **Data contracts**—write JSON Schemas for Person and Org based on the tables above.
2. **ETL scripts**—one per platform; normalize into staging tables.
3. **Merge pipeline**—entity-resolution module; flag conflicts for human review.
4. **Graph DB ingest**—Cypher or Gremlin queries to create/update nodes + edges.
5. **Visual layer hooks**—decide which attributes drive size, color, tooltip, filters.
6. **Privacy guardrails**—strip personal emails, birthdates unless explicit consent.
7. **Refresh cadence**—LinkedIn weekly, X daily, Crunchbase quarterly, registry yearly.

Use this enriched field map to **capture every scrap of public context** without bloating your graph with duplicate noise. You’ll be able to pivot from *geospatial constellations* on the 3-D globe to *relational heat-maps* in the force-directed view—all driven by data people already expect to share on mainstream platforms.

### ⚡️Side-Panel Wireframe (on node click)

```
┌─────────────────────────────────────────────────────────────┐
│ ① HEADER                                                   │
│ ─────────────────────────────────────────────────────────── │
│ [avatar]  Dr. Karen O’Brien         ●  Oslo, Norway        │
│ Professor of Human Geography @ Univ. of Oslo               │
│ Regenerative Design · Metamodernism                        │
│                                                             │
│ [ Follow ]   [ Message ]   [ View on Globe ]               │
├─────────────────────────────────────────────────────────────┤
│ ② QUICK-STATS                                              │
│ Followers   Citations   h-Index    Mentions (30d)   Nodes  │
│  38 k        5 412       42             97          128    │
├─────────────────────────────────────────────────────────────┤
│ ③ RELATION RADAR  (mini force-bundle, 120 px square)       │
│  • Top 3 orgs (employment)                                  │
│  • 5 strongest collab edges (people)                        │
│  • Hover → highlight in main canvas                         │
├─────────────────────────────────────────────────────────────┤
│ ④ BIO / OVERVIEW                                           │
│ “Professor researching social-ecological transformations    │
│  & inner development goals. Co-author of *You Matter…*”     │
│                                                             │
│ ▸ View full résumé (expands)                                │
├─────────────────────────────────────────────────────────────┤
│ ⑤ TAG STACK                                                │
│  Domain:  Biodiversity · Climate Adaptation · Culture       │
│  Methods: Permaculture · Doughnut Economics                 │
│  SDG: 03 · 13 · 17                                          │
│  Lenses: Metamodernism · Integral Theory                    │
│  Skills: Systems Mapping (97) · Foresight (88) …            │
├─────────────────────────────────────────────────────────────┤
│ ⑥ TIMELINE (Spark-view 200 px)                              │
│ 1998  Joined IPCC WG II                                     │
│ 2009  Published “Climate Change…People” (2 300 cites)       │
│ 2018  Founded cCHANGE                                       │
│ 2024  Keynote @ RegeneraCon                                 │
├─────────────────────────────────────────────────────────────┤
│ ⑦ LINKS & MEDIA                                            │
│  🌐 Website       @karenobri       ORCID 0000-…           │
│  📄 Latest paper (2025)    🎥 TEDx talk (14 min)            │
├─────────────────────────────────────────────────────────────┤
│ ⑧ DATA SOURCES & VERIFICATION                              │
│  • LinkedIn 2025-05-01   • ORCID 2025-04-28                 │
│  • Crossref   • X API    • OpenAlex                         │
│  Confidence score: 0.86                                     │
└─────────────────────────────────────────────────────────────┘

```

---

### Component Breakdown & Rationale

| # | Section | UX Purpose | Data fields used |
| --- | --- | --- | --- |
| **① Header** | Instant recognition; primary actions. | `fullName`, `avatar`, `locality`, `currentTitle`, `domainTags[]` |  |
| **② Quick-Stats row** | Size cues & comparison across nodes; feeds search sort. | `followersX`, `citations`, `hIndex`, rolling-30-day mention count, *degree centrality* |  |
| **③ Relation Radar** | Mini force-layout of strongest edges for context without leaving focus. | Top-N edges by `weight`; encoded by color = edgeType |  |
| **④ Bio / Overview** | Human narrative; collapsible for brevity. | `headline`, `missionStmt` (if person), key quote |  |
| **⑤ Tag Stack** | Faceted click-through filtering; chips double as search pivot. | `domainTags`, `methodTags`, `sdgTags`, `theoryTags`, top 5 `skills` |  |
| **⑥ Timeline Spark** | Visual career cadence; detects dormant vs hyperactive actors. | `workHistory`, `speakingEvents`, `publications[]`, `fundingRounds[]` (if founder) |  |
| **⑦ Links & Media** | Deep dives; fetch-on-demand to keep panel light. | `urls[]`, `pinnedTweets[]`, `keyWorks[]` |  |
| **⑧ Data Sources** | Transparency & trust; flag stale data. | `dataSources[]`, `lastScraped`, `confidenceScore` |  |

---

### Interaction Flows

1. **Hover in radar ➜ highlight** the same edge/node in the main canvas (bi-directional cue).
2. **Click a Tag chip** ➜ applies a global filter, re-runs force-layout to spotlight that theme.
3. **Click Timeline dot** ➜ deep side-drawer with event details (slides in over panel).
4. **“View on Globe”** ➜ camera fly-to on 3-D earth with same node selected.
5. **Hold ⇧ and hover** ➜ temporarily show *secondary* edges (e.g., group memberships hidden by default).

---

### Visual Style Notes

- Panel width ~340 px; scroll-y inside, never obscures canvas zoom controls.
- Use **color accents pulled from node color** (domain tag) for headings and progress bars.
- Adopt a **dark-mode-friendly** palette (deep navy background, 8%-opacity separators).
- Animate counts (odometer roll) on first open to give lively feedback.

---

### Minimal Graph-DB Query (Neo4j/Cypher) to populate panel

```
MATCH (p:Person {id:$nodeId})
OPTIONAL MATCH (p)-[r:COLLABORATION|MENTOR|EMPLOYED_BY]-(n)
WITH p, r ORDER BY r.weight DESC LIMIT 8
RETURN p {
    .*,
    topEdges: collect({type:type(r), weight:r.weight,
                       otherId: n.id, otherLabel: coalesce(n.fullName,n.orgName)})
}

```

Feed that JSON to the front-end component; let client code hydrate avatar URLs and followers via cached API responses to avoid rate-limit spikes.

---

This mockup keeps **high-signal, low-noise context one click away**, while heavy data (full CV, all posts) remains lazily loaded, preserving graph performance.

---

Below is an **extension pack** that turns every person-card into a *live matchmaking console*—surfacing their ego-network topology, revealing structural power, and auto-recommending the best humans / orgs to fulfil their *needs* and amplify their *purpose*.

---

## 1 · New Data Fields

| Cluster | Field | Type | Description |
| --- | --- | --- | --- |
| **Purpose Layer** | `purposeStmt` | string | Concise “why I’m here” sentence (from LinkedIn headline, personal site “About”, or a short prompt you ask them to fill). |
|  | `impactGoals[]` | enum | Normalised set (e.g. “Regenerative Food”, “Polycrisis Education”). |
| **Needs & Offers** | `needs[]` | tag + free-text | Resources actively sought (capital, talent, pilot site, research data…). |
|  | `offers[]` | tag + free-text | Skills / assets they can give (grant writing, land access, AI modelling…). |
| **Network Metrics** | `degreeCentrality`, `betweenness`, `clusterId`, `bridgingScore` | float / int | Pre-computed in the Graph-DB; update weekly. |
| **Recommendation Cache** | `matchSuggestions[]` | [{targetId, score, reason}] | Refresh nightly by batch job. |

> Tip – Store the raw free-text “asks/offers” plus the NLP-extracted tag so users can still read the nuance.
> 

---

## 2 · Algorithms Behind the Magic

### 2.1 Matching Formula (person ↔ person / org)

```
matchScore =
  0.35 * NeedsOffersOverlap
+ 0.25 * PurposeCosineSimilarity
+ 0.15 * DomainMethodJaccard
+ 0.15 * Weak-TieBridgeBoost
+ 0.10 * GeoProximityBoost

```

- **NeedsOffersOverlap** – bipartite tag match: needᵢ ∈ offersⱼ or vice-versa.
- **PurposeCosineSimilarity** – sentence-embedding (e.g. MiniLM) on `purposeStmt`.
- **Weak-TieBridgeBoost** – up-weight pairs in *different* Louvain clusters if both have high `betweenness` (“bridge builders”).
- **GeoProximityBoost** – logistic curve on km distance; optional toggle.

> Edge type created: (:Person)-[:RECOMMENDED {score, reason[]}]->(:Person|:Org)
> 

### 2.2 Supply–Demand Heat-map (macro view)

Aggregate `needs[]` and `offers[]` by tag → show red (unmet demand) vs green (oversupply). Use this to steer onboarding campaigns.

### 2.3 Live Suggestions (client-side)

When a user opens a side panel run a **delta query**:

```
MATCH (me:Person {id:$id})-[:RECOMMENDED]->(cand)
WHERE NOT (me)--(cand)          // hide already-connected
RETURN cand
ORDER BY cand.score DESC
LIMIT 5

```

Return name, avatar, score, and `reason[]`.

---

## 3 · Updated Side-Panel Wireframe (delta from previous)

```
┌───────────────────────────────────────────────┐
│ ① HEADER …                                   │
├───────────────────────────────────────────────┤
│ ② NETWORK METRICS                            │
│  Degree 128 · Betweenness 0.42 · Cluster #7  │
│  Bridge Rank ▲ Top 5%                        │
│  (hover 🛈 for formula)                      │
├───────────────────────────────────────────────┤
│ ③ EGO-NETWORK MINI-MAP  ⟳ focus toggle       │
│  • Concentric rings by hop-distance          │
│  • Nodes coloured by clusterId               │
│  • Click ≙ zoom main canvas to same view     │
├───────────────────────────────────────────────┤
│ ④ PURPOSE & GOALS                            │
│  “Catalysing social-ecological transformations…” |
│  Goals: ① Climate Adaptation ② Inner Dev     │
├───────────────────────────────────────────────┤
│ ⑤ NEEDS ↔ OFFERS (chips are clickable)       │
│  Needs: 〚Systems Funding〛 〚LatAm Field Site〛|
│  Offers: 〚Transdisciplinary Research〛 …     │
├───────────────────────────────────────────────┤
│ ⑥ TOP 5 SUGGESTED MATCHES                    │
│  1. 🌐 Common Earth (score 92)               │
│     • Matches your Need→Grantwriting         │
│  2. 👤 Dr. Samir Doshi (88)                  │
│     • Shared purpose + offers “Impact Lab”   │
│  3. …                                        │
│  [ View all 20 » ]    [ Auto-introduce ✉ ]   │
├───────────────────────────────────────────────┤
│ ⑦ LINKS, TIMELINE, SOURCES … (unchanged)     │
└───────────────────────────────────────────────┘

```

**Interactions**

- Clicking a *Need* chip instantly filters the match list to nodes whose *Offers* satisfy it.
- “Auto-introduce” fires a webhook / email template pre-filled with both parties’ purpose + overlapping tags.
- Toggle “focus” in the Ego-map to *hide* global graph and run a quick force-layout on only 2-hop neighbourhood → reveals hidden structural holes.

---

## 4 · Storage & Pipeline Add-Ons

1. **Needs/Offers Ingestion**
    - parse LinkedIn “Open to” section, Twitter bios (#lookingFor), GitHub READMEs, and custom onboarding form with autocomplete tags.
2. **Purpose Extraction**
    - use the first 140 chars of LinkedIn “About”; if missing, prompt the user (“Write your 1-sentence purpose”).
3. **Graph Data Science**
    - Weekly job: `CALL gds.betweenness.stream(...)` → write back to nodes.
    - Louvain or Leiden for `clusterId`.
4. **Recommendation Job**
    - Nightly Spark or GDS pipeline computing `matchScore`; write top-N per node into `matchSuggestions[]`.

---

## 5 · Privacy & Social Friction

- Let users mark any `needs[]` or `offers[]` as **Private** (panel shows lock icon; still used for *their* recommendations but not exposed to others).
- Default “Auto-introduce” is **double-opt-in**—candidate must click “Accept intro” before contact is revealed.
- Surface a **“why am I seeing this?”** tooltip listing the tag overlaps and network metrics behind each suggestion.

---

With these extensions the map is no longer a static Rolodex but a **living socio-technical fabric** that:

- **Exposes topology** – central hubs, bridges, isolated clusters.
- **Matches supply & demand** – needs vs offers tags.
- **Aligns on purpose** – narrative proximity via embeddings.
- **Respects privacy** – opt-in data and consented introductions.

Plug the same schema into your 3-D globe (just colour pins by unmet-needs density) and into the force-graph (edge bundling + match suggestions as ghosted links) to give users an immediate, actionable view of *who* to connect with *why*, and *how* it advances the regenerative meta-movement.

---

### Figma-Ready UI Spec

*(everything you need on-screen—no back-end or code details)*

---

## 1. Primary Screens & Layout

| Screen | Main Canvas | Fixed UI Elements | Purpose |
| --- | --- | --- | --- |
| **A. Landing / Overview** | Hero banner (full-width image or looping globe GIF) | • Logo & site name• Tagline• “Enter Map” button | Sets tone; one-click onboarding |
| **B. 3-D Globe View** | Deck.gl / Web-style globe occupying 70 % width | **Left:** vertical toolbar (Home, Globe, Graph, Filters)**Top-right:** search bar | Geographic discovery |
| **C. Force Graph View** | 100 % canvas (dark background) | **Right:** collapsible Side Panel (node details)**Top:** graph controls (layout, time-slider) | Relationship deep-dive |
| **D. List / Directory** | Table or card grid | Sorting / filter chips | Quick scanning & administrative edits |

---

## 2. Visual Encoding Cheat-Sheet

| Attribute | Globe Pin | Graph Node |
| --- | --- | --- |
| **Size** | Impact metric (e.g., followers, assets) | Degree centrality |
| **Fill Color** | Domain tag (selectable palette of ~12) | Domain tag |
| **Stroke Shape** | • Circle = Person• Hex = Org | Same shapes |
| **Border Style** | Solid = established (>3 yrs)Dotted = new | Same |
| **Opacity** | Recent activity score (last 90 d) | Same |
| **Pulse Animation** | “Hot” nodes (≥ 2 active projects) | Orbit glow |

Edge (Graph only)

- **Thickness:** relationship strength
- **Color:** relationship type (collab = teal, mentor = yellow, funding = violet)
- **Arrowhead:** direction of value/knowledge flow
- **Dashed:** planned / proposed

---

## 3. Core UI Components (Figma frames)

1. **Top Navigation Bar (64 px)**
    - Logo, “Regen Map” text
    - Search (node name, tag, place)
    - Profile icon / menu (optional)
2. **Vertical Toolbar (56 px icons)**
    - 🏠 Home
    - 🌐 Globe
    - 🕸️ Graph
    - 🔎 Filters
    - 📑 Directory
3. **Filter Drawer (320 px, left slide-out)**
    - **Domain** multi-select chips
    - **Method** dropdown
    - **Relationship type** checkboxes
    - **Activity slider** (inactive → very active)
    - **Date range** picker (for temporal view)
    - “Apply / Reset” buttons
4. **Side Panel (Person / Org) (360 px, right)**
    
    
    | Zone | What to show | Notes |
    | --- | --- | --- |
    | **Header (96 px)** | Avatar, Name, Location flag | Big & recognisable |
    | **Role line** | Title @ Org (for people) OR Tagline (for org) | Single line |
    | **Quick Stats bar** | Followers / Assets · Projects · Connections | 3–4 mini stats |
    | **Focus Chips** | Domain · Method · SDG | Colored, clickable |
    | **Needs ↔ Offers** | Two chip groups | Hover tooltip shows free-text |
    | **Mini-network** | 120 px circular ego-graph | Top five links |
    | **Timeline Spark** | Thin horizontal bar w/ 4–5 dots | Hover = event label |
    | **Action Buttons** | “Message”, “View on Globe”, “Intro” | Primary CTA first |
    | **Source footnote** | “Updated May 2025 · Confidence 86 %” | Small gray text |
5. **Legend Overlay (bottom-right, 220 px)**
    - Color <> domain list
    - Shape <> entity type
    - Edge color keys
6. **Time-Slider (Graph/Globe)**
    - Range 2000 - Present
    - Play / pause animation

---

## 4. Minimal Data Points to Design Around

| Person Card | Org Card |
| --- | --- |
| Name | Name |
| Profile photo | Logo |
| Location city / country | HQ city / country |
| Role + employer | Tagline / mission |
| **Stats:** followers, projects, connections | **Stats:** assets $, staff, projects |
| **Focus:** 1–2 domain tags | Focus tags |
| Needs & Offers list (max 3 each) | Programs list (max 3) |
| Top 3 connections (avatars) | Top 3 partners (logos) |
| Last active date | Founded year |
| Update + confidence line | Update + confidence line |

*Design tip: keep every text block ≤ 45 chars so it never wraps awkwardly.*

---

## 5. Interaction States to Mock

| State | Visual Cue |
| --- | --- |
| **Node hover** | Larger halo; line weight up on connected edges |
| **Node selected** | Sticky highlight, side panel opens |
| **Edge hover** | Edge glows, both endpoint nodes pulse |
| **Filter active** | Dim non-matching nodes (30 % opacity) |
| **Timeline scrub** | Nodes fade in/out chronologically |
| **Suggested match (dashed ghost edge)** | Appears on side panel toggle “Show suggestions” |

---

## 6. Micro-Copy & Labels (ready to paste)

- Search placeholder: *“Find people, orgs, domains…”*
- Stats labels: *Followers · Projects · Links*
- Needs header: **Currently seeking**
- Offers header: **Can provide**
- Side-panel CTA buttons: **Connect**, **Message**, **Intro**
- Confidence tooltip: *“Higher score = more verified sources”*
- Empty state (graph): *“Zoom or adjust filters to reveal nodes.”*

---

## 7. Color & Typography Swatches

| Purpose | HEX (dark-mode) |
| --- | --- |
| Background | #0D0D14 |
| Card / Panel | #1B1B26 |
| Text primary | #EDEDED |
| Text secondary | #A0A0B8 |
| Accent (buttons) | #3FD7C3 |
| Domain palette | 12 distinct hues (e.g., regen-green #4CAF50, finance-blue #3A8DFF, culture-rose #FF5D8F …) |

Typeface suggestion: **Inter** (UI) + **Source Sans Pro** (numbers).

---

### Deliverables to Build in Figma

1. **Page frames:** Landing, Globe, Graph, Directory.
2. **Reusable components:**
    - Node pin / node chip (variants: person/org, active/dormant)
    - Edge styles (collab, mentor, funding)
    - Side-panel sections (auto-layout)
    - Filter chips & toggles
    - Legend & tooltips
3. **Prototype links:**
    - Hover-state for nodes & edges
    - Click to open side panel
    - Filter drawer slide-in
    - Timeline slider animation (simple frame swap)

Keep each component **atomic** so devs can translate directly into React/Three.js later.