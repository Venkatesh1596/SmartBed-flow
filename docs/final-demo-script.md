# 5-Minute Final Demonstration Script

## Goal
Demonstrate operational continuity from Discharge to Bed Availability.

## Sequence
1. **Login as Facility Manager:** Open Command Center.
2. **Context:** Show the Ward and identify a patient ready for discharge.
3. **Action (Discharge):** Click "Discharge". 
   - *Value:* Patient leaves, Bed status automatically transitions to `CLEANING`.
4. **Action (EVS):** Switch to EVS Board. Claim and Complete the generated EVS Task.
   - *Value:* Bed transitions to `AVAILABLE`.
5. **Action (Allocation):** Open Allocation UI. Allocate a waiting patient to the now available bed.
   - *Value:* Bed transitions to `OCCUPIED`.
6. **Show Analytics/Audit:** Briefly open the Audit Log to show that every action was securely recorded.
