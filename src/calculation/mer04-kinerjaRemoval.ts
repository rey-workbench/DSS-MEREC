/**
 * MER-04: Menentukan Kinerja dengan Menghilangkan efek Kriteria (S')
 *
 * Hitung kinerja alternatif dengan menghapus setiap kriteria. Pada langkah ini,
 * digunakan ukuran logaritmik dengan cara yang sama seperti langkah sebelumnya.
 *
 * Perbedaan antara langkah ini dengan Langkah 3 adalah bahwa kinerja alternatif
 * dihitung berdasarkan penghapusan setiap kriteria secara terpisah.
 *
 * Dinyatakan dengan S'_ij, yaitu kinerja keseluruhan alternatif ke-i terkait
 * dengan penghapusan kriteria ke-j.
 *
 * Persamaan yang digunakan:
 * S'_ij = ln(1 + (1/m * Σ_k,k≠j |ln(nx_ik)|))
 */

/**
 * Menghitung kinerja alternatif dengan menghilangkan efek setiap kriteria
 * @param normalizedMatrix - Matriks yang sudah dinormalisasi N (m x n)
 * @param epsilon - Nilai kecil untuk menghindari ln(0)
 * @returns Matriks S'_ij (m x n) dimana S'_ij adalah kinerja alternatif i tanpa kriteria j
 */
export function calculateRemovalPerformance(
  normalizedMatrix: number[][],
  epsilon: number = 1e-10
): number[][] {
  const m = normalizedMatrix.length; // jumlah alternatif
  const n = normalizedMatrix[0]?.length || 0; // jumlah kriteria

  if (m === 0 || n === 0) {
    throw new Error("Matriks normalisasi tidak boleh kosong");
  }

  const removalPerformances: number[][] = [];

  for (let i = 0; i < m; i++) {
    const removalRow: number[] = [];

    for (let j = 0; j < n; j++) {
      // Hitung kinerja alternatif i dengan menghilangkan kriteria j
      // Σ_k,k≠j |ln(nx_ik)|
      let sumAbsLnWithoutJ = 0;
      let countWithoutJ = 0;

      for (let k = 0; k < n; k++) {
        if (k !== j) {
          // Skip kriteria j yang dihilangkan
          const nx_ik = normalizedMatrix[i][k];

          // Pastikan nilai tidak nol atau negatif sebelum ln
          const safeValue = Math.max(nx_ik, epsilon);
          const lnValue = Math.log(safeValue);
          const absLnValue = Math.abs(lnValue);

          // Validasi hasil perhitungan
          if (!isFinite(absLnValue)) {
            console.warn(
              `Nilai ln tidak terbatas pada removal alternatif ${i}, ` +
                `kriteria ${k} (menghilangkan ${j}). nx_ik = ${nx_ik}, menggunakan epsilon.`
            );
            sumAbsLnWithoutJ += Math.abs(Math.log(epsilon));
          } else {
            sumAbsLnWithoutJ += absLnValue;
          }

          countWithoutJ++;
        }
      }

      // Jika semua kriteria dihilangkan (n=1), gunakan nilai default
      if (countWithoutJ === 0) {
        console.warn(
          `Hanya ada 1 kriteria, tidak bisa menghilangkan kriteria ${j}. ` +
            `Menggunakan nilai default untuk S'_${i}${j}.`
        );
        removalRow.push(0);
        continue;
      }

      // Hitung rata-rata: (1/(n-1) * Σ_k,k≠j |ln(nx_ik)|)
      const avgAbsLnWithoutJ = sumAbsLnWithoutJ / countWithoutJ;

      // Hitung S'_ij = ln(1 + avgAbsLnWithoutJ)
      const S_prime_ij = Math.log(1 + avgAbsLnWithoutJ);

      // Validasi hasil akhir
      if (!isFinite(S_prime_ij)) {
        console.warn(
          `Kinerja removal tidak terbatas pada alternatif ${i}, kriteria ${j}. ` +
            `avgAbsLnWithoutJ = ${avgAbsLnWithoutJ}, menggunakan nilai default.`
        );
        removalRow.push(0);
      } else {
        removalRow.push(S_prime_ij);
      }
    }

    removalPerformances.push(removalRow);
  }

  return removalPerformances;
}

/**
 * Validasi hasil kinerja removal
 * @param removalPerformances - Matriks kinerja removal S'_ij
 */
export function validateRemovalPerformance(
  removalPerformances: number[][]
): void {
  const m = removalPerformances.length;

  if (m === 0) {
    throw new Error("Matriks kinerja removal tidak boleh kosong");
  }

  const n = removalPerformances[0]?.length || 0;

  for (let i = 0; i < m; i++) {
    if (removalPerformances[i].length !== n) {
      throw new Error(
        `Panjang baris ${i} tidak konsisten dalam matriks kinerja removal`
      );
    }

    for (let j = 0; j < n; j++) {
      const S_prime_ij = removalPerformances[i][j];

      if (!isFinite(S_prime_ij)) {
        throw new Error(
          `Kinerja removal tidak valid pada posisi [${i}][${j}]: ${S_prime_ij}`
        );
      }

      if (S_prime_ij < 0) {
        console.warn(
          `Kinerja removal negatif pada posisi [${i}][${j}]: ${S_prime_ij}. ` +
            `Ini mungkin menunjukkan masalah dalam normalisasi.`
        );
      }
    }
  }
}

/**
 * Menampilkan matriks kinerja removal
 * @param removalPerformances - Matriks kinerja removal S'_ij
 * @param alternatives - Array alternatif (untuk label baris)
 * @param criteria - Array kriteria (untuk label kolom)
 */
export function showRemovalPerformance(
  removalPerformances: number[][],
  alternatives: any[],
  criteria: any[]
): void {
  console.log("\n📊 Kinerja dengan Removal Kriteria (S'_ij):");
  console.log("=" + "=".repeat(60));

  // Header kriteria
  const header = [
    "Alt\\Kriteria",
    ...criteria.map((c: any, idx: number) => `S'_i${idx + 1}`),
  ];
  console.log(header.join("\t"));
  console.log("-".repeat(header.join("\t").length));

  // Baris data
  for (let i = 0; i < removalPerformances.length; i++) {
    const altName = alternatives[i]?.name || `Alt-${i + 1}`;
    const row = [
      altName.substring(0, 10),
      ...removalPerformances[i].map((val) => val.toFixed(4)),
    ];
    console.log(row.join("\t"));
  }

  console.log("=" + "=".repeat(60));
}

/**
 * Menghitung statistik kinerja removal untuk setiap kriteria
 * @param removalPerformances - Matriks kinerja removal S'_ij
 * @param criteria - Array kriteria
 * @returns Statistik untuk setiap kriteria
 */
export function getRemovalPerformanceStats(
  removalPerformances: number[][],
  criteria: any[]
): {
  criteriaStats: Array<{
    criteriaIndex: number;
    criteriaName: string;
    min: number;
    max: number;
    avg: number;
    std: number;
  }>;
} {
  const m = removalPerformances.length;
  const n = removalPerformances[0]?.length || 0;

  const criteriaStats = [];

  for (let j = 0; j < n; j++) {
    // Ambil semua nilai S'_ij untuk kriteria j
    const values = removalPerformances.map((row) => row[j]);

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

    // Hitung standar deviasi
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      values.length;
    const std = Math.sqrt(variance);

    criteriaStats.push({
      criteriaIndex: j,
      criteriaName: criteria[j]?.name || `Kriteria-${j + 1}`,
      min,
      max,
      avg,
      std,
    });
  }

  return { criteriaStats };
}

/**
 * Menampilkan statistik kinerja removal
 * @param stats - Statistik kinerja removal
 */
export function showRemovalPerformanceStats(
  stats: ReturnType<typeof getRemovalPerformanceStats>
): void {
  console.log("\n📊 Statistik Kinerja Removal per Kriteria:");
  console.log("=" + "=".repeat(80));

  console.log("Kriteria\t\tMin\t\tMax\t\tAvg\t\tStd Dev");
  console.log("-".repeat(80));

  stats.criteriaStats.forEach((stat) => {
    console.log(
      `${stat.criteriaName.substring(0, 15).padEnd(15)}\t` +
        `${stat.min.toFixed(4)}\t\t${stat.max.toFixed(4)}\t\t` +
        `${stat.avg.toFixed(4)}\t\t${stat.std.toFixed(4)}`
    );
  });

  console.log("=" + "=".repeat(80));
}
