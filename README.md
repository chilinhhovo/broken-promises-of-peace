# Broken Promises of Peace
[[Website](https://chilinhhovo.github.io/project_6/)]

To examine how often peace agreements actually lead to the end of war, I analyzed two datasets from the Uppsala Conflict Data Program (UCDP):

Peace Agreements Dataset (v22.1): Records of signed treaties, including dates, conflict names, and involved parties here [[here](https://uu.diva-portal.org/smash/record.jsf?pid=diva2%3A1343886&dswid=519 )] 
• Pettersson, Therese, Stina Högbladh & Magnus Öberg (2019). Organized violence, 1989-2018 and peace agreements. Journal of Peace Research 56(4): 589-603.

Conflict Termination Dataset (v3-2021): Timelines for when each conflict began and ended, and the nature of the resolution. 
• Kreutz, Joakim (2010) How and When Armed Conflicts End: Introducing the UCDP Conflict Termination Dataset. Journal of Peace Research 47(2).

# 1. Data Cleaning & Parsing
I loaded the raw .xlsx files and:
Standardized key date fields (start_date, end_date, peace_date) to datetime format.
Filtered out rows with missing or malformed IDs or dates.
Extracted a summary file for each dataset to assist with manual review and verification.

# 2. Matching Treaties to Wars
I joined the two datasets on a shared conflict identifier (conflict_id), then filtered to retain only those cases where:
A peace agreement occurred within the duration of the recorded war episode.
This ensured the treaty was signed during an active conflict, not before or long after.

# 3. Analyzing Post-Treaty Duration
For each match, we computed:
The number of days from the treaty to the official conflict end (duration_after_peace).
Whether that span was longer than 2 years (730 days), a heuristic indicating potential conflict resumption or failure.

# 4. Export
Final dataset saved to matched_peace_conflict_episodes.csv, including:
War name, sides, location, start/end/peace dates, conflict intensity.
Whether conflict resumed or remained unresolved after peace.

# 5. Visualization Logic
Timeline Structure: Each conflict is visualized as a sequence:
  Blue markers represent the war period before a peace treaty.
  Orange icon marks the treaty signing.
  End icon turns green if the war ended peacefully, or red if conflict continued.
Duration Encoding:
  Spacing and marker count proportional to time elapsed.
  Circle size reflects "bloodiness" (conflict intensity).
Interactivity:
  Sidebar categorizes wars by continent.
  Clicking on a war updates the main timeline and statistics

# 6. Tools & Stack
Frontend: Built in React with JSX compiled via Babel.
Styling: Tailwind CSS for layout and typography.
CSV Handling: PapaParse for in-browser data parsing.
Hosting: Static GitHub Pages site with embedded script.


The visual reveals how often wars do not truly end with a peace treaty. In many cases, more violence follows the treaty than preceded it. This suggests that "peace treaty" is often temporary, unstable, or symbolic. This tool helps spotlight those fragile post-conflict periods.


