/**
 * MEREC (Method based on the Removal Effects of Criteria) implementation
 * Pure function approach for calculating criteria weights
 */

import { CriteriaType } from "./types";

// Import calculation functions
import {
  calculateDecisionMatrix,
  validateDecisionMatrix,
} from "./calculation/mer01-matriksKeputusan";
import {
  calculateNormalizedMatrix,
  validateNormalizedMatrix,
} from "./calculation/mer02-normalisasi";
import {
  calculateOverallPerformance,
  validateOverallPerformance,
} from "./calculation/mer03-kinerjaKeseluruhan";
import {
  calculateRemovalPerformance,
  validateRemovalPerformance,
} from "./calculation/mer04-kinerjaRemoval";
import {
  calculateAbsoluteDeviations,
  validateAbsoluteDeviations,
} from "./calculation/mer05-deviasiAbsolut";
import {
  calculateFinalWeights,
  validateFinalWeights,
} from "./calculation/mer06-bobotAkhir";

/**
 * Calculate criteria weights using MEREC algorithm
 * @param matrix - Decision matrix where rows = alternatives, columns = criteria
 * @param criteriaTypes - Array of criteria types ("benefit" or "cost")
 * @returns Array of criteria weights [0-1] that sum to 1.0
 */
export function calculateMerecWeights(
  matrix: number[][],
  criteriaTypes: CriteriaType[]
): number[] {
  // Validasi input
  if (!matrix || matrix.length === 0) {
    throw new Error("Matrix tidak boleh kosong");
  }

  if (!criteriaTypes || criteriaTypes.length === 0) {
    throw new Error("Tipe kriteria tidak boleh kosong");
  }

  const m = matrix.length; // jumlah alternatif
  const n = matrix[0]?.length || 0; // jumlah kriteria

  if (n !== criteriaTypes.length) {
    throw new Error(
      `Jumlah kolom matrix (${n}) harus sama dengan jumlah tipe kriteria (${criteriaTypes.length})`
    );
  }

  // Validasi setiap baris memiliki jumlah kolom yang sama
  for (let i = 0; i < m; i++) {
    if (!matrix[i] || matrix[i].length !== n) {
      throw new Error(`Baris ${i + 1} harus memiliki ${n} kolom`);
    }
  }

  // Buat alternatif dan kriteria dummy untuk internal processing
  const alternatives = matrix.map((row, i) => ({
    id: `A${i + 1}`,
    name: `Alternative ${i + 1}`,
    values: row,
  }));

  const criteria = criteriaTypes.map((type, j) => ({
    id: `C${j + 1}`,
    name: `Criteria ${j + 1}`,
    type,
  }));

  // Suppress console output
  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;
  console.log = () => {};
  console.warn = () => {};

  try {
    // MER-01: Create Decision Matrix
    const decisionMatrix = calculateDecisionMatrix(alternatives, criteria);
    validateDecisionMatrix(decisionMatrix, criteria);

    // MER-02: Normalize Decision Matrix
    const normalizedMatrix = calculateNormalizedMatrix(
      decisionMatrix,
      criteria,
      1e-10
    );
    validateNormalizedMatrix(normalizedMatrix);

    // MER-03: Calculate Overall Performance
    const overallPerformances = calculateOverallPerformance(
      normalizedMatrix,
      1e-10
    );
    validateOverallPerformance(overallPerformances);

    // MER-04: Calculate Removal Performance
    const removalPerformances = calculateRemovalPerformance(
      normalizedMatrix,
      1e-10
    );
    validateRemovalPerformance(removalPerformances);

    // MER-05: Calculate Absolute Deviations
    const absoluteDeviations = calculateAbsoluteDeviations(
      overallPerformances,
      removalPerformances
    );
    validateAbsoluteDeviations(absoluteDeviations);

    // MER-06: Calculate Final Weights
    const finalWeights = calculateFinalWeights(absoluteDeviations);
    validateFinalWeights(finalWeights);

    return finalWeights;
  } finally {
    // Restore console output
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
  }
}
