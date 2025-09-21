/**
 * DSS MEREC - Decision Support System using MEREC algorithm
 *
 * MEREC (Method based on the Removal Effects of Criteria) is a multi-criteria
 * decision-making method that determines criteria weights based on the removal
 * effects of each criterion on the overall performance of alternatives.
 */

// Export main calculation function
export { calculateMerecWeights } from "./merec";

// Export basic types
export type { CriteriaType } from "./types";

// Default export
export { calculateMerecWeights as default } from "./merec";
