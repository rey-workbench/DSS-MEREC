/**
 * MER-03: Menentukan Kinerja setiap Alternatif (S)
 *
 * Hitung kinerja keseluruhan alternatif (S_i). Pengukuran logaritmik dengan bobot kriteria
 * yang sama diterapkan untuk memperoleh kinerja keseluruhan alternatif pada langkah ini.
 *
 * Berdasarkan nilai normalisasi yang diperoleh dari langkah sebelumnya, kita dapat memastikan
 * bahwa nilai nx_ij yang lebih kecil menghasilkan nilai kinerja (S_i) yang lebih besar.
 *
 * Persamaan yang digunakan:
 * S_i = ln(1 + (1/m * Σ_j |ln(nx_ij)|))
 */

/**
 * Menghitung kinerja keseluruhan setiap alternatif menggunakan rumus MER-03
 * @param normalizedMatrix - Matriks yang sudah dinormalisasi N (m x n)
 * @param epsilon - Nilai kecil untuk menghindari ln(0)
 * @returns Array kinerja keseluruhan S_i untuk setiap alternatif
 */
export function calculateOverallPerformance(
  normalizedMatrix: number[][],
  epsilon: number = 1e-10
): number[] {
  const m = normalizedMatrix.length; // jumlah alternatif
  const n = normalizedMatrix[0]?.length || 0; // jumlah kriteria

  if (m === 0 || n === 0) {
    throw new Error("Matriks normalisasi tidak boleh kosong");
  }

  const performances: number[] = [];

  for (let i = 0; i < m; i++) {
    // Hitung 1/m * Σ_j |ln(nx_ij)|
    let sumAbsLn = 0;

    for (let j = 0; j < n; j++) {
      const nx_ij = normalizedMatrix[i][j];

      // Pastikan nilai tidak nol atau negatif sebelum ln
      const safeValue = Math.max(nx_ij, epsilon);
      const lnValue = Math.log(safeValue);
      const absLnValue = Math.abs(lnValue);

      // Validasi hasil perhitungan
      if (!isFinite(absLnValue)) {
        console.warn(
          `Nilai ln tidak terbatas pada alternatif ${i}, kriteria ${j}. ` +
            `nx_ij = ${nx_ij}, menggunakan epsilon.`
        );
        sumAbsLn += Math.abs(Math.log(epsilon));
      } else {
        sumAbsLn += absLnValue;
      }
    }

    // Hitung rata-rata: (1/m * Σ_j |ln(nx_ij)|)
    const avgAbsLn = sumAbsLn / n; // Note: menggunakan n (jumlah kriteria), bukan m

    // Hitung S_i = ln(1 + avgAbsLn)
    const S_i = Math.log(1 + avgAbsLn);

    // Validasi hasil akhir
    if (!isFinite(S_i)) {
      console.warn(
        `Kinerja tidak terbatas pada alternatif ${i}. ` +
          `avgAbsLn = ${avgAbsLn}, menggunakan nilai default.`
      );
      performances.push(0);
    } else {
      performances.push(S_i);
    }
  }

  return performances;
}

/**
 * Validasi hasil kinerja keseluruhan
 * @param performances - Array kinerja keseluruhan
 */
export function validateOverallPerformance(performances: number[]): void {
  if (performances.length === 0) {
    throw new Error("Array kinerja keseluruhan tidak boleh kosong");
  }

  for (let i = 0; i < performances.length; i++) {
    const S_i = performances[i];

    if (!isFinite(S_i)) {
      throw new Error(
        `Kinerja keseluruhan tidak valid pada alternatif ${i}: ${S_i}`
      );
    }

    if (S_i < 0) {
      console.warn(
        `Kinerja keseluruhan negatif pada alternatif ${i}: ${S_i}. ` +
          `Ini mungkin menunjukkan masalah dalam normalisasi.`
      );
    }
  }
}

/**
 * Menampilkan hasil kinerja keseluruhan
 * @param performances - Array kinerja keseluruhan
 * @param alternatives - Array alternatif (untuk label)
 */
export function showOverallPerformance(
  performances: number[],
  alternatives: any[]
): void {
  console.log("\n📊 Kinerja Keseluruhan Alternatif (S_i):");
  console.log("=" + "=".repeat(50));

  console.log("Alternatif\t\tS_i");
  console.log("-".repeat(40));

  for (let i = 0; i < performances.length; i++) {
    const altName = alternatives[i]?.name || `Alt-${i + 1}`;
    const S_i = performances[i];

    console.log(`${altName.substring(0, 15).padEnd(15)}\t${S_i.toFixed(6)}`);
  }

  console.log("=" + "=".repeat(50));

  // Statistik tambahan
  const minS = Math.min(...performances);
  const maxS = Math.max(...performances);
  const avgS =
    performances.reduce((sum, s) => sum + s, 0) / performances.length;

  console.log("\nStatistik:");
  console.log(`Min S_i: ${minS.toFixed(6)}`);
  console.log(`Max S_i: ${maxS.toFixed(6)}`);
  console.log(`Avg S_i: ${avgS.toFixed(6)}`);
}

/**
 * Menghitung komponen detail dari kinerja keseluruhan (untuk debugging)
 * @param normalizedMatrix - Matriks yang sudah dinormalisasi
 * @param epsilon - Nilai kecil untuk menghindari ln(0)
 * @returns Object dengan detail perhitungan
 */
export function getOverallPerformanceDetails(
  normalizedMatrix: number[][],
  epsilon: number = 1e-10
): {
  lnValues: number[][];
  absLnValues: number[][];
  sumAbsLn: number[];
  avgAbsLn: number[];
  performances: number[];
} {
  const m = normalizedMatrix.length;
  const n = normalizedMatrix[0]?.length || 0;

  const lnValues: number[][] = [];
  const absLnValues: number[][] = [];
  const sumAbsLn: number[] = [];
  const avgAbsLn: number[] = [];
  const performances: number[] = [];

  for (let i = 0; i < m; i++) {
    const lnRow: number[] = [];
    const absLnRow: number[] = [];
    let sum = 0;

    for (let j = 0; j < n; j++) {
      const nx_ij = normalizedMatrix[i][j];
      const safeValue = Math.max(nx_ij, epsilon);
      const lnVal = Math.log(safeValue);
      const absLnVal = Math.abs(lnVal);

      lnRow.push(lnVal);
      absLnRow.push(absLnVal);
      sum += absLnVal;
    }

    lnValues.push(lnRow);
    absLnValues.push(absLnRow);
    sumAbsLn.push(sum);

    const avg = sum / n;
    avgAbsLn.push(avg);

    const S_i = Math.log(1 + avg);
    performances.push(S_i);
  }

  return {
    lnValues,
    absLnValues,
    sumAbsLn,
    avgAbsLn,
    performances,
  };
}
