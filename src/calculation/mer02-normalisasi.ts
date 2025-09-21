/**
 * MER-02: Normalisasi Matriks Keputusan (N)
 *
 * Pada langkah ini, normalisasi linier sederhana digunakan untuk menskalakan elemen matriks keputusan.
 * Elemen-elemen matriks yang dinormalisasi dilambangkan dengan nx_ij.
 *
 * Jika B menunjukkan himpunan kriteria menguntungkan (benefit), dan H mewakili himpunan kriteria
 * tidak menguntungkan (cost), kita dapat menggunakan persamaan berikut untuk normalisasi:
 *
 * nx_ij = {
 *   min_k(x_kj) / x_ij   if j ∈ B (benefit)
 *   x_ij / max_k(x_kj)   if j ∈ H (cost)
 * }
 */

import { Criteria } from "../types";

/**
 * Melakukan normalisasi matriks keputusan sesuai rumus MER-02
 * @param matrix - Matriks keputusan X (m x n)
 * @param criteria - Array kriteria dengan tipe benefit/cost
 * @param epsilon - Nilai kecil untuk menghindari pembagian dengan nol
 * @returns Matriks yang dinormalisasi N (m x n)
 */
export function calculateNormalizedMatrix(
  matrix: number[][],
  criteria: Criteria[],
  epsilon: number = 1e-10
): number[][] {
  const m = matrix.length; // jumlah alternatif
  const n = matrix[0].length; // jumlah kriteria

  if (n !== criteria.length) {
    throw new Error(
      `Jumlah kolom matriks (${n}) tidak sesuai dengan jumlah kriteria (${criteria.length})`
    );
  }

  // Hasil matriks normalisasi
  const normalizedMatrix: number[][] = [];

  for (let i = 0; i < m; i++) {
    const normalizedRow: number[] = [];

    for (let j = 0; j < n; j++) {
      const criteriaType = criteria[j].type;
      const currentValue = matrix[i][j];

      // Ambil semua nilai pada kolom j
      const columnValues = matrix.map((row) => row[j]);

      let normalizedValue: number;

      if (criteriaType === "benefit") {
        // Untuk kriteria benefit: nx_ij = min_k(x_kj) / x_ij
        const minValue = Math.min(...columnValues);

        if (minValue <= 0) {
          console.warn(
            `Kriteria benefit '${criteria[j].name}' memiliki nilai minimum <= 0, menggunakan epsilon`
          );
          normalizedValue = epsilon;
        } else {
          normalizedValue = minValue / Math.max(currentValue, epsilon);
        }
      } else {
        // Untuk kriteria cost: nx_ij = x_ij / max_k(x_kj)
        const maxValue = Math.max(...columnValues);

        if (maxValue === 0) {
          console.warn(
            `Kriteria cost '${criteria[j].name}' memiliki nilai maksimum 0, menggunakan epsilon`
          );
          normalizedValue = epsilon;
        } else {
          normalizedValue = Math.max(currentValue, epsilon) / maxValue;
        }
      }

      normalizedRow.push(normalizedValue);
    }

    normalizedMatrix.push(normalizedRow);
  }

  return normalizedMatrix;
}

/**
 * Validasi hasil normalisasi
 * @param normalizedMatrix - Matriks yang sudah dinormalisasi
 */
export function validateNormalizedMatrix(normalizedMatrix: number[][]): void {
  const m = normalizedMatrix.length;
  const n = normalizedMatrix[0]?.length || 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const value = normalizedMatrix[i][j];

      if (!isFinite(value) || value <= 0) {
        throw new Error(
          `Nilai normalisasi tidak valid pada posisi [${i}][${j}]: ${value}`
        );
      }
    }
  }
}

/**
 * Menampilkan statistik normalisasi untuk setiap kriteria
 * @param originalMatrix - Matriks asli
 * @param normalizedMatrix - Matriks yang sudah dinormalisasi
 * @param criteria - Array kriteria
 */
export function showNormalizationStats(
  originalMatrix: number[][],
  normalizedMatrix: number[][],
  criteria: Criteria[]
): void {
  console.log("\n📊 Statistik Normalisasi:");
  console.log("=" + "=".repeat(60));

  const n = criteria.length;

  for (let j = 0; j < n; j++) {
    const criteriaName = criteria[j].name;
    const criteriaType = criteria[j].type;

    // Nilai asli
    const originalValues = originalMatrix.map((row) => row[j]);
    const originalMin = Math.min(...originalValues);
    const originalMax = Math.max(...originalValues);

    // Nilai normalized
    const normalizedValues = normalizedMatrix.map((row) => row[j]);
    const normalizedMin = Math.min(...normalizedValues);
    const normalizedMax = Math.max(...normalizedValues);

    console.log(`\n${criteriaName} (${criteriaType}):`);
    console.log(
      `  Asli     - Min: ${originalMin.toFixed(4)}, Max: ${originalMax.toFixed(
        4
      )}`
    );
    console.log(
      `  Normal   - Min: ${normalizedMin.toFixed(
        4
      )}, Max: ${normalizedMax.toFixed(4)}`
    );
  }

  console.log("=" + "=".repeat(60));
}

/**
 * Menampilkan matriks normalisasi dalam format yang mudah dibaca
 * @param normalizedMatrix - Matriks yang sudah dinormalisasi
 * @param alternatives - Array alternatif (untuk label baris)
 * @param criteria - Array kriteria (untuk label kolom)
 */
export function showNormalizedMatrix(
  normalizedMatrix: number[][],
  alternatives: any[],
  criteria: Criteria[]
): void {
  console.log("\n📊 Matriks Normalisasi (N):");
  console.log("=" + "=".repeat(50));

  // Header kriteria
  const header = ["Alternatif", ...criteria.map((c) => `${c.name}(${c.type})`)];
  console.log(header.join("\t"));
  console.log("-".repeat(header.join("\t").length));

  // Baris data
  for (let i = 0; i < normalizedMatrix.length; i++) {
    const row = [
      alternatives[i].name.substring(0, 10), // Limit nama alternatif
      ...normalizedMatrix[i].map((val) => val.toFixed(4)),
    ];
    console.log(row.join("\t"));
  }

  console.log("=" + "=".repeat(50));
}
