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

# 4. Output
I exported the matched results to matched_peace_conflict_episodes.csv, which powers the visualizations site. This includes war names, treaty dates, end dates, and whether peace was followed by prolonged or resumed conflict.

