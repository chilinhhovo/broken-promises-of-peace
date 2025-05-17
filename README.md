# Methodology: How We Matched Peace Treaties to Conflict Outcomes
To examine how often peace agreements actually lead to the end of war, I analyzed two datasets from the Uppsala Conflict Data Program (UCDP):

Peace Agreements Dataset (v22.1): Records of signed treaties, including dates, conflict names, and involved parties. https://uu.diva-portal.org/smash/record.jsf?pid=diva2%3A1343886&dswid=519 [here] 

Conflict Termination Dataset (v3-2021): Timelines for when each conflict began and ended, and the nature of the resolution.

1. Data Cleaning & Parsing
We loaded the raw .xlsx files and:

Standardized key date fields (start_date, end_date, peace_date) to datetime format.

Filtered out rows with missing or malformed IDs or dates.

Extracted a summary file for each dataset to assist with manual review and verification.

2. Matching Treaties to Wars
We joined the two datasets on a shared conflict identifier (conflict_id), then filtered to retain only those cases where:

A peace agreement occurred within the duration of the recorded war episode.

This ensured the treaty was signed during an active conflict, not before or long after.

3. Analyzing Post-Treaty Duration
For each match, we computed:

The number of days from the treaty to the official conflict end (duration_after_peace).

Whether that span was longer than 2 years (730 days), a heuristic indicating potential conflict resumption or failure.

4. Output
We exported the matched results to matched_peace_conflict_episodes.csv, which powers the visualizations on our site. This includes war names, treaty dates, end dates, and whether peace was followed by prolonged or resumed conflict.

