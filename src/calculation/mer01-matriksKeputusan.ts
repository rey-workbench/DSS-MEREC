/**
 * MER-01: Membuat Matriks Keputusan (X)
 *
 * Matriks keputusan (X) dibangun pada langkah ini, yang menunjukkan peringkat atau nilai
 * setiap alternatif mengenai setiap kriteria. Elemen matriks ini dilambangkan dengan x_ij,
 * dan elemen matriks tersebut harus lebih besar dari nol (x_ij > 0).
 *
 * Jika kita memiliki nilai negatif dalam matriks keputusan, maka nilai tersebut harus
 * diubah menjadi nilai positif dengan menggunakan teknik yang tepat.
 */

import { Alternative, Criteria } from "../types";

/**
 * Membuat matriks keputusan dari alternatif yang diberikan
 * @param alternatives - Array alternatif
 * @param criteria - Array kriteria
 * @returns Matriks keputusan X (m x n)
 */
export function calculateDecisionMatrix(
  alternatives: Alternative[],
  criteria: Criteria[]
): number[][] {
  const m = alternatives.length; // jumlah alternatif
  const n = criteria.length; // jumlah kriteria

  // Validasi input
  if (m === 0) {
    throw new Error("Minimal satu alternatif harus disediakan");
  }

  if (n === 0) {
    throw new Error("Minimal satu kriteria harus disediakan");
  }

  // Bangun matriks keputusan
  const matrix: number[][] = [];

  for (let i = 0; i < m; i++) {
    const alternative = alternatives[i];

    // Validasi jumlah nilai sesuai dengan jumlah kriteria
    if (alternative.values.length !== n) {
      throw new Error(
        `Alternative '${alternative.name}' must have exactly ${n} values`
      );
    }

    // Validasi semua nilai harus positif (x_ij > 0)
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      let value = alternative.values[j];

      // Jika nilai negatif atau nol, konversi ke positif
      if (value <= 0) {
        console.warn(
          `Nilai negatif atau nol ditemukan pada alternatif '${alternative.name}' ` +
            `kriteria '${criteria[j].name}'. Menggunakan nilai absolut + 1.`
        );
        value = Math.abs(value) + 1; // Teknik sederhana: |x| + 1
      }

      row.push(value);
    }

    matrix.push(row);
  }

  return matrix;
}

/**
 * Validasi matriks keputusan
 * @param matrix - Matriks keputusan
 * @param criteria - Array kriteria
 */
export function validateDecisionMatrix(
  matrix: number[][],
  criteria: Criteria[]
): void {
  const m = matrix.length;
  const n = matrix[0]?.length || 0;

  if (m === 0 || n === 0) {
    throw new Error("Matriks keputusan tidak boleh kosong");
  }

  if (n !== criteria.length) {
    throw new Error(
      `Jumlah kolom matriks (${n}) tidak sesuai dengan jumlah kriteria (${criteria.length})`
    );
  }

  // Pastikan semua nilai positif
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] <= 0) {
        throw new Error(
          `Nilai matriks pada posisi [${i}][${j}] harus lebih besar dari 0`
        );
      }
    }
  }
}

/**
 * Menampilkan matriks keputusan dalam format yang mudah dibaca
 * @param matrix - Matriks keputusan
 * @param alternatives - Array alternatif
 * @param criteria - Array kriteria
 */
export function showDecisionMatrix(
  matrix: number[][],
  alternatives: Alternative[],
  criteria: Criteria[]
): void {
  console.log("\n📊 Matriks Keputusan (X):");
  console.log("=" + "=".repeat(50));

  // Header kriteria
  const header = ["Alternatif", ...criteria.map((c) => c.name)];
  console.log(header.join("\t"));
  console.log("-".repeat(header.join("\t").length));

  // Baris data
  for (let i = 0; i < matrix.length; i++) {
    const row = [
      alternatives[i].name.substring(0, 10), // Limit nama alternatif
      ...matrix[i].map((val) => val.toFixed(2)),
    ];
    console.log(row.join("\t"));
  }

  console.log("=" + "=".repeat(50));
}
