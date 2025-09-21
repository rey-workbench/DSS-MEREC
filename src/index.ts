/**
 * DSS MEREC - Decision Support System using MEREC algorithm
 *
 * MEREC (Method based on the Removal Effects of Criteria) is a multi-criteria
 * decision-making method that determines criteria weights based on the removal
 * effects of each criterion on the overall performance of alternatives.
 */

// Export main MEREC class
export { Merec } from "./merec";

// Export basic types (hanya yang essential)
export type { Alternative, Criteria, CriteriaType } from "./types";

// Default export
export { Merec as default } from "./merec";
