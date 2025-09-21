/**
 * Type definitions for the MEREC algorithm
 */
/**
 * Criteria type - benefit (higher is better) or cost (lower is better)
 */
type CriteriaType = "benefit" | "cost";

/**
 * MEREC (Method based on the Removal Effects of Criteria) implementation
 * Pure function approach for calculating criteria weights
 */

/**
 * Calculate criteria weights using MEREC algorithm
 * @param matrix - Decision matrix where rows = alternatives, columns = criteria
 * @param criteriaTypes - Array of criteria types ("benefit" or "cost")
 * @returns Array of criteria weights [0-1] that sum to 1.0
 */
declare function calculateMerecWeights(matrix: number[][], criteriaTypes: CriteriaType[]): number[];

export { calculateMerecWeights, calculateMerecWeights as default };
export type { CriteriaType };
