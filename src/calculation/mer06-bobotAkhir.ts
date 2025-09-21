/**
 * MER-06: Menentukan Bobot Akhir Kriteria (W)
 *
 * Pada langkah ini, bobot objektif setiap kriteria dihitung menggunakan efek penghapusan (E_j)
 * dari Langkah 5. Selanjutnya, w_j merupakan bobot kriteria ke-j.
 *
 * Persamaan yang digunakan untuk menghitung w_j:
 * w_j = E_j / Σ_k E_k
 *
 * Dimana:
 * - w_j adalah bobot kriteria ke-j
 * - E_j adalah deviasi absolut kriteria ke-j dari MER-05
 * - Σ_k E_k adalah total semua deviasi absolut
 */

/**
 * Menghitung bobot akhir kriteria berdasarkan deviasi absolut
 * @param deviations - Array deviasi absolut E_j dari MER-05
 * @returns Array bobot w_j untuk setiap kriteria
 */
export function calculateFinalWeights(deviations: number[]): number[] {
  const n = deviations.length; // jumlah kriteria

  // Validasi input
  if (n === 0) {
    throw new Error("Array deviasi absolut tidak boleh kosong");
  }

  // Hitung total deviasi: Σ_k E_k
  const totalDeviations = deviations.reduce((sum, e) => sum + e, 0);

  // Jika total deviasi adalah 0, berikan bobot yang sama untuk semua kriteria
  if (totalDeviations === 0 || !isFinite(totalDeviations)) {
    console.warn(
      "Total deviasi adalah 0 atau tidak terbatas, menggunakan bobot yang sama untuk semua kriteria"
    );
    const equalWeight = 1 / n;
    return new Array(n).fill(equalWeight);
  }

  const weights: number[] = [];

  // Hitung w_j = E_j / Σ_k E_k untuk setiap kriteria
  for (let j = 0; j < n; j++) {
    const E_j = deviations[j];

    // Validasi E_j
    if (!isFinite(E_j)) {
      console.warn(
        `Deviasi tidak terbatas pada kriteria ${j}: ${E_j}. ` +
          `Menggunakan 0 untuk perhitungan bobot.`
      );
      weights.push(0);
      continue;
    }

    if (E_j < 0) {
      console.warn(
        `Deviasi negatif pada kriteria ${j}: ${E_j}. ` +
          `Menggunakan nilai absolut.`
      );
    }

    // Hitung bobot
    const w_j = Math.abs(E_j) / totalDeviations;
    weights.push(w_j);
  }

  // Validasi total bobot = 1
  const totalWeights = weights.reduce((sum, w) => sum + w, 0);

  if (Math.abs(totalWeights - 1) > 1e-10) {
    console.warn(
      `Total bobot tidak sama dengan 1: ${totalWeights}. ` +
        `Melakukan normalisasi ulang.`
    );

    // Normalisasi ulang jika total tidak = 1
    if (totalWeights > 0) {
      for (let j = 0; j < n; j++) {
        weights[j] = weights[j] / totalWeights;
      }
    } else {
      // Fallback ke bobot yang sama
      const equalWeight = 1 / n;
      weights.fill(equalWeight);
    }
  }

  return weights;
}

/**
 * Validasi bobot akhir kriteria
 * @param weights - Array bobot w_j
 */
export function validateFinalWeights(weights: number[]): void {
  if (weights.length === 0) {
    throw new Error("Array bobot tidak boleh kosong");
  }

  let totalWeight = 0;

  for (let j = 0; j < weights.length; j++) {
    const w_j = weights[j];

    if (!isFinite(w_j)) {
      throw new Error(`Bobot tidak valid pada kriteria ${j}: ${w_j}`);
    }

    if (w_j < 0) {
      throw new Error(`Bobot tidak boleh negatif pada kriteria ${j}: ${w_j}`);
    }

    if (w_j > 1) {
      throw new Error(
        `Bobot tidak boleh lebih dari 1 pada kriteria ${j}: ${w_j}`
      );
    }

    totalWeight += w_j;
  }

  // Toleransi untuk floating point precision
  if (Math.abs(totalWeight - 1) > 1e-10) {
    throw new Error(
      `Total bobot harus sama dengan 1, tetapi mendapat: ${totalWeight}`
    );
  }
}

/**
 * Menampilkan bobot akhir kriteria
 * @param weights - Array bobot w_j
 * @param criteria - Array kriteria (untuk label)
 */
export function showFinalWeights(weights: number[], criteria: any[]): void {
  console.log("\n🎯 Bobot Akhir Kriteria (w_j):");
  console.log("=" + "=".repeat(60));

  console.log("Kriteria\t\t\tw_j\t\tPersentase\tKepentingan");
  console.log("-".repeat(60));

  // Buat array dengan ranking
  const weightedCriteria = weights
    .map((weight, index) => ({
      index,
      name: criteria[index]?.name || `Kriteria-${index + 1}`,
      weight,
      percentage: weight * 100,
    }))
    .sort((a, b) => b.weight - a.weight); // Sort descending

  weightedCriteria.forEach((item, ranking) => {
    let importance: string;

    if (item.percentage >= 30) {
      importance = "Sangat Tinggi";
    } else if (item.percentage >= 20) {
      importance = "Tinggi";
    } else if (item.percentage >= 15) {
      importance = "Sedang";
    } else if (item.percentage >= 10) {
      importance = "Rendah";
    } else {
      importance = "Sangat Rendah";
    }

    console.log(
      `${item.name.substring(0, 20).padEnd(20)}\t` +
        `${item.weight.toFixed(6)}\t` +
        `${item.percentage.toFixed(2)}%\t\t` +
        `${importance}`
    );
  });

  console.log("-".repeat(60));
  console.log(`Total: ${weights.reduce((sum, w) => sum + w, 0).toFixed(6)}`);
  console.log("=" + "=".repeat(60));
}

/**
 * Mengkategorikan tingkat kepentingan berdasarkan bobot
 * @param weight - Nilai bobot kriteria
 * @returns Tingkat kepentingan
 */
export function getImportanceLevel(weight: number): string {
  const percentage = weight * 100;

  if (percentage >= 30) {
    return "Sangat Tinggi";
  } else if (percentage >= 20) {
    return "Tinggi";
  } else if (percentage >= 15) {
    return "Sedang";
  } else if (percentage >= 10) {
    return "Rendah";
  } else {
    return "Sangat Rendah";
  }
}

/**
 * Membuat ringkasan hasil bobot dengan kriteria dan metadata lengkap
 * @param weights - Array bobot w_j
 * @param criteria - Array kriteria asli
 * @returns Array objek dengan informasi lengkap setiap kriteria
 */
export function summarizeCriteriaWeights(
  weights: number[],
  criteria: any[]
): Array<{
  id: string;
  name: string;
  type: string;
  weight: number;
  percentage: number;
  importance: string;
  ranking: number;
}> {
  // Buat array dengan semua informasi
  const criteriaWithWeights = weights.map((weight, index) => ({
    id: criteria[index]?.id || `c${index + 1}`,
    name: criteria[index]?.name || `Kriteria-${index + 1}`,
    type: criteria[index]?.type || "benefit",
    weight,
    percentage: weight * 100,
    importance: getImportanceLevel(weight),
    originalIndex: index,
  }));

  // Sort berdasarkan bobot (descending) untuk ranking
  criteriaWithWeights.sort((a, b) => b.weight - a.weight);

  // Tambahkan ranking
  const result = criteriaWithWeights.map((item, index) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    weight: item.weight,
    percentage: item.percentage,
    importance: item.importance,
    ranking: index + 1,
  }));

  return result;
}

/**
 * Menampilkan ringkasan lengkap hasil MEREC
 * @param summary - Ringkasan bobot kriteria
 */
export function showMerecSummary(
  summary: ReturnType<typeof summarizeCriteriaWeights>
): void {
  console.log("\n🏆 RINGKASAN HASIL ANALISIS MEREC:");
  console.log("=" + "=".repeat(80));

  console.log("Rank\tID\tKriteria\t\t\tTipe\t\tBobot\t\t%\tKepentingan");
  console.log("-".repeat(80));

  summary.forEach((item) => {
    console.log(
      `${item.ranking.toString().padStart(2)}\t` +
        `${item.id.padEnd(4)}\t` +
        `${item.name.substring(0, 20).padEnd(20)}\t` +
        `${item.type.padEnd(8)}\t` +
        `${item.weight.toFixed(6)}\t` +
        `${item.percentage.toFixed(2)}%\t` +
        `${item.importance}`
    );
  });

  console.log("=" + "=".repeat(80));

  // Insight tambahan
  const highImportance = summary.filter(
    (item) =>
      item.importance === "Sangat Tinggi" || item.importance === "Tinggi"
  );

  const lowImportance = summary.filter(
    (item) =>
      item.importance === "Sangat Rendah" || item.importance === "Rendah"
  );

  console.log("\n💡 INSIGHT:");
  console.log(
    `• ${highImportance.length} kriteria memiliki kepentingan tinggi`
  );
  console.log(`• ${lowImportance.length} kriteria memiliki kepentingan rendah`);
  console.log(
    `• Kriteria paling penting: ${
      summary[0].name
    } (${summary[0].percentage.toFixed(2)}%)`
  );

  if (summary.length > 1) {
    console.log(
      `• Kriteria paling tidak penting: ${
        summary[summary.length - 1].name
      } (${summary[summary.length - 1].percentage.toFixed(2)}%)`
    );
  }
}
