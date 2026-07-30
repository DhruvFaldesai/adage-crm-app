# ADAGE CRM — Design & Feature Prompts

Consolidated archive of prompt/spec documents used to drive feature work on this project (previously scattered as individual files under `prompts/`).

## Table of Contents
- [ADAPT_Pipeline_UX_Redesign](#adapt-pipeline-ux-redesign)
- [PipelineTab_Feature_Spec](#pipelinetab-feature-spec)
- [PipelineTab_Improvements](#pipelinetab-improvements)
- [kiro-swimlane-bridge-legend](#kiro-swimlane-bridge-legend)
- [kiro_swimlane_prompt](#kiro-swimlane-prompt)
- [kiro_swimlane_improvements](#kiro-swimlane-improvements)
- [kiro_list_view_toggle](#kiro-list-view-toggle)
- [kiro-visits-tab-redesign](#kiro-visits-tab-redesign)
- [TeamTab_Feature_Spec](#teamtab-feature-spec)
- [Kiro_Prompt_Prospect_Health_Speedometer](#kiro-prompt-prospect-health-speedometer)
- [Kiro_Prompt_Prospect_Health_Tags_And_Aggregate](#kiro-prompt-prospect-health-tags-and-aggregate)
- [ADAPT_Corrective_Redesign_v2](#adapt-corrective-redesign-v2)
- [ADAPT_Donut_Chart_Redesign_Addendum](#adapt-donut-chart-redesign-addendum)
- [retheme-make-com-inspired](#retheme-make-com-inspired)
- [kiro-refactor-prompt](#kiro-refactor-prompt)

---

## ADAPT_Pipeline_UX_Redesign

# ADAPT Pipeline UX Redesign — Kiro Implementation Prompt

## Objective

Redesign two parts of the `PipelineTab` component in the ADAPT React dashboard:

1. **List View rows** — Replace the current plain table layout with a rich, activity-focused row design (reference: CRM-style list with urgency badges, activity descriptions, and type tags).
2. **Filter Bar** — Collapse the current two-row, six-element filter section into a single clean, compact row.

All changes are scoped to `PipelineTab.jsx` and its child components. Do **not** touch Kanban view logic, chart components, or other tabs (Visits, TeamView, Calendar).

---

## Part 1 — List View Row Redesign

### Current State

The list view renders a traditional `<table>` with these columns:
- LEAD / COMPANY
- PROJECT TYPE
- REGION
- SALES LEAD
- CLOSING DATE
- VALUE

### Target State

Replace the table with a **card-row layout** — no column headers, each row is self-contained and scannable. Inspired by the reference image provided.

---

### Row Layout Specification

Each row is a horizontal flex container with **four zones**:

```
[ LEAD INFO ]   [ URGENCY + ACTIVITY ]   [ VALUE + REGION ]   [ SALES LEAD ]
```

---

#### Zone 1 — Lead Info (left, ~28% width)

- **Lead title**: bold, `font-size: 14px`, `color: #1a1a2e`, truncate at 1 line with ellipsis
- **Company name**: below title, `font-size: 12px`, `color: #6b7280`, truncate at 1 line
- **"View in Odoo" link**: hidden by default, show on row hover as a small teal text link `color: #02818A`, `font-size: 11px`

---

#### Zone 2 — Urgency Badge + Activity Text (center-left, ~35% width)

This zone shows **when action is needed** and **what the action is**.

**Left sub-element: Urgency Badge**

A compact pennant/arrow-style badge. Use the following logic based on `x_studio_expected_closing`:

| Condition | Badge Label | Badge Color |
|---|---|---|
| Date is past (overdue) | `OVERDUE` | `#ef4444` (red) |
| Date is today or tomorrow (≤ 1 day) | `TODAY` or `TOMORROW` | `#f97316` (orange) |
| Date is within 7 days | Formatted date e.g. `15 Sep` | `#eab308` (yellow/amber) |
| Date is in the future (> 7 days) | Formatted date e.g. `8 Jan` | `#9ca3af` (grey) |
| No date set | `—` | `#d1d5db` (light grey, no badge shape) |

Badge shape: pill with a right-pointing chevron/arrow clipped shape using `clip-path` or a simple right-arrow bordered pill. Keep it compact: `height: 22px`, `padding: 0 10px 0 8px`, `font-size: 11px`, `font-weight: 700`, `color: white`, `border-radius: 3px`.

**Right sub-element: Activity / Stage Text**

- Show the lead's **current stage name** as the "activity description"
- `font-size: 13px`, `color: #374151`
- Prefix with a right-arrow `→` in muted grey
- Example: `→ Proposal Submitted` or `→ Technical Discussion`
- If stage name is not available, show `→ In Progress`

Layout: flex row, gap `8px`, vertically centered, badge on left, stage text on right.

---

#### Zone 3 — Value + Region (center-right, ~22% width, right-aligned)

**Value pill:**
- Show `expected_revenue` formatted as `₹30.0Cr` / `₹1.2Cr` / `₹45.0L` (reuse existing `formatCurrency` utility)
- Style: outlined pill, `border: 1.5px solid`, `border-radius: 20px`, `padding: 2px 10px`, `font-size: 12px`, `font-weight: 600`
- Color by urgency:
  - Overdue: `border-color: #ef4444`, `color: #ef4444`
  - Otherwise: `border-color: #02818A`, `color: #02818A`

**Region tag:**
- Below the value pill
- Reuse existing region badge style (colored pill matching the existing region color map)
- `font-size: 11px`

---

#### Zone 4 — Sales Lead (right, ~15% width, right-aligned)

- Sales lead name in `font-size: 12px`, `font-weight: 600`, `color: #374151`, uppercase or title case
- Below it: Project Type as a muted tag `font-size: 11px`, `color: #9ca3af`
- Examples:
  - `SHUBHANKAR DEY`
  - `Brownfield`

---

### Row Styling

```css
/* Each row */
.pipeline-list-row {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: white;
  cursor: pointer;
  transition: background 0.15s ease;
  min-height: 58px;
  gap: 12px;
}

.pipeline-list-row:hover {
  background: #f0fdfd; /* very light teal tint */
}

/* Remove old table styles entirely */
/* No <table>, <thead>, <tbody>, <tr>, <td>, <th> */
```

---

### Stage Group Headers

Keep the existing stage group headers (e.g. **New — 45 leads — ₹67.8Cr**) but restyle:

- Background: `#f8fafc`
- Left border accent: `4px solid #02818A`
- Padding: `10px 16px`
- Font: `14px`, `font-weight: 700`, `color: #02818A`
- Count and value on the right as muted text: `font-size: 13px`, `color: #6b7280`
- Remove the expand/collapse triangle arrow — keep groups always expanded in list view

---

### Empty State

If a stage group has 0 leads, do **not** render the group at all.

---

## Part 2 — Filter Bar Declutter

### Current State (2 rows, 6+ elements)

```
Row 1: [ACTIVE ▼]  [dd-mm-yyyy]—[dd-mm-yyyy]  [Quarter/Year ▼]  [Region ▼]  [Person ▼]
Row 2: [By Stage] [By Region] [By Person]   ...   [Search leads...]  [≡] [⊞]
```

### Target State (1 row)

Collapse everything into **one compact filter row**:

```
[Status ▼]  [Period ▼]  [Region ▼]  [Person ▼]  |  [By Stage] [By Region] [By Person]  ...  [Search]  [≡] [⊞]
```

---

### Changes Required

#### 1. Merge Date Range + Quarter/Year into a Single "Period" Dropdown

Replace these three elements:
- `[dd-mm-yyyy]` (date from)
- `[dd-mm-yyyy]` (date to)
- `[Quarter/Year ▼]`

With a **single Period dropdown** that has these options:

| Label | Behavior |
|---|---|
| All Time | Clear date filters |
| This Month | First to last day of current month |
| This Quarter | First to last day of current quarter |
| This Year | Jan 1 to Dec 31 of current year |
| Last 6 Months | Rolling 6 months back from today |
| Last 12 Months | Rolling 12 months back from today |
| Custom Range | Show two compact date pickers inline (existing date inputs) |

- Default: `All Time` (no filter applied)
- When "Custom Range" is selected, expand a small date-range sub-row below the filter bar (do not clutter the main row)
- The dropdown should show the current selection as its label, e.g. `Period: This Quarter`
- Style: match existing filter pill style (teal border, white background, `#02818A` text/icon)

#### 2. Move Group-By Tabs Inline

The `[By Stage] [By Region] [By Person]` tabs currently sit on their own row. Move them **inline** after the filter pills, separated by a `|` divider.

Style them as compact text tabs (not buttons):
- `font-size: 12px`, `font-weight: 500`
- Active: `color: #02818A`, `border-bottom: 2px solid #02818A`
- Inactive: `color: #9ca3af`
- No background, no border, no padding — minimal

#### 3. Filter Bar Single Row Layout

```
flex, flex-wrap: nowrap, align-items: center, gap: 8px, padding: 10px 16px
```

Order of elements (left to right):
1. `[Status ▼]` — existing ACTIVE/All dropdown
2. `[Period ▼]` — new merged period selector
3. `[Region ▼]` — existing region filter
4. `[Person ▼]` — existing person filter
5. `|` — thin vertical divider `1px solid #e5e7eb`, height `20px`
6. `[By Stage]` `[By Region]` `[By Person]` — inline tabs
7. Flex spacer (`flex: 1`)
8. `[Search leads...]` — existing search input
9. `[≡]` `[⊞]` — view toggle buttons

#### 4. Urgency Legend

The colored dot legend (`● Overdue  ● Due in ≤2 days  ● Due this week`) currently sits below the filter rows. Keep it but move it to be **inline at the far left** of the filter bar, before the Status dropdown — or remove it entirely if it clutters the bar. 

**Recommended:** Remove the legend from the filter bar. The urgency colors are now self-evident in the row badges. If needed, the legend can appear as a tooltip on the urgency badge column.

---

## Part 3 — Shared Pill/Badge Component

Create a shared `<UrgencyBadge />` component in `src/components/` (or inline in PipelineTab if simpler):

```jsx
// UrgencyBadge.jsx
// Props: closingDate (string "YYYY-MM-DD" or null)
// Returns a styled badge element

function UrgencyBadge({ closingDate }) {
  if (!closingDate) return <span className="urgency-none">—</span>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = closingDate.split('-');
  const closing = new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2])
  );

  const diffDays = Math.floor((closing - today) / (1000 * 60 * 60 * 24));

  let label, colorClass;

  if (diffDays < 0) {
    label = 'OVERDUE';
    colorClass = 'urgency-overdue'; // red
  } else if (diffDays <= 1) {
    label = diffDays === 0 ? 'TODAY' : 'TOMORROW';
    colorClass = 'urgency-soon'; // orange
  } else if (diffDays <= 7) {
    label = closing.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    colorClass = 'urgency-week'; // amber
  } else {
    label = closing.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    colorClass = 'urgency-future'; // grey
  }

  return <span className={`urgency-badge ${colorClass}`}>{label}</span>;
}
```

CSS for urgency badges:
```css
.urgency-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.3px;
  white-space: nowrap;
}
.urgency-overdue { background: #ef4444; }
.urgency-soon    { background: #f97316; }
.urgency-week    { background: #eab308; }
.urgency-future  { background: #9ca3af; }
.urgency-none    { color: #d1d5db; font-size: 13px; }
```

---

## Files to Modify

| File | Change |
|---|---|
| `src/views/PipelineTab.jsx` | List view rows, filter bar layout |
| `src/components/UrgencyBadge.jsx` | New component (create if not exists) |
| `src/views/PipelineTab.css` (or styled section) | Row and badge styles |

Do **not** modify:
- `KanbanView` component or its styles
- Chart components (donut, bar)
- `TeamView.jsx`
- `VisitsTab.jsx`
- `CalendarTab.jsx`
- `theme.js`
- `odoo.js`
- `.env`

---

## Acceptance Criteria

- [ ] List view rows render in the new 4-zone layout with urgency badges
- [ ] No `<table>` element used in list view
- [ ] Row hover state shows teal background tint
- [ ] "View in Odoo" appears on hover in Zone 1
- [ ] Stage group headers are restyled with teal left accent
- [ ] Filter bar is a single row
- [ ] Date range + Quarter/Year is replaced by single Period dropdown with 6 preset options + Custom Range
- [ ] Group-by tabs are inline in the filter row
- [ ] Urgency dot legend is removed from filter area
- [ ] No horizontal scrollbar introduced on 1280px+ viewport
- [ ] Kanban view is completely unaffected

---

## Implementation Notes

- Reuse the existing `formatCurrency` function for value display — do not rewrite it
- Reuse the existing region color map for region tags
- The `x_studio_expected_closing` field is the source for urgency; it is already fetched in the current pipeline data
- Use `timezone-safe` date parsing: `new Date(y, m-1, d)` from split string — **never** `new Date(isoString)` directly
- The Period dropdown should update the same state variables that the current date-from/date-to pickers use, so all downstream filtering logic remains unchanged
- Test with both "By Stage" and "By Region" groupings in list view


---

## PipelineTab_Feature_Spec

# PipelineTab — Feature Specification for Kiro

## Context & Codebase

This is a React CRM dashboard using inline styles with shared theme tokens `T` (from `../constants/theme`), `REGION_COLORS` and `STAGE_COLORS` (from `../constants/colors`), and `fmt` (from `../lib/format`).

**Current state of `PipelineTab.jsx`:** A basic kanban-style grid — 4 columns (one per stage), each with a stage header, total revenue label, and scrollable cards. No filtering, no grouping, no charts.

**Reference component:** Study `VisitsTab.jsx` for patterns to reuse:
- `DetailPanel` — full-detail expand panel (fields, layout, Odoo link)
- `MultiSelect` — checkbox dropdown component
- `getUrgency` / `URGENCY` — urgency border coloring based on ISO date proximity
- `fmtShort(iso)` — formats ISO date as `"28 May, Thu"`
- `fadeIn` keyframe animation

**Props currently received by `PipelineTab`:** `{ leads, stages }`

**No new props are required.** All needed data lives on the `crm.lead` model and must come through the existing `leads` array.

---

## Data Fetching — Required Update to Parent

All fields used in this component — including the new Studio-added ones — are stored directly on the `crm.lead` model in Odoo. There is no cross-model join needed.

Find the parent component (or data-fetching hook/service) that calls the Odoo API to load `crm.lead` records and passes them as the `leads` prop to `PipelineTab`. This is likely a `searchRead` or `web_search_read` RPC call on the `crm.lead` model.

**Add the following fields to that call's `fields` array** if they are not already present:

```js
"x_studio_lead_status",
"x_studio_tentative_finalization_date",
"x_studio_assigned_salesperson",   // Many2one → returns [id, name]
"x_studio_sales_lead",             // Many2one → returns [id, name]
"x_studio_project_background",     // Selection or Char → returns string or false
```

These are all standard Studio fields on `crm.lead`. No model changes are needed — only the fetch fields list.

**Do not add any new Odoo RPC calls or new API endpoints.** The single existing `crm.lead` fetch, with the expanded fields list, is sufficient for the entire `PipelineTab`.

---

## Lead Data Fields (relevant)

```
l.id
l.name                                  — deal/opportunity name
l.partner_id[1]                         — company name
l.partner_name                          — fallback company name
l.stage_id[0], l.stage_id[1]           — stage id and label
l.expected_revenue                      — deal value
l.x_studio_responsible_region_1        — region string
l.x_studio_lead_status                 — "Active" | "Inactive" | other
l.x_studio_tentative_finalization_date — ISO date string (may be null)
l.x_studio_assigned_salesperson        — [id, name] tuple — the assigned salesperson
l.x_studio_sales_lead                  — [id, name] tuple — the sales lead person
l.x_studio_project_background          — string describing type/background of order (e.g. "New", "AMC", "Retrofit") — may be null
```

**Fields explicitly NOT used (do not reference these anywhere):**
- `l.x_studio_importance_of_lead` — removed
- `l.user_id` — removed, replaced by `x_studio_sales_lead`
- Stage pill on cards — removed

---

## Feature 1 — View Mode Toggle (List / Kanban)

Add a **view mode toggle** in the top filter bar (far right). Two icon-style buttons side by side:
- **List view** icon: three horizontal lines (≡)
- **Kanban view** icon: a 2×2 grid of squares (⊞)

**Default: List view.**

State: `viewMode` — `"list"` | `"kanban"`. Switching view mode does not reset filters, grouping, or selected lead.

The toggle buttons use the same connected-pill segmented style as the grouping control (rounded left for list, rounded right for kanban). Active button uses `T.accent` background + white; inactive uses `T.bgCard` + `T.textSecondary`.

---

## Feature 2 — Active Lead Filter (Default On)

Add a toggle button (pill-style, same as filter tabs in `VisitsTab`) labelled **"Active Only"** that defaults to **on**.

- When on: only show leads where `l.x_studio_lead_status === "Active"`.
- When off: show all leads regardless of status.
- Place this toggle in the top filter bar (left side).
- Toggling does not reset the grouping mode, view mode, or sort order.

---

## Feature 3 — Grouping Mode Toggle

Add a segmented control in the top filter bar with three options:

| Option | Label | Groups by |
|---|---|---|
| `"region"` | By Region | `l.x_studio_responsible_region_1` (fallback `"No Region"`) |
| `"person"` | By Person | `l.x_studio_assigned_salesperson[1]` (fallback `"Unassigned"`) |
| `"stage"` | By Stage | `l.stage_id[1]` (fallback `"No Stage"`) |

**Default:** `"region"`

Segmented control style: connected pills (left button rounded-left, right button rounded-right, middle no rounding). Active segment: `T.accent` bg + white text. Inactive: `T.bgCard` + `T.textSecondary`.

### Sort order within each group
Sort leads by `x_studio_tentative_finalization_date` ascending (earliest closing date first). Leads with **no finalization date** go to the **bottom** of their group. Within the no-date leads, sort by `expected_revenue` descending.

### Group header (List view)
Each group has a collapsible header row:
- **Group name** colored with `REGION_COLORS`, `PERSON_COLORS[index % PERSON_COLORS.length]`, or `STAGE_COLORS` depending on grouping mode
- **Lead count** badge (pill)
- **Total revenue** for the group (`fmt()`, `T.success`)
- **Collapse/expand chevron** — all groups start expanded

### Group header (Kanban view)
Same header row, but the collapse toggle is removed — kanban columns are always visible. The header sits above the column of cards.

### Empty groups
If a group has zero visible leads after filtering, omit it entirely.

---

## Feature 4 — List View Layout

When `viewMode === "list"`, render leads as **horizontal rows** inside each group (full-width cards stacked vertically).

### List Row columns (use CSS grid)

```
GRID = "1.6fr 120px 110px 120px 100px 120px"
```

Column headers (sticky, same pattern as VisitsTab):
```
LEAD / COMPANY | PROJECT TYPE | REGION | SALES LEAD | CLOSING DATE | VALUE
```

Each lead row contains:

| Column | Content |
|---|---|
| Lead / Company | Lead name (`fontSize: 13, fontWeight: 600, T.textPrimary`) on line 1; company name (`fontSize: 11, T.textMuted`) on line 2 |
| Project Type | `l.x_studio_project_background` as a pill. If null, show `"—"` in `T.textMuted`. Pill background: `rgba(124,58,237,0.10)`, color: `#7C3AED` (same style as engagement type pill in `VisitRow`) |
| Region | Region pill using `REGION_COLORS`. If null, `"—"` |
| Sales Lead | `l.x_studio_sales_lead[1]`. If null, `"—"` in `T.textMuted` |
| Closing Date | `fmtShort(l.x_studio_tentative_finalization_date)`. Color with `URGENCY[getUrgency(l.x_studio_tentative_finalization_date, null)].dateColor`. If null, `"No date"` in `T.textMuted` |
| Value | `fmt(l.expected_revenue)` in `T.success`, bold. If zero/null, `"—"` |

### Urgency left border
Each row has a left border colored via `URGENCY[getUrgency(l.x_studio_tentative_finalization_date, null)].border` — identical to `VisitRow` in `VisitsTab.jsx`. Use `borderLeft: "4px solid ..."`.

### Hover & click
- Hover: `T.bgCardAlt` background (use `useState` hover flag per row, same as `VisitRow`)
- Click: toggle inline `LeadDetailPanel` immediately below the clicked row (see Feature 6)

---

## Feature 5 — Kanban View Layout

When `viewMode === "kanban"`, render the groups as **horizontal columns**, each with a scrollable stack of vertical cards.

Layout: `display: grid`, `gridTemplateColumns: repeat(auto-fill, minmax(220px, 1fr))`, `gap: 14`, `alignItems: start`.

### Kanban Card

Each card is a vertical card (`background: T.bgCard, border: 1px solid T.border, borderRadius: 10, padding: "12px 14px"`).

Card contents (top to bottom):
1. **Lead name** — `fontSize: 13, fontWeight: 600, T.textPrimary, marginBottom: 4`
2. **Company** — `fontSize: 11, T.textMuted, marginBottom: 8`
3. **Project Type pill** — `l.x_studio_project_background`. Same purple pill style as list view. If null, omit.
4. **Region pill** — `l.x_studio_responsible_region_1`. If null, omit.
5. **Bottom row** (space-between): Sales Lead name (`fontSize: 11, T.textSecondary`) on the left; Revenue (`fmt`, `T.success`, bold) on the right
6. **Closing date** below the bottom row — `fmtShort()` with urgency date color. If null, `"No date"` in `T.textMuted`.

**Left border urgency** on each card: `borderLeft: "4px solid ..."` using `URGENCY[getUrgency(...)].border`.

**Hover & click** — same as list rows: hover highlight, click opens `LeadDetailPanel`.

---

## Feature 6 — Inline Lead Detail Panel (`LeadDetailPanel`)

When a lead row or card is clicked, expand a `LeadDetailPanel` immediately below it (list view: below the row; kanban view: below the card). One panel open at a time — clicking another lead closes the previous one. Clicking the same lead again closes it.

Track with `selectedLeadId` state (null by default).

### Panel layout
Model after `DetailPanel` in `VisitsTab.jsx`: header bar with title + close button (`×`), then a 3-column grid of `Field` sub-components.

Fields:

| Label | Value |
|---|---|
| Company | `l.partner_id[1]` |
| Stage | `l.stage_id[1]` |
| Region | `l.x_studio_responsible_region_1` |
| Assigned Salesperson | `l.x_studio_assigned_salesperson[1]` or `"—"` |
| Sales Lead | `l.x_studio_sales_lead[1]` or `"—"` |
| Deal Value | `fmt(l.expected_revenue)` colored `T.success` |
| Project Type | `l.x_studio_project_background` or `"—"` |
| Tentative Closing | `fmtShort(l.x_studio_tentative_finalization_date)` colored with urgency date color |
| Lead Status | `l.x_studio_lead_status` |

Full-width bottom row:
- **Odoo link**: `https://crm-adage-6.odoo.com/odoo/crm/{l.id}` — same "View in Odoo →" anchor style as `DetailPanel` in `VisitsTab`.

Apply `fadeIn` animation on mount via a `<style>` tag (inject the keyframe if not globally available).

---

## Feature 7 — Charts Section (Above the Grouped List/Kanban)

Render a **two-column chart row** between the filter bar and the main content. Each column is a `className="card"` with `padding: "20px 22px"`. Charts respond to the active filter (Active Only + dropdown filters) — they only show data for currently visible leads.

### Left Column — Revenue by Stage (SVG Donut Chart)

**No external chart library. SVG only.**

- Donut chart using SVG `<circle>` with `stroke-dasharray` / `stroke-dashoffset`.
- One segment per stage that has at least one visible lead. Color: `STAGE_COLORS[stage.name]` (fallback `T.accent`).
- Center text: `fmt(totalRevenue)` large bold + `"Pipeline"` label in `T.textMuted`.
- Right-side vertical legend: colored dot, stage name, revenue, lead count. Sorted by revenue descending.
- Section label: `"Revenue by Stage"`

**Implementation pattern:**
```js
const circumference = 2 * Math.PI * 52; // radius 52, viewBox ~130
// per segment:
const dash = (segmentValue / totalValue) * circumference;
const gap  = circumference - dash;
// strokeDashoffset = circumference - sum of all previous dashes (starts at top)
```

### Right Column — Projected Monthly Closings (Bar Chart)

**No external chart library. SVG or div-based bars.**

- X-axis: calendar months from `x_studio_tentative_finalization_date` of visible leads. Only months with ≥1 lead. Up to 12 months, sorted chronologically.
- Y-axis: total `expected_revenue` per month.
- Bars colored `T.accent`. Month label below (`"Jun '25"`). Revenue above bar.
- Leads with no finalization date excluded.
- If fewer than 2 months have data: show `"Not enough date data to show trend."` centered in `T.textMuted`.
- Section label: `"Projected Monthly Closings"`

---

## Feature 8 — Additional Filters (Top Bar)

Reuse the `MultiSelect` component from `VisitsTab.jsx`. Add two dropdowns:

- **Region** — unique `x_studio_responsible_region_1` values from all leads
- **Stage** — unique `stage_id[1]` values from all leads

Both default to empty. Add a `✕` clear button when any dropdown is active (same as `VisitsTab`). Filters apply globally to charts, grouped list, and kanban.

---

## Top Filter Bar Layout

```
[ Active Only ] [ By Region | By Person | By Stage ] [ Region ▼ ] [ Stage ▼ ] [ ✕ if active ]   ···   [ ≡ List | ⊞ Kanban ]
```

`display: flex`, `alignItems: center`, `gap: 8`, `flexWrap: wrap`, `marginBottom: 14`, `justifyContent: space-between`.

Left group: Active Only + grouping segmented control + dropdowns + clear.
Right group: List/Kanban view toggle.

---

## Urgency Legend

Below the filter bar and above the charts, show the urgency legend (same as `VisitsTab`):

```
● Overdue   ● Due in ≤2 days   ● Due this week
```

Colors: `#EF4444`, `#FF9933`, `#F59E0B`. `fontSize: 11, T.textSecondary`.

---

## Style Consistency Rules

- All color tokens from `T.*` — no raw hex except urgency colors (`#EF4444`, `#FF9933`, `#F59E0B`) and the project type pill (`rgba(124,58,237,0.10)` / `#7C3AED`), both shared with `VisitsTab`.
- List row / kanban card padding: `"12px 14px"`, border radius: `10px`, border: `1px solid ${T.border}`.
- Chart card padding: `"20px 22px"`, border radius: `12px`.
- Section labels: `fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, color: T.textMuted, marginBottom: 14`.
- Pills: `borderRadius: 100`, `padding: "2px 8px"`, `fontSize: 10–11`, `fontWeight: 600`.
- Do **not** introduce any new external npm dependencies.

---

## PipelineTab_Improvements

# PipelineTab — Improvements & Bug Fix Specification for Kiro

## Context

The current `PipelineTab.jsx` implementation is complete and working as a base. This document covers only the **bugs to fix and improvements to make** — do not rewrite anything that is not mentioned here.

The file uses:
- `T` from `../constants/theme`, `REGION_COLORS`, `STAGE_COLORS`, `PERSON_COLORS` from `../constants/colors`, `fmt` from `../lib/format`
- Local constants: `URGENCY`, `getUrgency`, `fmtShort`, `STATUS_COLORS`, `PROJECT_TYPE_COLORS`, `getProjectTypePill`
- Local components: `MultiSelect`, `LeadDetailPanel`, `InteractiveDonut`, `RevenueDonut`, `GreenfieldDonut`, `MonthlyClosings`, `ListRow`, `KanbanCard`
- Main export: `PipelineTab`

The date field for closing dates throughout the file is `x_studio_expected_closing`. This is correct — do not change it.

The three-column chart layout (`RevenueDonut` | `GreenfieldDonut` | `MonthlyClosings`) is correct and intentional — do not change it.

---

## Bug Fix 1 — Donut Hover Glitch (Critical)

### Problem
When hovering over any donut segment, the segment expands outward (radius `52 → 56`). Because the `<circle>` element itself receives `onMouseEnter/onMouseLeave`, expanding the geometry shifts the circle's stroke boundary, causing the mouse cursor to momentarily fall outside the element, triggering `onMouseLeave`, which shrinks it back, which brings the cursor back in, which triggers `onMouseEnter` again — an infinite flicker loop. This is worst on the "Regret" segment and any small segment where the stroke boundary is close to the cursor.

### Fix
Split each segment into two overlapping SVG circles:

1. **Hit area circle** (transparent, always at max hover radius, receives all mouse events):
   - `r={R_HOVER}` always — never changes
   - `fill="none"`, `stroke="transparent"`
   - `strokeWidth={SW_HOVER + 8}` — slightly wider than the visual stroke to create a generous hit zone
   - `strokeDasharray` and `strokeDashoffset` calculated at `R_HOVER` radius
   - Has `onMouseEnter`, `onMouseLeave`, `onClick`
   - `cursor="pointer"`
   - Rendered **on top** (after the visual circle in DOM order)

2. **Visual circle** (colored, animates radius, no mouse events):
   - `r` and `strokeWidth` animate based on `hoveredKey === seg.key` state
   - `pointerEvents="none"` — never intercepts mouse events
   - Has the `style={{ transition: "r 0.15s ease, stroke-width 0.15s ease, opacity 0.15s ease" }}`
   - Rendered **below** the hit area circle

Because the hit area geometry never changes size, the mouse never leaves it during the visual expansion, eliminating the flicker entirely.

### Implementation note for `strokeDashoffset` on hit area
The hit area must use its own circumference (`2 * Math.PI * R_HOVER`) to calculate `strokeDasharray` and `strokeDashoffset`, since those are radius-dependent. Keep a separate `circ_hover = 2 * Math.PI * R_HOVER` constant alongside the existing `circ_base`.

Also ensure the center label `<div>` overlay has `pointerEvents: "none"` so it does not intercept hover events from segments rendered beneath it.

---

## Bug Fix 2 — Pie Chart Drill-Down Not Filtering (Critical)

### Problem
Clicking a donut segment calls `onSegmentClick(seg.key)` which sets `filterLeadStatus` or `filterProjectType` state. However the leads list does not update visibly. The root cause is a **value mismatch**: the segment key is built from `String(l.x_studio_lead_status)`, but Odoo may return the field as a Selection technical key (e.g. `"active"`) while the display label shown in the UI differs (e.g. `"ACTIVE"`). Same issue applies to `x_studio_project_background` — Odoo returns `false` (boolean) for empty fields, not `null`, which causes `String(false) = "false"` to appear as a segment key.

### Fix — `RevenueDonut` and its filter
In the `byStatus` accumulation inside `RevenueDonut`, normalize the key:
```js
const s = l.x_studio_lead_status ? String(l.x_studio_lead_status).trim() : null;
if (!s) return; // skip leads with no status
```

In `filteredLeads` inside `PipelineTab`, normalize the comparison too:
```js
if (filterLeadStatus) {
  const val = l.x_studio_lead_status ? String(l.x_studio_lead_status).trim() : null;
  if (val !== filterLeadStatus) return false;
}
```

### Fix — `GreenfieldDonut` and its filter
In the `counts` accumulation inside `GreenfieldDonut`:
```js
const k = l.x_studio_project_background && l.x_studio_project_background !== false
  ? String(l.x_studio_project_background).trim()
  : null;
if (!k) return; // skip leads with no project background
```

In `filteredLeads`:
```js
if (filterProjectType) {
  const val = l.x_studio_project_background && l.x_studio_project_background !== false
    ? String(l.x_studio_project_background).trim()
    : null;
  if (val !== filterProjectType) return false;
}
```

This ensures segment keys and filter comparisons always use the same normalized string value.

---

## Bug Fix 3 — `useState` Inside `.map()` in `MonthlyClosings` (Critical)

### Problem
Inside `MonthlyClosings`, the bar rendering calls `useState(false)` directly inside `entries.map(...)`. This violates the Rules of Hooks — hooks must only be called at the top level of a React function component, never inside loops or callbacks. This will cause React errors or silent state bugs in strict mode.

### Fix
Extract the individual bar into a separate `MonthBar` component that owns its own `hovered` state:

```jsx
function MonthBar({ monthKey, data, isSelected, maxRev, onBarClick }) {
  const [hovered, setHovered] = useState(false);
  const barH = Math.max(Math.round((data.rev / maxRev) * 90), 4);
  return (
    <div
      onClick={() => onBarClick(isSelected ? null : monthKey)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 44, flex: 1, cursor: "pointer" }}
    >
      <div style={{ fontSize: 9, color: isSelected ? T.accent : T.textMuted, fontWeight: isSelected ? 700 : 600, whiteSpace: "nowrap" }}>
        {fmt(data.rev)}
      </div>
      <div style={{
        width: "100%", height: barH, minHeight: 4, borderRadius: "4px 4px 0 0",
        background: isSelected ? T.accent : hovered ? T.accentBdr : "#CBD5E1",
        transition: "background 0.15s, transform 0.15s",
        transform: hovered ? "scaleY(1.04)" : "scaleY(1)",
        transformOrigin: "bottom",
        outline: isSelected ? `2px solid ${T.accent}` : "none",
        outlineOffset: 1,
      }} />
      <div style={{ fontSize: 10, color: isSelected ? T.accent : T.textSecondary, fontWeight: isSelected ? 700 : 400, whiteSpace: "nowrap" }}>
        {data.label}
      </div>
    </div>
  );
}
```

Replace the `entries.map` inside `MonthlyClosings` to render `<MonthBar>` instead of the inline div with the hook call.

---

## Fix 4 — Group Header Collapse on Full Header Click

### Problem
Currently, collapsing a group requires clicking the small `▲▼` button on the far right of the header. The entire header row should be clickable to toggle collapse.

### Fix
Move the `onClick` handler from the `▲▼` button to the entire group header `<div>`:

```jsx
<div
  onClick={() => viewMode === "list" && toggleCollapse(key)}
  style={{
    ...,
    cursor: viewMode === "list" ? "pointer" : "default",
    userSelect: "none",
  }}
>
```

Keep the `▲▼` button in the header as a **visual indicator only** — add `pointerEvents: "none"` to it so it does not double-fire the click or interfere with the header's own handler. In kanban mode, the header is not clickable (kanban groups are always expanded), hence the `viewMode === "list"` guard.

---

## Improvement 1 — Active Segment Visual Feedback on Donut

### Problem
When a donut segment is clicked and `filterLeadStatus` or `filterProjectType` is set, the segment looks identical to unselected ones after the mouse moves away. There is no persistent visual indicator that this segment is "active".

### Fix — visual circle
When a segment's key matches the active filter, apply a permanent SVG `filter` for a glow effect on the visual circle:

```jsx
filter={
  (filterKey === seg.key)
    ? `drop-shadow(0 0 5px ${seg.color}90)`
    : undefined
}
```

Where `filterKey` is the relevant active filter prop passed into `InteractiveDonut` as a new optional prop `activeKey`.

Also keep the segment at the expanded radius permanently when it is the active key:
```js
const isActive = activeKey === seg.key;
const r  = (isHov || isActive) ? R_HOVER : R_BASE;
const sw = (isHov || isActive) ? SW_HOVER : SW_BASE;
```

### Fix — legend row
In the legend, highlight the active segment's row with a colored left border and tinted background:

```jsx
style={{
  ...,
  borderLeft: activeKey === seg.key ? `3px solid ${seg.color}` : "3px solid transparent",
  background: activeKey === seg.key ? `${seg.color}12` : "transparent",
  borderRadius: 4,
  paddingLeft: 5,
}}
```

Pass `activeKey` into `InteractiveDonut` and thread it through to both the visual circle and legend row. Update `RevenueDonut` to pass `activeKey={filterLeadStatus}` and `GreenfieldDonut` to pass `activeKey={filterProjectType}`.

---

## Improvement 2 — `selectedLeadId` Cleared on View Mode Switch

### Problem
If a lead detail panel is open in list view and the user switches to kanban view, `selectedLeadId` remains set, causing a panel to render unexpectedly under a kanban card the user never clicked.

### Fix
Clear `selectedLeadId` whenever `viewMode` changes:

```js
const handleSetViewMode = (mode) => {
  setViewMode(mode);
  setSelectedLeadId(null);
};
```

Replace all `setViewMode(...)` calls with `handleSetViewMode(...)`.

---

## Improvement 3 — Collapsed State Ignored in Kanban Mode

### Problem
If a group is collapsed while in list view and the user switches to kanban, the group's cards are hidden because `isCollapsed` is still `true` in state.

### Fix
In the kanban render block, ignore `isCollapsed` entirely — always render kanban cards regardless of collapse state:

```jsx
// List view — respects isCollapsed
{!isCollapsed && viewMode === "list" && ( ... )}

// Kanban view — always renders, never checks isCollapsed
{viewMode === "kanban" && ( ... )}
```

This is already partially present in the current code but must be verified — the kanban block must not be wrapped in any `!isCollapsed` condition.

---

## Improvement 4 — `groupBy === "stage"` Group Sort Order

### Problem
When `groupBy` is `"stage"`, the group key sort uses `STATUS_ORDER` (a lead status array). This is incorrect — when grouping by stage, the groups should be sorted by the order stages appear in the `stages` prop.

### Fix
In the group key sorting block:

```js
else if (groupBy === "stage") {
  keys.sort((a, b) => {
    const ia = stages.findIndex(s => s.name === a);
    const ib = stages.findIndex(s => s.name === b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}
```

---

## Improvement 5 — `selectedMonth` Included in Active Filter Banner

### Problem
The dismissible filter banner below the charts shows pills for `filterLeadStatus` and `filterProjectType`, but not for `selectedMonth`. The monthly bar chart has its own inline clear button, but there is no consistent indicator in the shared banner row.

### Fix
Add a third pill to the existing banner `<div>` for `selectedMonth`:

```jsx
{selectedMonth && (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: `${T.accent}18`, color: T.accent, border: `1px solid ${T.accent}40` }}>
    Closing: {monthMap[selectedMonth]?.label || selectedMonth}
    <button onClick={() => setSelectedMonth(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "inherit", lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
  </span>
)}
```

Note: `monthMap` is currently local to `MonthlyClosings`. To reference it in the banner, either lift `monthMap` computation up to `PipelineTab` level via `useMemo`, or derive the label directly from `selectedMonth` string in place:
```js
const [sy, sm] = selectedMonth.split("-").map(Number);
const label = `${MONTHS_SHORT[sm - 1]} '${String(sy).slice(2)}`;
```

Where `MONTHS_SHORT` is the existing local constant.

Show the banner `<div>` whenever any of the three filters is active:
```jsx
{(filterLeadStatus || filterProjectType || selectedMonth) && ( ... )}
```

---

## Improvement 6 — Remove Unused `STAGE_COLORS` Import

`STAGE_COLORS` is imported from `../constants/colors` but is not referenced anywhere in the current implementation. Remove it from the import line to keep the file clean.

---

## Summary Checklist for Kiro

| # | Type | Description |
|---|---|---|
| Bug 1 | Critical | Donut hover glitch — split visual and hit-area circles, `pointerEvents="none"` on visual |
| Bug 2 | Critical | Drill-down not working — normalize field values before segment key assignment and filter comparison |
| Bug 3 | Critical | `useState` inside `.map()` in `MonthlyClosings` — extract `MonthBar` component |
| Fix 4 | UX | Group header collapse on full header click, not just the chevron button |
| Imp 1 | UX | Persistent active-segment glow + legend highlight when a donut segment is clicked |
| Imp 2 | UX | Clear `selectedLeadId` when view mode switches |
| Imp 3 | UX | Kanban cards always visible regardless of collapse state |
| Imp 4 | Logic | `groupBy === "stage"` sorts groups by `stages` prop order, not `STATUS_ORDER` |
| Imp 5 | UX | `selectedMonth` appears in the shared active filter banner with its own clear pill |
| Imp 6 | Cleanup | Remove unused `STAGE_COLORS` import |

---

## kiro-swimlane-bridge-legend

# Kiro Prompt: SwimlaneView — Proposed/Follow-Up Bridge Line + Icon Legend

## Context

In `SwimlaneView.jsx`, when an engagement has both `x_studio_proposed_date` and
`x_studio_next_follow_up_date`, the grid renders two pills in the same
salesperson row — a solid pill on the proposed date column and a dashed pill on
the follow-up date column. These need to be visually connected by a thin
horizontal line (not a shaded region or filled rectangle — just a line).

The current implementation draws a filled shaded rectangle as the bridge, which
overlaps unrelated pills that fall in columns between the two linked pills.
Replace the filled bridge entirely with a simple line, and fix the overlap issue.

---

## Change 1 — Replace Filled Bridge with a Simple Line

### Remove the existing bridge implementation

Delete all current bridge/shaded-region rendering code — the `position: absolute`
filled rectangle, the `bridgeSlots` Set, the collision `marginTop` logic, and
any opacity background divs added for the bridge. Remove it all cleanly.

### New implementation — thin connector line only

After building `byDay` for each row, do a pass to find linked pairs:
- Same `engagement.id`, one item with `isFollowUp === false` (proposed) and one
  with `isFollowUp === true` (follow-up)
- Both dates must fall within the current visible `days` array

For each linked pair, render a single `position: absolute` horizontal line
inside the row's day-cell wrapper:

```
left      = ROW_LABEL_W + proposedDayIdx * COL_W + (COL_W / 2)
width     = (followUpDayIdx - proposedDayIdx) * COL_W
top       = 50%
transform = translateY(-50%)
height    = 2px
```

Style:
- `background`: `STATUS_CONFIG[status].bg` — solid, full opacity, same color
  as the pill
- `borderRadius: 1px`
- `zIndex: 0` — renders behind pills
- `pointerEvents: none`

The line starts from the horizontal center of the proposed pill's column and
ends at the horizontal center of the follow-up pill's column. It sits at the
vertical midpoint of the row. Pills render above it via `zIndex: 1`.

### No collision handling needed

Because the bridge is now just a 2px line at vertical center, it does not
visually block or overlap any pill. Do not add `marginTop`, sub-rows, or any
stacking logic for other pills. Pills in columns between the two linked pills
render normally — the thin line passes behind them.

### Row wrapper requirement

The day-cell strip div for each row needs `position: relative` so the
`position: absolute` line is contained within the row. If it already has this,
no change needed.

---

## Change 2 — Engagement Type Icon Legend

Add a legend bar directly below the existing summary bar ("4 activities
● 3 Planned…") with `marginTop: 6px`.

```jsx
<div style={{
  display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
  padding: "10px 16px", background: T.bgCard,
  border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12,
  marginTop: 6,
}}>
  <span style={{
    fontSize: 10, fontWeight: 700, color: T.textMuted,
    letterSpacing: "0.8px", textTransform: "uppercase", flexShrink: 0,
  }}>
    Activity Types
  </span>
  {[
    { emoji: "✉️",  label: "Email" },
    { emoji: "📞", label: "Phone Call" },
    { emoji: "🤝", label: "Meeting" },
    { emoji: "🏛️", label: "Exhibition" },
    { emoji: "📌", label: "Other" },
  ].map(({ emoji, label }) => (
    <span key={label} style={{ display: "flex", alignItems: "center", gap: 5, color: T.textSecondary }}>
      <span style={{ fontSize: 14 }}>{emoji}</span>
      <span>{label}</span>
    </span>
  ))}
</div>
```

---

## Acceptance Criteria

- [ ] Bridge is a thin 2px horizontal line — no filled rectangle, no shading,
      no background region of any kind
- [ ] Line color matches the engagement's status color, full opacity
- [ ] Line runs from the center of the proposed pill's column to the center of
      the follow-up pill's column
- [ ] Pills in columns between the linked pair render at their normal vertical
      position — no marginTop, no sub-row, no displacement
- [ ] All pills render above the line (zIndex: 1 on pills, zIndex: 0 on line)
- [ ] No bridge drawn when follow-up date is outside the visible range
- [ ] Icon legend bar appears below the summary bar, matching its card style
- [ ] No regressions in List view, Detail panel, filters, or navigation
---

## kiro_swimlane_prompt

## Task

Build a **Team Activity Swimlane View** as a new tab/view inside this existing React app. Use the same `fetchOdoo()` pattern already in `App.jsx`. This is **not** an Odoo addon — no OWL, no `__manifest__.py`, no addon structure.

---

## Data Source

Use the existing `fetchOdoo()` pattern to make two API calls:

**Call 1** — Search-read `x_crm_lead_line_1519d` with a domain filtering `x_studio_proposed_date` OR `x_studio_next_follow_up_date` within the selected month.

Fetch these fields:

| Field | Label |
|---|---|
| `x_studio_proposed_date` | Proposed Date |
| `x_studio_visit_date` | Actual Interaction Date |
| `x_studio_next_follow_up_date` | Next Follow Up Date |
| `x_studio_engagement_type` | Engagement Type |
| `x_studio_engagement_status` | Engagement Status |
| `x_studio_visit_by` | Assigned Salesperson (many2many → `hr.employee`) |
| `x_crm_lead_id` | Lead |
| `x_studio_remarkscomments` | Remarks/Comments |

**Call 2** — From the collected `x_crm_lead_id` values, search-read `crm.lead` for `partner_id` and `expected_revenue`.

---

## Swimlane Layout

- **Rows** = one per unique employee from `x_studio_visit_by`. Since it is many2many, one activity assigned to multiple employees must appear as a pill in each of their rows — expand this client-side after fetching.
- **Columns** = every calendar day of the selected month labeled as a number. Weekends (Sat/Sun) visually dimmed but still present.
- **Primary pill** = placed in the column of `x_studio_proposed_date` (single date, never a range). Shows engagement type + truncated customer name.
- **Follow-up ghost pill** = if `x_studio_next_follow_up_date` exists and falls within the viewed month, render a second lighter dashed-border pill in that date's column labeled "Follow-up: [customer name]".
- If `x_studio_proposed_date` is null for a record, skip it silently — do not crash.

---

## Pill Colors by `x_studio_engagement_status`

| Status | Style |
|---|---|
| Planned | Green solid fill |
| Completed | Blue solid fill |
| Rescheduled | Orange solid fill |
| Cancelled | Gray solid fill, strikethrough text |

**Anomaly flag:** If `x_studio_visit_date` is filled but `x_studio_engagement_status` is still "Planned", show a ⚠ icon on the pill. This means the visit happened but the status was never updated.

---

## Tooltip on Hover (per pill)

Show all of the following if available:

- Customer name (from `crm.lead` → `partner_id.name`)
- Engagement type
- Deal value (`expected_revenue` formatted in ₹)
- Status
- Proposed date
- Actual interaction date (if filled)
- Next follow-up date (if filled)
- Remarks/Comments (if filled)

---

## Header Controls

- Left / right arrows + month + year label (e.g. "June 2026")
- "Today" button to return to the current month
- Multi-select dropdown to filter visible rows by salesperson

---

## Summary Bar (bottom of view)

Fixed bar showing counts for the visible month:

- Total activities
- Planned (green)
- Completed (blue)
- Rescheduled (orange)
- Cancelled (gray)
- ⚠ Anomaly count (visit done but status not updated)

---

## Deliverables — Exact Files to Produce

| File | Purpose |
|---|---|
| `src/SwimlaneView.jsx` | New React component — all state, fetch, grouping, and rendering logic self-contained |
| `App.jsx` (edit only) | Add `SwimlaneView` as a new tab alongside existing views — do not remove or modify any existing tab or component |

---

## Constraints

- React only — no new libraries, no OWL, no Odoo addon structure
- Use plain CSS consistent with the existing project styling
- Do **not** modify `.env`, `vite.config.js`, `main.jsx`, or any existing component other than adding the new tab entry in `App.jsx`
- No `__manifest__.py`, no XML views, no asset bundles

---

## Critical Implementation Notes

> **Many2many employee expansion** — `x_studio_visit_by` is many2many, not many2one. An activity assigned to multiple employees must produce a pill in each of their rows. Expand this client-side after the API response — do not treat it as a single value.

> **Single date columns** — `x_studio_proposed_date` is always one date. Pills sit in exactly one column. There are no date ranges.

> **Non-destructive integration** — Only add `SwimlaneView.jsx` as a new file and insert the new tab in `App.jsx`. Do not touch any other existing file.
---

## kiro_swimlane_improvements

## Issues to Fix

### 1. Pill Overflow — Pills Must Stay Within Their Date Column

**Current problem:** Pills are overflowing into adjacent date columns, making activities look like they span multiple days.

**Fix:**
- Each date column must have `overflow: hidden` and a fixed width
- Pills inside a column must be constrained to 100% of the column width
- Use `text-overflow: ellipsis`, `white-space: nowrap`, and `overflow: hidden` on pill text
- Pills must **never** bleed into the next column under any screen size
- If multiple pills exist on the same date for the same person, stack them **vertically** within the cell — do not let them push sideways
- The column width must be uniform and rigid across all rows and the header row

---

## New Features to Add

### 2. Time Range Filter — Month / Week / Day

Add a segmented toggle control in the header (next to the month navigator) with three options:

| View | Behaviour |
|---|---|
| **Month** | Shows all days of the selected month (current behaviour) |
| **Week** | Shows only the 7 days of the selected week. Week starts on Monday. |
| **Day** | Shows a single selected day. Rows remain the same (one per salesperson). Columns collapse to just one date. |

**Default view on load: Week**

**Navigation behaviour per view:**
- Month view → prev/next moves by one month
- Week view → prev/next moves by one week. Show the week range in the header (e.g. "2 Jun – 8 Jun 2026")
- Day view → prev/next moves by one day. Show the full date in the header (e.g. "Tuesday, 2 Jun 2026")

**"Today" button** must always jump to the current period in whatever view is active:
- Month view → current month
- Week view → current week
- Day view → today

---

### 3. Activity Detail Panel

Add a **detail panel** in the white space below the summary/legend bar. It should be empty and hidden by default, and appear when a pill is clicked.

**Behaviour:**
- Clicking any pill (primary or follow-up ghost) opens the detail panel below
- Clicking the same pill again or pressing a close (×) button collapses the panel
- Only one activity is shown at a time — clicking a different pill replaces the current detail

**Detail panel content (show all available fields):**

| Label | Field |
|---|---|
| Customer | `partner_id.name` from linked `crm.lead` |
| Deal Value | `expected_revenue` formatted as ₹ |
| Engagement Type | `x_studio_engagement_type` |
| Status | `x_studio_engagement_status` (with color badge matching pill color) |
| Assigned To | All employees from `x_studio_visit_by` (comma-separated) |
| Proposed Date | `x_studio_proposed_date` |
| Actual Interaction Date | `x_studio_visit_date` (show "Not recorded" if empty) |
| Next Follow-Up Date | `x_studio_next_follow_up_date` (show "None" if empty) |
| Remarks / Comments | `x_studio_remarkscomments` (show "—" if empty) |
| ⚠ Anomaly Warning | If `x_studio_visit_date` is filled but status is still "Planned", show a warning: "Visit recorded but status not updated" |

**Panel design:**
- Sits below the legend/summary bar, inside the same card/container
- Smooth expand/collapse animation
- Clean two-column label + value layout
- Clearly shows which activity is selected (highlight the active pill with a visible outline/ring)

---

## Summary of All Changes

| # | Change | Type |
|---|---|---|
| 1 | Pills contained within date column — no overflow | Bug fix |
| 2 | Month / Week / Day toggle with correct navigation | New feature |
| 3 | Default view set to Week on load | Behaviour change |
| 4 | Activity detail panel below legends on pill click | New feature |

---

## Constraints

- Do not modify any file other than `SwimlaneView.jsx` and its associated CSS
- Do not add any new npm libraries
- Keep all existing props, data fetch logic, and `fetchOdoo()` calls intact — only change rendering and UI state
- The detail panel must be part of `SwimlaneView.jsx` — do not create a separate modal or component file unless absolutely necessary
- All layout must remain responsive and horizontally scrollable on smaller screens

---

## kiro_list_view_toggle

# Kiro Prompt — List View Toggle for Swimlane

## Change

Add a **Grid / List toggle** (top-right corner of the `SwimlaneView.jsx` card) that switches between the existing swimlane grid and a new list view. The existing swimlane is "Grid". The new view is "List".

---

## List View Layout

Group records by **month** (e.g. "May 2026", "June 2026"), each with a count badge next to the heading. Under each month, render a table with these exact columns — no more, no less:

| Column | Field | Notes |
|---|---|---|
| PROPOSED DATE | `x_studio_proposed_date` | Formatted as "28 May, Thu" |
| PERSON | `x_studio_visit_by` (many2many → `hr.employee`) | Each name on its own line, colored by consistent per-person color matching swimlane |
| CUSTOMER | `partner_id.name` from linked `crm.lead` | Plain text |
| ORDER VALUE | `expected_revenue` from linked `crm.lead` | Formatted in ₹, green bold |
| TYPE | `x_studio_engagement_type` | Pill/badge with emoji matching swimlane (✉️ Email, 📞 Phone Call, 🤝 Meeting, 🏛️ Exhibition) |
| STATUS | `x_studio_engagement_status` | Pill/badge, color matches swimlane (green = Planned, blue = Completed, orange = Rescheduled, gray = Cancelled) |
| ACTUAL DATE | `x_studio_visit_date` | Formatted as "28 May, Thu"; show "—" if empty |
| NEXT FOLLOW-UP | `x_studio_next_follow_up_date` | Formatted as "28 May, Thu"; show "—" if empty |
| REMARKS | `x_studio_remarkscomments` | Truncated to one line with ellipsis; full text visible in detail panel |

Do **not** add any column not listed above (no Region, no external fields beyond `partner_id.name` and `expected_revenue` from `crm.lead`).

Each row should have a subtle hover state. Clicking a row opens the same detail panel that exists in Grid view. If `x_studio_visit_date` is filled but status is still "Planned", show the ⚠ anomaly icon in the STATUS column.

---

## Filters

The List view must use the **exact same filter controls** already present in the swimlane header:
- Salesperson multi-select dropdown
- Month / Week / Day toggle (drives which records are shown — e.g. Week view shows only that week's records in the list)
- Prev / Next navigation and Today button

Do not add new filters. Do not duplicate filter UI. The same filter state drives both Grid and List views — switching between Grid and List must preserve the current filter selections.

---

## Constraints

- All changes inside `SwimlaneView.jsx` only
- No new libraries
- Default view on load remains Grid (swimlane)
- The Grid / List toggle sits top-right, styled as two segmented buttons matching the Month / Week / Day toggle style already in the component

---

## kiro-visits-tab-redesign

# Kiro Prompt: Redesign `VisitsTab.jsx` — Smarter Visit List

## Context

The current `VisitsTab` component (`src/views/VisitsTab.jsx`) shows a basic upcoming-visits table with a side panel for type breakdown and status summary. The data source is the **Engagement Tracker** custom model: `x_crm_lead_line_1519d`.

Key fields available on each engagement record:
- `x_studio_proposed_date` — the visit/activity date (primary sort key)
- `x_studio_visit_date` — actual interaction date (if completed)
- `x_studio_next_follow_up_date`
- `x_studio_engagement_type` — Phone Call, Email, Meeting, Exhibition
- `x_studio_engagement_status` — Planned, Completed, Rescheduled, Cancelled
- `x_studio_visit_by` — Many2many employee IDs (resolved via `userMap`)
- `x_crm_lead_id` — linked CRM lead (provides company name, order value, region)
- `x_studio_remarkscomments`

The design reference for the **detail panel and Odoo redirect link** is `SwimlaneView.jsx` → `DetailPanel` component. Replicate that pattern here.

---

## What to Build

Replace the current `VisitsTab` implementation entirely with the following design.

---

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  FILTER TABS          [All] [Planned (12)] [Unassigned (3)] [Rescheduled (2)]│
│  SEARCH BAR           [🔍 Search company or person…]     [Sort: Visit Date ▼] │
├──────────────────────────────────────────────────────────────────────────────┤
│  VISITS TABLE                                                                │
│  Date     │ Date Type  │ Eng. Type │ Company │ Order Value │ Assigned To │ Region   │
│  ─────────│─────────│──────│─────────│─────────────│─────────────│─────────  │
│  rows…                                                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│  DETAIL PANEL (expands below table on row click — same as SwimlaneView)     │
└──────────────────────────────────────────────────────────────────────────────┘
```

No side panels. The layout is **full-width, single column**, with the detail panel expanding inline at the bottom on row click.

---

## Filter Tabs

Render four pill-style tabs above the table. Each tab shows a **count badge** reflecting how many records match under the current search query.

| Tab Label     | Filter Logic |
|---------------|--------------|
| **Planned**   | `x_studio_engagement_status === "Planned"` — **default active tab** |
| **Unassigned**| `x_studio_visit_by` is empty (`[]` or falsy) |
| **Rescheduled** | `x_studio_engagement_status === "Rescheduled"` |
| **All**       | No filter — show everything |

Switching tabs does **not** reset the search bar.

---

## Search Bar

A single text input at the top right of the filter row. Filters results in real time by:
- Company name (`lead.partner_id[1]`)
- Assigned person name (from resolved `userMap`)

Case-insensitive partial match.

---

## Urgency Color Coding

For each row, compute urgency based on the row's **effective date** (either `x_studio_proposed_date` or `x_studio_next_follow_up_date` depending on the row type) compared to today:

| Condition | Urgency | Row Left Border Color |
|-----------|---------|----------------------|
| Status is **Completed** | — | No color indicator |
| Status is **Cancelled** | — | No color indicator |
| Date is **past today** and status is NOT Completed/Cancelled | 🔴 Overdue | `#EF4444` (danger red) |
| Date is **today or within next 2 days** | 🟠 Urgent | `#F97316` (orange) |
| Date is **3–7 days away** | 🟡 Soon | `#F59E0B` (amber/yellow) |
| Date is **more than 7 days away** | — | No left border / neutral |

Apply the urgency as a **4px left border** on the entire table row. Additionally, render the date cell text in the same urgency color. Do **not** add background shading to the row — only the left border and date text change color.

Also add a small urgency legend below the filter tabs (one line, inline):
```
🔴 Overdue  🟠 Due in ≤2 days  🟡 Due this week
```

---

## Table Columns

| Column | Source | Notes |
|--------|--------|-------|
| **Date** | See sorting logic below | Formatted as "28 May, Thu". Color-coded per urgency. |
| **Date Type** | Derived | Small muted pill next to the date: **"Proposed"** or **"Follow-Up"** — indicates which date field this row is representing. See Sorting section. |
| **Engagement Type** | `x_studio_engagement_type` | Pill with emoji: ✉️ Email, 📞 Phone Call, 🤝 Meeting, 🏛️ Exhibition, 📌 (default) |
| **Company** | `lead.partner_id[1]` | Truncated with ellipsis if long. Show `x_crm_lead_id[1]` as fallback. |
| **Order Value** | `lead.expected_revenue` | Formatted via `fmt()`. Green color. Show "—" if zero/null. |
| **Assigned To** | `x_studio_visit_by` resolved via `userMap` | List persons comma-separated. If empty: show `Unassigned` pill in amber. |
| **Region** | `lead.x_studio_responsible_region_1` | Colored pill using `REGION_COLORS` |
| **Status** | `x_studio_engagement_status` | Pill with STATUS_CONFIG colors (same as SwimlaneView) |

---

## Sorting and Date Expansion

Each engagement record can generate **up to two rows** in the table:

1. One row for `x_studio_proposed_date` (always, if the date is present)
2. A **second row** for `x_studio_next_follow_up_date` — only if the field is non-empty **and** the follow-up date is different from the proposed date

Both rows show the same engagement data (same company, type, assigned person, status, order value) but differ in their **Date** cell and **Date Type** pill.

The full expanded list is then sorted chronologically by the row's effective date (ascending by default). This means a single engagement can appear twice in the list if it has both a proposed date and a follow-up date — once at its proposed date position and once at its follow-up date position.

**Date Type pill styling:**
- `Proposed` — subtle neutral pill: background `rgba(100,116,139,0.10)`, text `#64748B`
- `Follow-Up` — accent pill: background `rgba(99,102,241,0.10)`, text `#6366F1`

**Urgency for follow-up rows:** Apply urgency color coding to the follow-up row using `x_studio_next_follow_up_date` as the reference date (same thresholds as proposed date rows). Do not skip urgency just because it is a follow-up row.

**Sort dropdown top-right options:**
- Date ↑ (default — earliest effective date first)
- Date ↓ (latest first)
- Order Value ↓

**Deduplication rule:** If `x_studio_next_follow_up_date === x_studio_proposed_date`, only emit one row for that date (label it "Proposed", not "Follow-Up").

**Key for each row:** Use `${engagement.id}-proposed` and `${engagement.id}-followup` as React keys so both rows can coexist without key conflicts.

---

## Anomaly Warning

If a row has `x_studio_visit_date` set but `x_studio_engagement_status` is still `"Planned"`, show a ⚠ icon next to the status pill with the tooltip: _"Visit recorded but status not updated"_.

This is the same logic as `SwimlaneView → Pill → isAnomaly`.

---

## Detail Panel (on Row Click)

When a row is clicked, expand a **`DetailPanel`** inline below the table. Clicking the same row again collapses it.

The panel must replicate the `DetailPanel` component from `SwimlaneView.jsx` **exactly**, including:

- 3-column grid layout
- Fields: Customer, Deal Value, Engagement Type, Assigned To, Proposed Date, Actual Interaction Date, Next Follow-Up Date, Remarks/Comments
- Anomaly warning in the panel header
- **"View in Odoo →"** button linking to:
  ```
  https://crm-adage-6.odoo.com/odoo/crm/{x_crm_lead_id[0]}
  ```
  _(This is the correct CRM base URL — use `crm-adage-6`, regardless of what appears in `App.jsx` or `SwimlaneView.jsx`)_
- A close `×` button in the panel header
- `fadeIn` animation on mount

---

## Props Interface

`VisitsTab` receives the following props from `App.jsx`:

```js
{
  leads,          // array — full active leads
  engagements,    // array — all engagement records
  plannedVisits,  // array — pre-filtered: status === "Planned"
  upcomingVisits, // array — planned + sorted by date (top 12) — can be ignored; use engagements directly
  userMap,        // object — { employeeId: "Name" }
}
```

> **Important**: Do not rely on `upcomingVisits` (it was pre-sliced to 12 rows). Instead, derive the filtered + sorted list **inside the component** from `engagements` directly so the filter tabs work across all records.

Build a `leadMap` inside the component:
```js
const leadMap = useMemo(() => {
  const m = {};
  leads.forEach(l => { m[l.id] = l; });
  return m;
}, [leads]);
```

---

## Suggested Additional Improvements (include all of these)

The following improvements were identified during review and should be included in the implementation:

### 1. Empty State Per Filter
When a filter tab + search combination returns zero results, show a contextual empty state rather than a blank table:
- **Unassigned (empty):** "✅ All visits have been assigned."
- **Planned (empty):** "No planned visits found."
- **General:** "No results match your search."

### 2. Count Badges on Filter Tabs
Each tab should show a live count badge that updates as the search query changes. The count reflects how many records match **both** the tab filter and the current search string.

### 3. Keyboard Shortcut to Clear Search
Add an `×` clear button inside the search input that appears when there is text in it. Clicking it resets the search string.

### 4. Sticky Table Header
The column header row should be `position: sticky; top: 0` so it stays visible when the list is long. Wrap the table in a `div` with `maxHeight: "60vh"; overflowY: "auto"`.

### 5. Unassigned Pill
When `x_studio_visit_by` is empty, render a pill:
```
⚠ Unassigned
```
in amber (`#F59E0B` background with white text), rather than a plain dash, so it draws attention.

### 6. Region Color in Assigned-To Column
If only one person is assigned, show their name in their stable person-color (same palette as `SwimlaneView: PERSON_COLORS`). For multiple assignees, use default secondary text color.

### 7. Visit Type Quick Stats Bar
Replace the current "Visit Type Breakdown" and "Status Summary" side panels with a compact **quick-stats strip** above the table (below the filter tabs). It shows the count of each engagement type visible in the current filtered view — one small badge per type:

```
📞 Phone Call: 5   ✉️ Email: 3   🤝 Meeting: 2   🏛️ Exhibition: 1
```

This updates dynamically as filters change.

---

## Implementation Notes

- Import `T` from `src/constants/theme.js`
- Import `REGION_COLORS`, `PERSON_COLORS` from `src/constants/colors.js`
- Import `fmt`, `fmtDate`, `getPersonName` from `src/lib/format.js`
- Do **not** import from SwimlaneView — re-implement the `DetailPanel` and `STATUS_CONFIG` locally inside `VisitsTab.jsx`
- Use `useMemo` for `leadMap`, filtered list, and count badges to avoid recomputing on every keystroke
- Use `useState` for: `activeFilter`, `searchQuery`, `sortOrder`, `selectedEngagement`
- The `STATUS_CONFIG` object to use:
  ```js
  const STATUS_CONFIG = {
    Planned:     { bg: "#10B981", text: "#fff" },
    Completed:   { bg: "#3B82F6", text: "#fff" },
    Rescheduled: { bg: "#F59E0B", text: "#fff" },
    Cancelled:   { bg: "#94A3B8", text: "#fff" },
  };
  ```
- The `TYPE_EMOJI` map:
  ```js
  const TYPE_EMOJI = { "Email": "✉️", "Phone Call": "📞", "Meeting": "🤝", "Exhibition": "🏛️" };
  ```

---

## Acceptance Criteria

- [ ] Default tab on mount is "Planned" (not "All")
- [ ] Engagements with a follow-up date generate a second row sorted by that date
- [ ] Proposed rows show "Proposed" pill; follow-up rows show "Follow-Up" pill in accent color
- [ ] Urgency color coding applies independently to proposed-date rows and follow-up-date rows
- [ ] No duplicate rows when proposed date and follow-up date are the same
- [ ] Urgency left-border and date text color work correctly for past/near/upcoming dates
- [ ] Completed and Cancelled records have no urgency indicator
- [ ] Unassigned filter correctly shows only records with empty `x_studio_visit_by`
- [ ] Search filters by company name AND person name simultaneously
- [ ] Count badges on filter tabs update in real time as search query changes
- [ ] Clicking a row expands the detail panel; clicking again collapses it
- [ ] "View in Odoo →" link uses `crm-adage-6.odoo.com` base URL
- [ ] Anomaly warning (`⚠`) appears on rows AND in detail panel header when applicable
- [ ] Sticky table header works when the list overflows
- [ ] Quick-stats type bar reflects the current filtered view
- [ ] Empty state messages are contextual per filter tab
- [ ] No regressions in other tabs

---

## TeamTab_Feature_Spec

# TeamTab — Feature Specification for Kiro

## Context & Codebase

This project is a React CRM dashboard built with inline styles using a shared theme token object `T` (from `../constants/theme`), `REGION_COLORS` and `PERSON_COLORS` (from `../constants/colors`), and utility functions `fmt`, `fmtDate`, `getPersonName` (from `../lib/format`).

The two relevant files are:

- **`TeamTab.jsx`** — currently renders two sections:
  1. A **pivot table** (planned visits per person × per region)
  2. An **opportunity ownership** section (revenue bar chart per salesperson)

- **`VisitsTab.jsx`** — the reference component. Study this file carefully. It contains:
  - `DetailPanel` — renders full engagement detail (fields: customer, deal value, engagement type, assignees, proposed date, visit date, next follow-up date, remarks, Odoo link)
  - `VisitRow` — a single styled row in a scrollable grid table, with urgency left-border coloring, status pill, engagement type pill, region pill, and assignee list
  - `getUrgency(isoDate, status)` — urgency classification logic (`"overdue"`, `"urgent"`, `"soon"`, `"none"`)
  - `fmtShort(iso)` — formats an ISO date as `"28 May, Thu"`
  - `STATUS_CONFIG`, `TYPE_EMOJI`, `URGENCY` — local constants for styling
  - `MultiSelect` — a reusable dropdown component with checkbox-style multi-selection

The `engagements` array (available as a prop) contains objects with these relevant fields:
- `id`, `x_studio_engagement_status`, `x_studio_engagement_type`
- `x_studio_proposed_date`, `x_studio_next_follow_up_date`, `x_studio_visit_date`
- `x_studio_visit_by` — array of `[id, name]` tuples (the assigned persons)
- `x_crm_lead_id` — `[id, name]` tuple referencing the related lead
- `x_studio_remarkscomments`

The `leads` array contains objects with:
- `id`, `partner_id` (`[id, name]`), `expected_revenue`, `x_studio_responsible_region_1`, `user_id` (`[id, name]`)

---

## Feature 1 — Planned Visits Pivot Table: Drill-Down Navigation

### Current Behaviour
The pivot table shows a static summary: rows = persons, columns = regions, cells = visit counts.

### Required Behaviour

Implement **two-level drill-down** inside the pivot table card, replacing the static table with a navigable view. Use a `drillState` local state object to track the current level.

#### Level 0 — Summary (default)
Same as current: person × region pivot table.

- Each **person row** is now **clickable** (pointer cursor, hover highlight).
- Clicking a person row transitions to Level 1 for that person.
- No column or region is clickable — only person rows drill down.

#### Level 1 — Person Detail, Grouped by Region
When a person is selected:

- Show a **breadcrumb** at the top of the card: `All People › {PersonName}` — clicking "All People" returns to Level 0.
- Show the person's avatar (initials + color, same style as current).
- Below, render **region groups**. For each region where this person has engagements:
  - A **region header** styled with its `REGION_COLORS` color (pill or colored left-border label).
  - A **compact list** of engagements under that region. Each item shows:
    - Engagement type emoji + label
    - Company name (`lead.partner_id[1]`)
    - Proposed date (formatted with `fmtShort`)
    - Status pill (using `STATUS_CONFIG`)
    - Urgency left-border (using `getUrgency`)
  - Each engagement item is **clickable** → transitions to Level 2 for that engagement.
- If a person has engagements with no associated region, group them under `"Unassigned Region"`.

#### Level 2 — Single Engagement Detail
When an engagement is selected from Level 1:

- Show breadcrumb: `All People › {PersonName} › {CompanyName}` — each segment is clickable to navigate back.
- Render the **`DetailPanel`** component (imported/copied from `VisitsTab.jsx`) to display full engagement details.
- Do **not** show a separate close button — navigating via breadcrumb is sufficient.

### Implementation Notes
- Store drill state as: `{ level: 0 | 1 | 2, personName: string | null, engagementId: number | null }`
- Derive the filtered engagements for a person by matching `eng.x_studio_visit_by` entries (resolve names via `userMap` using `getPersonName`).
- Reuse `DetailPanel`, `fmtShort`, `getUrgency`, `URGENCY`, `STATUS_CONFIG`, `TYPE_EMOJI` — either import them from `VisitsTab.jsx` (if they are exported) or duplicate the constants/functions locally in `TeamTab.jsx`.
- The `userMap` prop must be added to `TeamTab` — update the parent component that renders `<TeamTab>` to pass it through.
- Keep the card height consistent across levels; add `overflowY: "auto"` with a `maxHeight` if the region list is long.

---

## Feature 2 — Replace Opportunity Ownership with "This Week's Planned Activities" by Person

### Current Behaviour
The second card shows a revenue bar chart per salesperson (labelled "Opportunity ownership — by salesperson").

### Required Behaviour
**Remove** the opportunity ownership section entirely. Replace it with a new card: **"This Week's Planned Activities — by assignee"**.

### Data Scope
Filter `engagements` to only those where **either** `x_studio_proposed_date` **or** `x_studio_next_follow_up_date` falls within the **current calendar week** (Monday 00:00 to Sunday 23:59, local time). Include both `"Planned"` and `"Rescheduled"` statuses. Exclude `"Completed"` and `"Cancelled"`.

### Grouping
Group the filtered engagements by assigned person (`x_studio_visit_by`). An engagement assigned to multiple persons appears in each person's group. Engagements with no assignees go into an `"Unassigned"` group.

### Priority Ordering (within each person's group)
Sort each person's engagements in this order:
1. **Overdue** first (urgency = `"overdue"` — proposed/follow-up date is before today)
2. **Urgent** (due within 2 days)
3. **Soon** (due this week)
4. Within the same urgency tier, sort by date ascending.

Use the earlier of `x_studio_proposed_date` and `x_studio_next_follow_up_date` as the sort key.

### Layout
Use a **list view** (not grid). For each person group:

- **Person header row**: avatar (initials + `PERSON_COLORS` color, same style as pivot table), person name, and a count badge showing total activities for the week.
- Below the header, render each engagement as a **compact activity card** (a row with a left urgency border, identical to the border logic in `VisitRow` from `VisitsTab.jsx`). Each card shows:
  - **Engagement Type**: emoji + label pill (reuse the purple pill style from `VisitRow`)
  - **Company**: `lead.partner_id[1]` or fallback to `eng.x_crm_lead_id[1]`
  - **Date field**: show both dates if present, labelled:
    - "Proposed: 28 May, Thu" (using `fmtShort`)
    - "Follow-Up: 30 May, Sat" (using `fmtShort`) — only if `x_studio_next_follow_up_date` exists and differs from proposed
  - **Date type pill**: same `"Proposed"` / `"Follow-Up"` pills as `VisitRow` (indigo vs slate)
  - **Status pill**: using `STATUS_CONFIG`
  - Clicking a card opens/closes an **inline `DetailPanel`** (same expand-in-place pattern as `VisitsTab` — track `selectedKey` state).

- Separate person groups with a visible divider.
- If the week has **no activities at all**, show a centred empty state: _"✅ No activities scheduled for this week."_

### "This Week" Calculation
```js
const getWeekRange = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const day = now.getDay(); // 0 = Sun
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const mon = new Date(now); mon.setDate(now.getDate() + diffToMon);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6); sun.setHours(23, 59, 59, 999);
  return { mon, sun };
};
```

Use this to check whether an ISO date string falls within the week:
```js
const inWeek = (iso) => {
  if (!iso) return false;
  const [y, m, d] = iso.split("T")[0].split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date >= mon && date <= sun;
};
```

---

## Props Update

`TeamTab` currently receives: `{ leads, personRegion, personKeys, allRegions }`

After these changes it also needs:
- `engagements` — the full engagements array (same as passed to `VisitsTab`)
- `userMap` — the user ID → name lookup map (same as passed to `VisitsTab`)

Update the parent component that renders `<TeamTab>` to pass these two additional props.

---

## Style Consistency Rules

- All new UI must use `T.*` tokens for colors, **not** hardcoded hex values, except for urgency colors (`#EF4444`, `#FF9933`, `#F59E0B`) which are intentional semantic values shared with `VisitsTab.jsx`.
- Match existing card padding (`"20px 22px"`), section label style (`fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, color: T.textMuted`), and border radius (`borderRadius: 12` for cards, `borderRadius: 100` for pills).
- Animations: reuse the existing `fadeIn` keyframe (`from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; }`) for panel expansions and drill-down transitions.
- Do **not** introduce any new external dependencies.

---

## Kiro_Prompt_Prospect_Health_Speedometer

# Kiro Prompt — Prospect Health Speedometer Indicator

## Objective
Add a small speedometer-style gauge next to each record row in the ADAPT dashboard (PipelineTab and TeamView list rows), driven by the existing `x_studio_prospect_health` field from Odoo CRM. Beside the gauge, display the literal field value as the reason text.

Do not touch any existing filtering, sorting, revenue-bucketing, or drilldown logic in `PipelineTab.jsx` or `TeamView` — this is purely an additive visual component inserted into the existing row markup.

---

## 1. Data requirement

Confirm `x_studio_prospect_health` is included in the field list of the existing `fetchOdoo()` call(s) that populate `PipelineTab.jsx` and `TeamView`. If it isn't already being fetched, add it to the `fields` array of the relevant REST calls — do not create a new API call just for this value; piggyback on the existing list/pipeline fetch.

Known possible values (case-sensitive, must match exactly):
```
"Poor"
"Between Poor and Average"
"Average"
"Between Average and Good"
"Good"
"Very Good"
"Excellent"
"Regret"
"ERROR: No Expected Closing Date"
```
Also handle `null` / `undefined` / empty string (record not yet computed).

---

## 2. New component: `HealthSpeedometer.jsx`

Create this as a standalone, reusable component (e.g. `src/components/HealthSpeedometer.jsx`) — do not inline the SVG logic directly into `PipelineTab.jsx` or `TeamView`, since both need it.

### Props
```
value: string      // raw x_studio_prospect_health value from Odoo
size?: number       // optional, default to a small compact size fitting a list row (~40-48px)
```

### Needle position mapping
The gauge is a semicircle (180° sweep, -90° at far left to +90° at far right). Map the 7 active-scale values to a 0–100 position, evenly spaced, so that every "Between X and Y" value sits exactly halfway between its two neighbors:

```js
const HEALTH_POSITIONS = {
  'Poor': 0,
  'Between Poor and Average': 16.67,
  'Average': 33.33,
  'Between Average and Good': 50,
  'Good': 66.67,
  'Very Good': 83.33,
  'Excellent': 100,
};

const needleAngle = (position) => -90 + (position / 100) * 180;
```

`Regret` and unrecognized/empty values do NOT use this position map — see section 4.

### Color: continuous gradient, not discrete bands
Render the arc background as a single SVG `linearGradient` (or `<path>` with gradient stroke) sweeping red → yellow → light green → dark green, so a needle sitting between two named stops visually reads as a blended color (e.g. "Between Poor and Average" reads as orange, sitting in the red-to-yellow transition).

Gradient stops:
```
0%     #DC2626   (red — Poor)
33.33% #FACC15   (yellow — Average)
66.67% #4ADE80   (light green — Good)
100%   #15803D   (dark green — Excellent)
```

The needle itself can be a neutral dark color (e.g. `#374151`) with a small circular pivot at the base, rotated via `transform: rotate(${needleAngle(position)}deg)` around the center-bottom of the semicircle.

### Regret state — fully greyed out
When `value === 'Regret'`:
- Render the arc in a flat grey gradient (e.g. `#D1D5DB` throughout, no red/yellow/green at all) — this should look visibly "disabled," not just a grey needle on a colored arc.
- Needle can point straight down/hidden, or omit the needle entirely and show a simple grey semicircle with a small "✕" or dash icon at center — pick whichever is visually cleaner but keep it consistent across both PipelineTab and TeamView.

### Fallback state (empty / unrecognized value / error string)
- Treat `null`, `undefined`, `''`, and `'ERROR: No Expected Closing Date'` the same way: show a light grey/dashed outline gauge with no needle, and reason text reads exactly what's in the field for the error case, or `"Not yet scored"` if the value is empty/null.
- Never throw or render blank if the value doesn't match a known key — always fall through to this state rather than crashing the row.

---

## 3. Reason text beside the gauge

Directly beside the speedometer, render the literal `x_studio_prospect_health` string value as-is — no rewording, no mapping to a friendlier phrase. Example: if the field value is `"Between Average and Good"`, the text shown is exactly `Between Average and Good`.

Keep this as small, muted secondary text (not competing visually with the primary row content like company name / revenue), consistent with existing row typography in `PipelineTab.jsx`.

---

## 4. Integration points

- **PipelineTab.jsx list rows**: insert `<HealthSpeedometer value={record.x_studio_prospect_health} />` + reason text into the existing row layout — pick a low-emphasis position (e.g. trailing edge of the row, near existing status indicators) that doesn't disrupt current column alignment or the donut chart / revenue bucketing already in place.
- **TeamView**: same component, same placement logic, inserted into each record row without disturbing the persistent overdue-activities card or the fixed header/breadcrumb structure already implemented.

Do not duplicate the gauge logic between the two views — both must import the same `HealthSpeedometer` component.

---

## 5. Explicit constraints (do not break existing work)

- No changes to existing donut chart, revenue bucketing (This Month / This Quarter / Next Quarter / Next Year / Unclosed Active Prospects), or the portal-based activity popup fix (`ReactDOM.createPortal` + `position: fixed`).
- No new API calls — reuse the existing fetch that already returns each row's data; just ensure `x_studio_prospect_health` is in the requested field list.
- No browser storage (localStorage/sessionStorage) — this component is stateless, purely a function of the `value` prop.
- Keep the gauge small enough to sit inline in a list row without increasing row height noticeably — this is a compact indicator, not a dashboard-level KPI widget.

---

## 6. Testing checklist for Kiro

- [ ] All 7 active-scale values render the needle at the correct position and correct blended color.
- [ ] `Regret` renders fully greyed out, visually distinct from all colored states.
- [ ] Empty/null value renders the fallback state without crashing the row.
- [ ] `"ERROR: No Expected Closing Date"` renders the fallback state, with that exact string shown as reason text.
- [ ] Component behaves identically in both PipelineTab and TeamView.
- [ ] No regression in existing donut chart, revenue bucketing, or activity popup behavior after this change.

---

## Kiro_Prompt_Prospect_Health_Tags_And_Aggregate

# Kiro Prompt — Prospect Health: Row Tags + Aggregate Card Update

Two changes in this prompt, both scoped to the ADAPT dashboard's Prospect Health display. Do not touch donut charts, revenue bucketing, the portal-based activity popup fix, or any other header card while making these changes.

---

## PART A — Replace per-record speedometer with a color-coded tag

Remove the `HealthSpeedometer` component from each record row in PipelineTab and TeamView, and replace it with a color-coded pill/tag showing the reason text.

### A1. Data requirement

The tag text depends on both `x_studio_prospect_health` AND the engagement tracker's activity state — the same health value can map to two different reasons depending on whether an engagement line has been completed. Ensure the existing fetch includes `x_studio_engagement_tracker.x_studio_engagement_status` for each record — reuse the existing list fetch, don't add a new API call.

Compute a boolean per record, same logic as the Odoo compute field:
```js
function hasCompletedActivity(record) {
  const lines = record.x_studio_engagement_tracker.filter(
    l => l.x_studio_engagement_status !== 'Cancelled'
  );
  return lines.some(l => l.x_studio_engagement_status === 'Completed');
}
```

### A2. Label lookup table

```js
function getHealthLabel(health, hasCompleted) {
  const LABEL_MATRIX = {
    'Poor': 'Missed Opportunity without any action',
    'Between Poor and Average': hasCompleted
      ? 'Missed Opportunity despite Sales attempts'
      : 'Missed Opportunity without any action',
    'Average': hasCompleted
      ? 'Missed Opportunity despite Sales attempts'
      : 'Pending Sales Action',
    'Between Average and Good': hasCompleted
      ? 'Close to Due Date'
      : 'Pending Sales Action',
    'Good': 'Prospect On Track',
    'Very Good': 'Prospect On Track',
    'Excellent': 'Prospect Resulted in RFQ',
    'Regret': hasCompleted
      ? 'Missed Opportunity'
      : 'Missed Opportunity without any action',
  };
  return LABEL_MATRIX[health] ?? null; // null => fallback state, see A4
}
```

### A3. Tag color mapping

Colors follow the health value itself (not the label text):

```js
const HEALTH_COLORS = {
  'Poor':                       { bg: '#FEE2E2', text: '#DC2626' }, // red
  'Between Poor and Average':   { bg: '#FFEDD5', text: '#F97316' }, // orange
  'Average':                    { bg: '#FEF9C3', text: '#CA8A04' }, // yellow
  'Between Average and Good':   { bg: '#ECFCCB', text: '#65A30D' }, // lime
  'Good':                       { bg: '#DCFCE7', text: '#16A34A' }, // light green
  'Very Good':                  { bg: '#DCFCE7', text: '#15803D' }, // green
  'Excellent':                  { bg: '#DCFCE7', text: '#166534' }, // dark green
  'Regret':                     { bg: '#F3F4F6', text: '#6B7280' }, // grey
};
```

This is why "Poor" is a red tag and "Between Poor and Average" with no/planned activity is an orange tag with the *same label text* as Poor — color reflects the health tier, text reflects the underlying reason, and the two are separate lookups both keyed off `x_studio_prospect_health`.

### A4. Fallback state

If `health` is `null`, empty, unrecognized, or equals `"ERROR: No Expected Closing Date"`, render a neutral grey outline tag with text `"Not yet scored"` (or the literal error string for the error case) — never crash or render blank.

### A5. Component

Build as a reusable `HealthTag.jsx` component (props: `health`, `hasCompleted`), replacing `HealthSpeedometer` at the same call sites in both PipelineTab and TeamView. Render as a compact rounded pill sized to sit inline in a list row without increasing row height.

---

## PART B — Update the "Overall Prospect Health" header card

This card is an **aggregate** across all currently filtered records (currently shows a gauge, "19.6", and a bold tier name like "Between Poor and Average" underneath). Keep the gauge visual and the numeric average exactly as-is. Only replace the bold tier-name text with a computed reason, and add a hover tooltip.

### B1. Confirm the existing average calculation

The average score should be computed by mapping each filtered record's `x_studio_prospect_health` to a numeric position:

```js
const HEALTH_POSITIONS = {
  'Poor': 0, 'Between Poor and Average': 16.67, 'Average': 33.33,
  'Between Average and Good': 50, 'Good': 66.67, 'Very Good': 83.33,
  'Excellent': 100,
};
```

`Regret` and unscored/error records are excluded from both the numerator and denominator. Confirm this matches how "19.6" is currently produced; if the existing calculation differs, flag it before changing the label logic below, since the label needs to reference the same bucket the number represents. Once you have the average, find the nearest tier from the position map (e.g. 19.6 → closest to 16.67 → "Between Poor and Average") — this is the bucket used for the reason text.

### B2. Root label per bucket

```js
const ROOT_LABELS = {
  'Poor': { text: 'Missed Opportunity without any action', splits: false },
  'Between Poor and Average': { text: 'Missed Opportunity', splits: true },
  'Average': { text: 'Missed Opportunity / Pending Sales Action', splits: true },
  'Between Average and Good': { text: 'Close to Due Date / Pending Sales Action', splits: true },
  'Good': { text: 'Prospect On Track', splits: false },
  'Very Good': { text: 'Prospect On Track', splits: false },
  'Excellent': { text: 'Prospect Resulted in RFQ', splits: false },
  'Regret': { text: 'Missed Opportunity', splits: true },
};
```

Note "Average" and "Between Average and Good" don't share one clean root phrase the way "Between Poor and Average" does — their two branches ("Missed Opportunity despite Sales attempts" vs "Pending Sales Action" / "Close to Due Date" vs "Pending Sales Action") are genuinely different concepts, not a shared root with a suffix. If the bucket lands on one of these two, a slash-combined label plus counts may read awkwardly — flag this back during testing; for "Between Poor and Average" and "Regret" the shared-root + counts pattern works cleanly.

### B3. Counts (for tiers where `splits: true`)

Among only the records that fall into **this specific bucket** (not all filtered records), count how many have at least one completed activity vs none, using the same `hasCompletedActivity()` helper from Part A:

```js
const bucketRecords = filteredRecords.filter(r => r.x_studio_prospect_health === bucketTier);
const attempted = bucketRecords.filter(hasCompletedActivity).length;
const noAction = bucketRecords.length - attempted;
```

Render as: `Missed Opportunity (${noAction} no action, ${attempted} attempted)`.

If `splits: false`, show the fixed text with no counts, e.g. "Prospect On Track".

### B4. Hover tooltip

Add a tooltip (on the gauge or the reason text — whichever is less visually cluttered) explaining both the per-record formula and the averaging:

```
How this score is calculated:

Each lead's health is scored from its expected closing date and activity status:
• Overdue / On Time (this week) / Upcoming (this month) / Upcoming (beyond)
• combined with: no activity / activity planned / activity completed
...producing a rating from Poor to Excellent, or Regret if the lead was
manually marked lost.

This card averages that rating across all currently filtered leads
(Regret and unscored leads are excluded from the average), then shows
the closest matching tier and its reason.
```

Keep this tooltip text static/hardcoded — it explains methodology, not per-record data. Use whatever tooltip/popover pattern already exists elsewhere in the dashboard; don't introduce a new tooltip library.

---

## Shared constraints (both parts)

- No new API calls in either part — reuse the existing dataset already powering these views.
- No browser storage — both `HealthTag` and the aggregate card logic are pure functions of the data already fetched.
- Don't duplicate `hasCompletedActivity()` or the label/color maps between Part A and Part B — define once, import in both places.
- No regression to donut charts, revenue bucketing, the activity popup portal fix, or any other header card.

---

## Testing checklist

**Part A**
- [ ] Poor → red tag, "Missed Opportunity without any action"
- [ ] Between Poor and Average + no completed activity → orange tag, "Missed Opportunity without any action"
- [ ] Between Poor and Average + completed activity → orange tag, "Missed Opportunity despite Sales attempts"
- [ ] Average, Between Average and Good → verify both branches resolve correctly
- [ ] Good, Very Good → both "Prospect On Track", correct respective green shades
- [ ] Excellent → dark green, "Prospect Resulted in RFQ"
- [ ] Regret → grey tag, correct label based on activity state
- [ ] Empty/error value → fallback grey outline tag, no crash

**Part B**
- [ ] Reason text updates correctly when filters change (different date range/region → different record set → different average → different bucket/reason)
- [ ] Counts sum to the number of records actually in that bucket, not all filtered records
- [ ] Poor / Good / Very Good / Excellent buckets show fixed text with no count suffix
- [ ] Tooltip appears on hover, readable, not clipped near card edges
- [ ] No change to gauge visual or the numeric average value

---

## ADAPT_Corrective_Redesign_v2

# ADAPT Pipeline — Corrective Redesign Prompt v2

## Context

This prompt **supersedes and corrects** `ADAPT_Pipeline_UX_Redesign.md` and `ADAPT_Donut_Chart_Redesign_Addendum.md`.

Problems introduced by previous implementation:
- List view rows are too compact — opportunity names are being cut/truncated
- Revenue donut changes made it look worse — revert to near-original with minor cleanup only
- Greenfield vs Brownfield donut needs more visual prominence

This prompt addresses all three. Implement all three sections together.

---

## Section 1 — List View: Proper Column Layout

### Decision

Revert the 4-zone card-row layout from the previous prompt. Replace it with a **proper column-based table** — but styled cleanly, not a raw HTML table.

Use a **CSS Grid list** (not `<table>`) with 7 named columns and visible column headers. Opportunity names must **never truncate** — they wrap to 2 lines if needed.

---

### Column Definitions

| # | Column Header | Data Field | Width | Notes |
|---|---|---|---|---|
| 1 | Opportunity Name | `name` + `partner_id[1]` | `2fr` | Bold title, company below in muted text. Wraps up to 2 lines. Never truncate. |
| 2 | Closing & Status | `x_studio_expected_closing` | `120px` | Date on top, urgency badge below |
| 3 | Order Value | `expected_revenue` | `110px` | Right-aligned, teal, bold |
| 4 | Region | `x_studio_region` | `100px` | Colored region pill |
| 5 | Salesperson | `user_id[1]` | `130px` | First name + last initial, or full name |
| 6 | Project Type | `x_studio_project_type` | `110px` | Greenfield/Brownfield badge |
| 7 | Activities | Engagement tracker count | `80px` | Count badge; `—` if zero |

---

### Column Header Style

```css
.pipeline-list-header {
  display: grid;
  grid-template-columns: 2fr 120px 110px 100px 130px 110px 80px;
  padding: 8px 16px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.pipeline-list-header span {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}
```

---

### Row Style

```css
.pipeline-list-row {
  display: grid;
  grid-template-columns: 2fr 120px 110px 100px 130px 110px 80px;
  padding: 10px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  align-items: start;   /* top-align so wrapped names don't stretch others */
  cursor: pointer;
  transition: background 0.15s;
  min-height: 52px;
}

.pipeline-list-row:hover {
  background: #f0fdfd;
}
```

---

### Column 1 — Opportunity Name

```jsx
<div className="col-opportunity">
  <div className="opp-title">{lead.name}</div>
  <div className="opp-company">{lead.partner_id?.[1] || '—'}</div>
  <a
    className="opp-odoo-link"
    href={`https://crm-adage-7.odoo.com/odoo/crm/${lead.id}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    View in Odoo ↗
  </a>
</div>
```

```css
.col-opportunity {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-right: 12px;
}

.opp-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  /* NO overflow: hidden, NO text-overflow: ellipsis, NO white-space: nowrap */
  /* Allow natural wrapping up to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.opp-company {
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.opp-odoo-link {
  font-size: 10px;
  color: #02818A;
  text-decoration: none;
  opacity: 0;
  transition: opacity 0.15s;
}

.pipeline-list-row:hover .opp-odoo-link {
  opacity: 1;
}
```

---

### Column 2 — Closing & Status

Two stacked elements:

**Top:** Formatted date `"31 Aug"` or `"No date"` — `font-size: 12px`, `color: #374151`

**Bottom:** Urgency badge

Urgency badge logic (use timezone-safe parsing — split on `"-"`, construct `new Date(y, m-1, d)`):

| Condition | Badge | Color |
|---|---|---|
| Past date | `OVERDUE` | `#ef4444` red |
| Today | `TODAY` | `#f97316` orange |
| Tomorrow | `TOMORROW` | `#f97316` orange |
| Within 7 days | `THIS WEEK` | `#eab308` amber |
| Future | `UPCOMING` | `#22c55e` green |
| No date | `—` | no badge |

```css
.urgency-badge {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 3px;
  color: white;
  margin-top: 3px;
}
.urgency-overdue  { background: #ef4444; }
.urgency-today    { background: #f97316; }
.urgency-week     { background: #eab308; }
.urgency-upcoming { background: #22c55e; }
```

---

### Column 3 — Order Value

```css
.col-value {
  font-size: 13px;
  font-weight: 700;
  color: #02818A;
  text-align: right;
  padding-right: 8px;
}
```

Use existing `formatCurrency()` utility. No changes to the utility.

---

### Column 4 — Region

Reuse existing region colored pill component. No changes.

---

### Column 5 — Salesperson

```css
.col-salesperson {
  font-size: 12px;
  color: #374151;
  font-weight: 500;
}
```

Show full name. If longer than ~16 chars, allow wrapping to 2 lines (do not truncate).

---

### Column 6 — Project Type

Reuse existing Greenfield/Brownfield badge. No changes.

If `x_studio_project_type` is null/empty, show `—` in `color: #d1d5db`.

---

### Column 7 — Activities Planned

Show the count of engagement tracker records for this lead from the `x_crm_lead_line_6bc5b` model.

**If the engagement tracker count is already available** in the lead data object (e.g. `lead.x_studio_engagement_count` or similar computed field), display it directly.

**If not already fetched**, fetch counts separately using a `searchRead` call on `x_crm_lead_line_6bc5b` grouped by `x_lead_id` (or the Many2one field linking back to `crm.lead`). Fetch this once after the main pipeline data loads, then merge by lead ID.

Display:

```jsx
{activityCount > 0
  ? <span className="activity-count-badge">{activityCount}</span>
  : <span className="activity-count-empty">—</span>
}
```

```css
.activity-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0f2fe;
  color: #0284c7;
  font-size: 11px;
  font-weight: 700;
}

.activity-count-empty {
  color: #d1d5db;
  font-size: 13px;
}
```

---

### Stage Group Header

Keep the stage group header (e.g. **New — 45 leads — ₹67.8Cr**) but do **not** make it span a grid column. It should span the full width above the rows for that stage.

```css
.stage-group-header {
  grid-column: 1 / -1;   /* span all columns if inside grid, otherwise full-width block */
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #f8fafc;
  border-left: 4px solid #02818A;
  margin-top: 8px;
}

.stage-group-header .stage-name {
  font-size: 13px;
  font-weight: 700;
  color: #02818A;
}

.stage-group-header .stage-meta {
  font-size: 12px;
  color: #94a3b8;
}
```

---

## Section 2 — Greenfield vs Brownfield Donut: More Prominent

### Problem

The GF/BF donut is visually equal in weight to the Revenue donut. It should feel like the **primary comparison metric** since it directly answers "what kind of pipeline do we have?"

### Changes

#### 2a. Make the card taller / donut larger

- Increase the donut SVG/chart size to `120px × 120px` (from current ~80px)
- Center label: value `₹193.9Cr` at `font-size: 20px`, `font-weight: 800`, sub-label `total` at `font-size: 11px`, `color: #9ca3af`

#### 2b. Stronger color contrast

Replace current muted colors with high-contrast segment colors:

| Segment | Current | New |
|---|---|---|
| Brownfield | muted brown | `#92400e` (rich amber-brown) |
| Greenfield | muted green | `#02818A` (Adage teal) |

Update wherever the segment colors are defined for this chart only. Do not change the Revenue donut colors.

#### 2c. Legend redesign — horizontal, below the donut

Move the legend from the right side to **below the donut**, horizontally centered:

```
        ₹193.9Cr
          total

  ● Brownfield    ● Greenfield
  ₹163.9Cr  51   ₹30.0Cr  2
```

```css
.gf-bf-legend {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: 12px;
}

.gf-bf-legend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.gf-bf-legend-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #374151;
}

.gf-bf-legend-value {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.gf-bf-legend-count {
  font-size: 10px;
  color: #9ca3af;
}
```

#### 2d. Card title

Change: `GREENFIELD VS BROWNFIELD`
To: `PROJECT MIX`

This is more concise and fits better above the redesigned layout.

---

## Section 3 — Revenue Donut: Simplify (Revert Overcomplicated Changes)

The previous addendum made the Revenue donut worse. Apply **only** these minimal changes — nothing else:

### 3a. Strip "ACTIVE • " prefix from legend labels ONLY

Change legend labels:
- `ACTIVE • >12 months` → `> 12 months`
- `ACTIVE • This quarter` → `This quarter`
- `ACTIVE • ≤12 months` → `≤ 12 months`
- `ACTIVE • ≤6 months` → `≤ 6 months`

Keep everything else in the legend exactly as it was before — same layout, same spacing, same font sizes, same value/count display.

### 3b. Card title

Change: `REVENUE BY LEAD STATUS`
To: `ACTIVE PIPELINE`

### 3c. Do NOT change

- Legend layout or grid structure
- Dot colors
- Value formatting
- Count display
- Donut size
- Center label
- Card padding
- Any other styling

**Do not apply any other changes from the previous donut addendum prompt.**

---

## Files to Modify

| File | Change |
|---|---|
| `src/views/PipelineTab.jsx` | List view columns, stage headers, GF/BF donut, Revenue donut labels |
| `src/views/PipelineTab.css` | Column grid, row styles, urgency badge, activity count badge, GF/BF legend |

## Do NOT Modify

- Kanban view
- Filter bar (already handled in previous prompt — do not re-touch)
- Projected Monthly Closings bar chart
- Any other tab (Visits, TeamView, Calendar)
- `theme.js`, `odoo.js`, `.env`
- `formatCurrency` utility

---

## Acceptance Criteria

- [ ] List view uses 7 named columns with visible sticky headers
- [ ] Opportunity names wrap to 2 lines — never truncate with `…` mid-word on a single line
- [ ] Company name shows below opportunity title in muted text
- [ ] "View in Odoo ↗" appears on row hover
- [ ] Column 2 shows date + urgency badge (two stacked elements)
- [ ] Column 7 shows engagement tracker count as a circle badge, or `—`
- [ ] Stage group headers span full width with teal left border
- [ ] GF/BF donut uses `#92400e` for Brownfield, `#02818A` for Greenfield
- [ ] GF/BF donut is larger (120px), legend is below and horizontal
- [ ] GF/BF card title reads "PROJECT MIX"
- [ ] Revenue donut legend labels have no "ACTIVE • " prefix
- [ ] Revenue donut card title reads "ACTIVE PIPELINE"
- [ ] Revenue donut layout/structure is otherwise unchanged from original
- [ ] No horizontal scroll at 1280px viewport

---

## ADAPT_Donut_Chart_Redesign_Addendum

# ADAPT — Revenue Donut Chart Redesign (Addendum to Pipeline UX Redesign)

## Scope

This is an addendum to the `ADAPT_Pipeline_UX_Redesign.md` prompt.
It targets only the **"Revenue by Lead Status" donut chart** card in `PipelineTab.jsx`.

Do **not** modify the Greenfield vs Brownfield donut or the Projected Monthly Closings bar chart.

---

## Problem

The current donut card is cluttered because:

1. Every legend label is prefixed with `"ACTIVE • "` — this word appears **four times** in a small card.
2. Each legend row shows value AND count inline, making lines long.
3. When filters reduce the data to 1–2 segments, the legend still occupies the same space and looks unbalanced.
4. The card title "REVENUE BY LEAD STATUS" and label inside the donut "PIPELINE" both try to name the same thing.

---

## Target Design

### Card Layout

```
┌──────────────────────────────────────────────────────┐
│  PIPELINE VALUE                                       │
│                                                       │
│    [ Donut ]    > 12 months    ₹166.5Cr   85 leads   │
│    ₹197.7Cr     This quarter   ₹30.0Cr     1 lead    │
│    total        ≤ 12 months    ₹1.2Cr      1 lead    │
│                 ≤ 6 months     ₹2.4L        2 leads  │
└──────────────────────────────────────────────────────┘
```

---

## Specific Changes

### 1. Rename Card Title

Change: `REVENUE BY LEAD STATUS`
To: `PIPELINE VALUE`

### 2. Remove "ACTIVE •" Prefix from All Legend Labels

The segment labels currently are:
- `ACTIVE • >12 months`
- `ACTIVE • This quarter`
- `ACTIVE • ≤12 months`
- `ACTIVE • ≤6 months`

Strip the `ACTIVE • ` prefix. New labels:
- `> 12 months`
- `This quarter`
- `≤ 12 months`
- `≤ 6 months`

### 3. Restructure Legend Row Layout

Each legend row should use a **3-column layout**:

```
[● Label]          [₹Value]     [N leads]
```

- **Dot + Label**: flex-start, `font-size: 12px`, `color: #374151`, `font-weight: 500`
- **Value**: center or right-aligned, `font-size: 13px`, `font-weight: 700`, `color: #1a1a2e`
- **Count**: right-aligned, `font-size: 11px`, `color: #9ca3af`, e.g. `85 leads` or `1 lead`

Use CSS grid on the legend container:
```css
.donut-legend {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 4px 12px;
  align-items: center;
  width: 100%;
}
```

Each row maps to 3 grid cells: label | value | count.

### 4. Donut Center Label

Currently shows: `₹197.7Cr` + `PIPELINE`

Change the sub-label from `PIPELINE` to `total` (lowercase, muted):
- Value: `font-size: 18px`, `font-weight: 700`, `color: #1a1a2e`
- Sub-label: `font-size: 11px`, `font-weight: 400`, `color: #9ca3af`, text: `total`

### 5. Handle Filtered / Single-Segment State

When filters reduce the data to 1 or 2 segments:

- **Do not** render legend rows for segments with `value === 0` or segments not present in the data.
- If only 1 segment exists, hide the legend entirely and show only the donut + center label + a single line below: `All in [segment label]` in `font-size: 12px`, `color: #6b7280`.
- This prevents the card from showing 3 empty grey rows when filters are active.

```jsx
// Pseudocode
const activeSegments = legendData.filter(seg => seg.value > 0);

if (activeSegments.length === 1) {
  return <SingleSegmentFallback label={activeSegments[0].label} />;
}

return activeSegments.map(seg => <LegendRow key={seg.label} {...seg} />);
```

### 6. Color Dots

Keep the existing orange-family color palette for the donut segments. Just ensure the legend dots are `width: 8px`, `height: 8px`, `border-radius: 50%`, `flex-shrink: 0`, and match the corresponding segment color exactly.

### 7. Card Padding and Min-Height

- Card `padding: 16px 20px`
- Donut container: `width: 90px`, `height: 90px` (slightly smaller than current to give legend more breathing room)
- Legend container: `flex: 1`, `padding-left: 16px`

---

## Files to Modify

| File | Change |
|---|---|
| `src/views/PipelineTab.jsx` | Donut card layout, legend restructure, filtered state handling |
| `src/views/PipelineTab.css` (or inline styles) | Legend grid CSS, dot sizing, center label styles |

Do **not** modify:
- The donut chart library config or arc rendering logic
- Segment color assignments
- The data-fetching logic for this chart
- Any other chart card

---

## Acceptance Criteria

- [ ] Card title reads "PIPELINE VALUE"
- [ ] No legend label contains the word "ACTIVE"
- [ ] Legend uses 3-column grid: label | value | count
- [ ] Count column reads "N leads" (singular "1 lead")
- [ ] Donut center sub-label reads "total" (lowercase)
- [ ] When filters leave only 1 segment, legend is hidden and fallback text shown
- [ ] Zero-value segments are not rendered in the legend
- [ ] Card does not overflow its container at 1280px viewport width

---

## retheme-make-com-inspired

# Kiro Prompt — Make.com-Inspired Visual Retheme for ADAPT Dashboard

## Objective

Restyle the ADAPT CRM dashboard to be aesthetically inspired by **Make.com's UI language** — clean white/near-white backgrounds, Adage brand teal `#02818A` as the primary accent, sharp geometric card shapes with subtle shadows, crisp Inter typography, and muted cool-grey supporting tones. No dark mode. Light, professional, modern SaaS feel.

---

## Reference Visual Language (Make.com)

| Element | Make.com Style |
|---|---|
| Background | Pure white `#FFFFFF` or very light grey `#F7F7FA` |
| Cards | White with subtle `box-shadow`, no heavy borders |
| Accent / primary | Adage brand teal `#02818A` |
| Accent light bg | `#E6F4F5` (teal tint) |
| Accent border | `#9DD0D4` |
| Text primary | Near-black `#111827` |
| Text secondary | Medium grey `#6B7280` |
| Text muted | Light grey `#9CA3AF` |
| Borders | Very light `#E5E7EB` |
| Success / green | `#059669` |
| Warning / orange | `#D97706` |
| Danger / red | `#DC2626` |
| Tag / badge bg | Soft tinted pill, e.g. `#F3F4F6` with `#374151` text |
| Font | Inter (already in use — keep it) |
| Border radius | Cards: `12px`, buttons: `8px`, tags: `100px` |
| Shadow | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` |
| Hover shadow | `0 4px 12px rgba(0,0,0,0.10)` |

---

## File to Edit

**`src/constants/theme.js`** (or `theme.ts`)

Replace the entire export object (the `T` constant) with the following:

```js
export const T = {
  // ── Backgrounds ──────────────────────────────────────────────────────────────
  bgPage:       "#F7F7FA",       // page/app background
  bgCard:       "#FFFFFF",       // kanban card, list row, panels
  bgCardAlt:    "#F9F9FB",       // hovered card or alternate row
  bgSidebar:    "#FFFFFF",       // sidebar/header if applicable

  // ── Borders ──────────────────────────────────────────────────────────────────
  border:       "#E5E7EB",       // default card/container border
  borderMd:     "#D1D5DB",       // medium emphasis border (inputs, dividers)

  // ── Text ─────────────────────────────────────────────────────────────────────
  textPrimary:  "#111827",       // headings, lead names
  textSecondary:"#374151",       // body / field values
  textMuted:    "#9CA3AF",       // labels, secondary metadata

  // ── Accent (Adage brand teal) ────────────────────────────────────────────────
  accent:       "#02818A",       // buttons, links, highlights, active states
  accentHover:  "#026E76",       // accent on hover (slightly darker)
  accentBg:     "#E6F4F5",       // accent-tinted background (selected, badge bg)
  accentBdr:    "#9DD0D4",       // accent-tinted border

  // ── Semantic ─────────────────────────────────────────────────────────────────
  success:      "#059669",       // deal value, won status
  successBg:    "#D1FAE5",
  warning:      "#D97706",       // urgent closing date
  warningBg:    "#FEF3C7",
  danger:       "#DC2626",       // overdue
  dangerBg:     "#FEE2E2",

  // ── Shadows ──────────────────────────────────────────────────────────────────
  shadowSm:     "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:     "0 4px 12px rgba(0,0,0,0.10)",
};
```

---

## Additional Style Adjustments (in PipelineTab.jsx)

After updating `theme.js`, apply these targeted tweaks in `PipelineTab.jsx` to complete the Make.com look:

### 1. KanbanCard root `div` — replace border + add shadow

```jsx
// Replace the border and add box-shadow
border: `1px solid ${T.border}`,
boxShadow: hovered ? T.shadowMd : T.shadowSm,
borderRadius: 12,
// Remove the borderLeft urgency coloring — move urgency signal to a top-left dot instead (see below)
```

### 2. Urgency indicator — replace left border with a coloured dot in the name row

Instead of `borderLeft: 4px solid urg.border`, add a small coloured circle next to the lead name:

```jsx
{/* Urgency dot */}
{closingDate && (
  <span style={{
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: urg.border === "transparent" ? "transparent" : urg.border,
    flexShrink: 0,
    marginTop: 3,
  }} />
)}
```

Place this dot inline with the lead name `div` using a flex row wrapper:

```jsx
<div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
  {/* urgency dot here */}
  <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, lineHeight: 1.4, wordBreak: "break-word" }}>
    {lead.name}
  </div>
</div>
```

### 3. Status tags — use tinted pill style (Make.com badge language)

Update the status badge to use a softer pill with no hard border:

```jsx
// CONVERTED TO RFQ
background: "#EDE9FE", color: "#6D28D9"   // purple tint

// ACTIVE
background: "#D1FAE5", color: "#065F46"   // green tint

// LOST / DEAD
background: "#FEE2E2", color: "#991B1B"   // red tint

// default / fallback
background: "#F3F4F6", color: "#374151"   // neutral grey
```

Update `STATUS_COLORS` to return objects `{ bg, text }` and apply both in the badge render:

```jsx
const STATUS_PILL = {
  "CONVERTED TO RFQ": { bg: "#E6F4F5", text: "#02818A" },
  "ACTIVE":           { bg: "#D1FAE5", text: "#065F46" },
  "LOST":             { bg: "#FEE2E2", text: "#991B1B" },
  "DEAD":             { bg: "#FEE2E2", text: "#991B1B" },
};
const getPill = (val) => STATUS_PILL[val] || { bg: "#F3F4F6", text: "#374151" };

// In the badge JSX:
const pill = getPill(statusVal);
<span style={{
  fontSize: 10, fontWeight: 700,
  padding: "2px 8px", borderRadius: 100,
  background: pill.bg, color: pill.text,
  border: "none",
}}>
  {statusVal}
</span>
```

### 4. "View in Odoo →" button — Make.com action button style

```jsx
<a style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  padding: "8px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  background: T.accentBg,
  color: T.accent,
  border: `1px solid ${T.accentBdr}`,
  textDecoration: "none",
  transition: "background 0.15s, box-shadow 0.15s",
  letterSpacing: "0.2px",
}}>
  View in Odoo →
</a>
```

### 5. Field label style — Make.com uppercase label treatment

```jsx
// Labels: lighter grey, smaller, wider letter-spacing
fontSize: 9,
color: T.textMuted,
fontWeight: 600,
letterSpacing: "0.8px",
textTransform: "uppercase",
marginBottom: 2,
```

### 6. Group header row (region group label) — update background

```jsx
// Group row: white bg, left teal accent line
background: "#FFFFFF",
borderLeft: `3px solid #02818A`,
paddingLeft: 12,
borderRadius: 6,
```

### 7. Filter bar buttons (MultiSelect) — round pill style

```jsx
// Filter chip buttons
borderRadius: 100,      // fully rounded pill (Make.com filter chips)
padding: "5px 14px",
fontSize: 12,
fontWeight: 500,
```

---

## Page Background

In `App.jsx` or the root layout wrapper, set the page background:

```jsx
style={{ background: "#F7F7FA", minHeight: "100vh" }}
```

---

## Do NOT Change

- All data-fetching logic
- All filter/grouping logic
- Field names and API calls
- The `LeadDetailPanel` component behaviour
- Any `.env` variables or Odoo connection config
- The `REGION_COLORS` and `PERSON_COLORS` constants (keep those as-is for region identity)

---

## Expected Result

The ADAPT dashboard should feel visually consistent with Make.com's SaaS aesthetic:
- Light, airy white page background
- Cards floating with subtle shadows (no heavy outlines)
- Adage brand teal `#02818A` as the single strong accent colour for interactive elements
- Soft tinted badge pills for status tags
- Crisp Inter typography with proper label/value hierarchy
- No dark backgrounds, no neon colours, no heavy borders

---

## kiro-refactor-prompt

# Kiro Prompt: Refactor App.jsx into Clean Component Architecture

## Context

I have a React CRM dashboard (`App.jsx`) that has grown into a single large file (~700+ lines). It contains:

- A root `App` component with all state, data fetching, and rendering logic
- Five tab views rendered inline: **Overview**, **Pipeline**, **Visits**, **Team View**, and **Swimlane/Calendar**
- A **Calendar Day Popup** overlay rendered inline at the bottom
- Shared constants: `T` (theme tokens), `REGION_COLORS`, `STAGE_COLORS`, `PERSON_COLORS`, `ODOO_BASE`, `API_KEY`
- Shared utility functions: `fetchOdoo`, `fmt`, `fmtDate`, `getPersonName`, `getPersonNames`
- A `SwimlaneView` component already split out in `SwimlaneView.jsx`

## Goal

Refactor `App.jsx` so that:

1. Each tab view is extracted into its **own component file** under `src/views/`
2. Shared constants, colors, and utility functions are extracted into dedicated files under `src/lib/` or `src/constants/`
3. The `App.jsx` file becomes a **clean orchestrator** — it only handles:
   - State declarations
   - Data fetching (`loadData`)
   - Derived computations (aggregations like `byRegion`, `byStage`, etc.)
   - Tab routing (rendering the correct view)
   - The sticky header + tab nav
4. No logic or JSX beyond the above should remain in `App.jsx`

---

## Exact File Structure to Create

```
src/
├── App.jsx                          ← cleaned orchestrator only
├── SwimlaneView.jsx                 ← already exists, leave untouched
├── constants/
│   ├── theme.js                     ← export const T = { ... }
│   └── colors.js                    ← REGION_COLORS, STAGE_COLORS, PERSON_COLORS, GB_COLORS, PB_COLORS
├── lib/
│   ├── odoo.js                      ← fetchOdoo, ODOO_BASE, API_KEY
│   └── format.js                    ← fmt(), fmtDate(), getPersonName(), getPersonNames()
└── views/
    ├── OverviewTab.jsx
    ├── PipelineTab.jsx
    ├── VisitsTab.jsx
    ├── TeamTab.jsx
    └── CalendarDayPopup.jsx
```

---

## Extraction Rules Per File

### `src/constants/theme.js`
Extract the entire `T` object (the `const T = { ... }` block with all design tokens). Export as named export.

### `src/constants/colors.js`
Extract all color maps:
- `REGION_COLORS`
- `STAGE_COLORS`
- `PERSON_COLORS`
- `GB_COLORS`
- `PB_COLORS`

Export each as a named export.

### `src/lib/odoo.js`
Extract:
- `ODOO_BASE` constant
- `API_KEY` constant
- `fetchOdoo` async function

Export all three as named exports.

### `src/lib/format.js`
Extract:
- `fmt(n)` — formats a number as ₹ crores / lakhs / K
- `fmtDate(d)` — formats a date string to Indian locale
- `getPersonName(p)` — resolves a person from a Many2many field value
- `getPersonNames(persons, userMap)` — resolves all persons from an array, returns joined string

> ⚠️ `getPersonName` and `getPersonNames` currently use `userMap` from closure scope in `App.jsx`. When extracting, pass `userMap` as a parameter to both functions.

### `src/views/OverviewTab.jsx`
Extract the entire `{activeTab === "overview" && (...)}` block.

**Props it needs:**
```js
{
  leads,           // array
  data,            // full data object (for closedLeads)
  engagements,     // array
  totalRev,        // number
  hotLeads,        // array
  plannedVisits,   // array
  wonLeads,        // array
  lostLeads,       // array
  winRate,         // number | null
  overdueLeads,    // array
  overdueRev,      // number
  byRegion,        // object
  byStage,         // object
  gbEntries,       // array
  pbEntries,       // array
  gbTotal,         // number
  pbTotal,         // number
  hotSorted,       // array
  selectedLead,    // object | null
  setSelectedLead, // function
}
```

### `src/views/PipelineTab.jsx`
Extract the `{activeTab === "pipeline" && (...)}` block.

**Props it needs:**
```js
{
  leads,   // array
  stages,  // array (data.stages)
}
```

### `src/views/VisitsTab.jsx`
Extract the `{activeTab === "visits" && (...)}` block.

**Props it needs:**
```js
{
  leads,          // array
  engagements,    // array
  plannedVisits,  // array
  upcomingVisits, // array
  userMap,        // object
}
```

### `src/views/TeamTab.jsx`
Extract the `{activeTab === "team" && (...)}` block.

**Props it needs:**
```js
{
  leads,         // array
  personRegion,  // object
  personKeys,    // array
  allRegions,    // array
}
```

### `src/views/CalendarDayPopup.jsx`
Extract the `{popupDay && (() => { ... })()}` block at the bottom of the return.

**Props it needs:**
```js
{
  popupDay,        // object | null
  setPopupDay,     // function
  popupDetail,     // object | null
  setPopupDetail,  // function
  leads,           // array
  userMap,         // object
}
```

---

## What Should Remain in `App.jsx` After Refactor

`App.jsx` should only contain:

1. **Imports** — React hooks, all view components, lib/constants
2. **State declarations** — `activeTab`, `data`, `loading`, `error`, `calMonth`, `calViewMode`, `calFilterPerson`, `calFilterStatus`, `popupDay`, `popupDetail`, `selectedLead`, `userMap`
3. **`loadData` callback** — the full `useCallback` block with all three fetch steps and `setUserMap` / `setData`
4. **Derived variables** — all aggregations computed from `leads` and `engagements`: `byRegion`, `byStage`, `byIndustry`, `byCustomerType`, `byProjectBg`, `personRegion`, `gbEntries`, `pbEntries`, etc.
5. **Sorted/filtered slices** — `hotSorted`, `upcomingVisits`, `overdueLeads`, `personKeys`, `allRegions`, etc.
6. **JSX** — only the outer shell:
   - The global `<style>` block
   - The sticky header with tab buttons and Refresh
   - The loading spinner
   - The error banner
   - One `{activeTab === "X" && <XTab ...props />}` line per tab
   - `<CalendarDayPopup ...props />` at the bottom

---

## Constraints

- Do **not** change any logic, styling, or behavior — this is a pure structural refactor
- All color maps, theme tokens, and helper functions used inside a view must be imported from the correct `constants/` or `lib/` file — do not re-declare them inside view files
- Keep the `SwimlaneView.jsx` import path unchanged: `"./SwimlaneView"`
- Use named exports everywhere; no default exports except for the component in each file
- Each view file should import only what it actually uses
- `getPersonName` inside view files should receive `userMap` as a parameter (or via props), since it no longer has closure access to `App`'s state

---

## Acceptance Criteria

- [ ] `App.jsx` is under 120 lines (excluding imports)
- [ ] No inline tab rendering logic remains in `App.jsx`
- [ ] Each view in `src/views/` is self-contained and importable independently
- [ ] All shared utilities come from `src/lib/` — no duplication
- [ ] App runs and all five tabs render identically to before the refactor
- [ ] `CalendarDayPopup` opens and shows detail view correctly
- [ ] No console errors related to undefined props or missing imports

