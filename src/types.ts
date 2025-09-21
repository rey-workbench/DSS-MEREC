/**
 * Type definitions for the MEREC algorithm
 */

/**
 * Criteria type - benefit (higher is better) or cost (lower is better)
 */
export type CriteriaType = "benefit" | "cost";

/**
 * Alternative data structure (internal use)
 */
export interface Alternative {
  /** Unique identifier for the alternative */
  id: string;
  /** Human-readable name */
  name: string;
  /** Criteria values for this alternative */
  values: number[];
}

/**
 * Criteria definition (internal use)
 */
export interface Criteria {
  /** Unique identifier for the criteria */
  id: string;
  /** Human-readable name */
  name: string;
  /** Type of criteria (benefit or cost) */
  type: CriteriaType;
}
