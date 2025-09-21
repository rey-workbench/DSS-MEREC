/**
 * MER-05: Menghitung Jumlah Deviasi Absolut (E)
 *
 * Pada langkah ini, dihitung dampak penghapusan kriteria ke-j berdasarkan nilai
 * yang diperoleh dari Langkah 3 (kinerja keseluruhan S_i) dan Langkah 4
 * (kinerja removal S'_ij).
 *
 * Misalkan E_j menunjukkan dampak penghapusan kriteria ke-j.
 * Kita dapat menghitung nilai E_j menggunakan persamaan berikut:
 *
 * E_j = Σ_i |S'_ij - S_i|
 */

/**
 * Menghitung jumlah deviasi absolut untuk setiap kriteria
 * @param performances - Array kinerja keseluruhan S_i dari MER-03
 * @param removalPerformances - Matriks kinerja removal S'_ij dari MER-04
 * @returns Array E_j yang menunjukkan dampak penghapusan setiap kriteria
 */
export function calculateAbsoluteDeviations(
  performances: number[],
  removalPerformances: number[][]
): number[] {
  const m = performances.length; // jumlah alternatif
  const n = removalPerformances[0]?.length || 0; // jumlah kriteria

  // Validasi input
  if (m === 0) {
    throw new Error("Array kinerja keseluruhan tidak boleh kosong");
  }

  if (removalPerformances.length !== m) {
    throw new Error(
      `Jumlah baris matriks removal (${removalPerformances.length}) ` +
        `tidak sesuai dengan jumlah alternatif (${m})`
    );
  }

  if (n === 0) {
    throw new Error("Matriks kinerja removal tidak boleh kosong");
  }

  const deviations: number[] = [];

  // Hitung E_j untuk setiap kriteria j
  for (let j = 0; j < n; j++) {
    let E_j = 0;

    // Hitung Σ_i |S'_ij - S_i|
    for (let i = 0; i < m; i++) {
      const S_i = performances[i];
      const S_prime_ij = removalPerformances[i][j];

      // Validasi nilai sebelum perhitungan
      if (!isFinite(S_i)) {
        console.warn(
          `Kinerja keseluruhan tidak terbatas pada alternatif ${i}: ${S_i}. ` +
            `Menggunakan 0 untuk perhitungan deviasi.`
        );
      }

      if (!isFinite(S_prime_ij)) {
        console.warn(
          `Kinerja removal tidak terbatas pada posisi [${i}][${j}]: ${S_prime_ij}. ` +
            `Menggunakan 0 untuk perhitungan deviasi.`
        );
      }

      // Hitung |S'_ij - S_i|
      const safeS_i = isFinite(S_i) ? S_i : 0;
      const safeS_prime_ij = isFinite(S_prime_ij) ? S_prime_ij : 0;
      const absoluteDeviation = Math.abs(safeS_prime_ij - safeS_i);

      E_j += absoluteDeviation;
    }

    // Validasi hasil E_j
    if (!isFinite(E_j)) {
      console.warn(
        `Deviasi absolut tidak terbatas untuk kriteria ${j}: ${E_j}. ` +
          `Menggunakan 0.`
      );
      E_j = 0;
    }

    deviations.push(E_j);
  }

  return deviations;
}

/**
 * Validasi hasil deviasi absolut
 * @param deviations - Array deviasi absolut E_j
 */
export function validateAbsoluteDeviations(deviations: number[]): void {
  if (deviations.length === 0) {
    throw new Error("Array deviasi absolut tidak boleh kosong");
  }

  for (let j = 0; j < deviations.length; j++) {
    const E_j = deviations[j];

    if (!isFinite(E_j)) {
      throw new Error(`Deviasi absolut tidak valid pada kriteria ${j}: ${E_j}`);
    }

    if (E_j < 0) {
      throw new Error(
        `Deviasi absolut tidak boleh negatif pada kriteria ${j}: ${E_j}`
      );
    }
  }
}

/**
 * Menampilkan hasil deviasi absolut
 * @param deviations - Array deviasi absolut E_j
 * @param criteria - Array kriteria (untuk label)
 */
export function showAbsoluteDeviations(
  deviations: number[],
  criteria: any[]
): void {
  console.log("\n📊 Deviasi Absolut Setiap Kriteria (E_j):");
  console.log("=" + "=".repeat(50));

  console.log("Kriteria\t\t\tE_j");
  console.log("-".repeat(40));

  for (let j = 0; j < deviations.length; j++) {
    const criteriaName = criteria[j]?.name || `Kriteria-${j + 1}`;
    const E_j = deviations[j];

    console.log(
      `${criteriaName.substring(0, 20).padEnd(20)}\t${E_j.toFixed(6)}`
    );
  }

  console.log("=" + "=".repeat(50));

  // Statistik tambahan
  const totalE = deviations.reduce((sum, e) => sum + e, 0);
  const minE = Math.min(...deviations);
  const maxE = Math.max(...deviations);
  const avgE = totalE / deviations.length;

  console.log("\nStatistik Deviasi:");
  console.log(`Total E: ${totalE.toFixed(6)}`);
  console.log(`Min E_j: ${minE.toFixed(6)}`);
  console.log(`Max E_j: ${maxE.toFixed(6)}`);
  console.log(`Avg E_j: ${avgE.toFixed(6)}`);
}

/**
 * Menganalisis dampak setiap kriteria berdasarkan deviasi absolut
 * @param deviations - Array deviasi absolut E_j
 * @param criteria - Array kriteria
 * @returns Analisis dampak kriteria
 */
export function analyzeCriteriaImpact(
  deviations: number[],
  criteria: any[]
): {
  rankedCriteria: Array<{
    index: number;
    name: string;
    deviation: number;
    impact: "Tinggi" | "Sedang" | "Rendah";
    percentage: number;
  }>;
  totalDeviation: number;
} {
  const totalDeviation = deviations.reduce((sum, e) => sum + e, 0);

  // Buat ranking berdasarkan E_j (semakin besar E_j, semakin penting kriteria)
  const rankedCriteria = deviations
    .map((deviation, index) => ({
      index,
      name: criteria[index]?.name || `Kriteria-${index + 1}`,
      deviation,
      percentage: totalDeviation > 0 ? (deviation / totalDeviation) * 100 : 0,
    }))
    .sort((a, b) => b.deviation - a.deviation) // Sort descending
    .map((item) => {
      let impact: "Tinggi" | "Sedang" | "Rendah";

      if (item.percentage >= 40) {
        impact = "Tinggi";
      } else if (item.percentage >= 20) {
        impact = "Sedang";
      } else {
        impact = "Rendah";
      }

      return { ...item, impact };
    });

  return {
    rankedCriteria,
    totalDeviation,
  };
}

/**
 * Menampilkan analisis dampak kriteria
 * @param analysis - Hasil analisis dampak kriteria
 */
export function showCriteriaImpactAnalysis(
  analysis: ReturnType<typeof analyzeCriteriaImpact>
): void {
  console.log("\n📊 Analisis Dampak Kriteria (berdasarkan E_j):");
  console.log("=" + "=".repeat(70));

  console.log("Ranking\tKriteria\t\t\tE_j\t\tPersentase\tDampak");
  console.log("-".repeat(70));

  analysis.rankedCriteria.forEach((item, ranking) => {
    console.log(
      `${(ranking + 1).toString().padStart(2)}\t` +
        `${item.name.substring(0, 20).padEnd(20)}\t` +
        `${item.deviation.toFixed(4)}\t\t` +
        `${item.percentage.toFixed(2)}%\t\t` +
        `${item.impact}`
    );
  });

  console.log("-".repeat(70));
  console.log(`Total Deviasi: ${analysis.totalDeviation.toFixed(6)}`);
  console.log("=" + "=".repeat(70));

  // Interpretasi
  console.log("\n💡 Interpretasi:");
  console.log(
    "- Kriteria dengan E_j tinggi memiliki dampak besar saat dihilangkan"
  );
  console.log("- Kriteria dengan dampak 'Tinggi' adalah yang paling penting");
  console.log("- Kriteria dengan dampak 'Rendah' relatif kurang berpengaruh");
}
