/**
 * Contoh sederhana penggunaan MEREC dengan method CalculateWeight
 */

const { Merec } = require("./dist/index.cjs");

console.log("🎯 CONTOH PENGGUNAAN MEREC - SIMPLE METHOD");
console.log("=" + "=".repeat(50));

// Data matrix: setiap baris = alternatif, setiap kolom = kriteria
const matrix = [
  [8, 7, 6, 5], // Alternatif 1
  [6, 8, 7, 6], // Alternatif 2
  [7, 6, 8, 7], // Alternatif 3
  [5, 9, 5, 8], // Alternatif 4
];

// Tipe kriteria: "benefit" = semakin besar semakin baik, "cost" = semakin kecil semakin baik
const criteriaTypes = ["benefit", "benefit", "cost", "benefit"];

try {
  console.log("\n📊 DATA INPUT:");
  console.log("Matrix Keputusan:");
  console.log("     C1  C2  C3  C4");
  matrix.forEach((row, i) => {
    console.log(`A${i + 1}   ${row.join("   ")}`);
  });

  console.log("\nTipe Kriteria:");
  criteriaTypes.forEach((type, i) => {
    console.log(`C${i + 1}: ${type}`);
  });

  console.log("\n⚡ MENGHITUNG BOBOT DENGAN MEREC...");

  // Hitung bobot menggunakan method static
  const weights = Merec.CalculateWeight(matrix, criteriaTypes);

  console.log("\n🎯 HASIL BOBOT KRITERIA:");
  console.log("-".repeat(30));

  weights.forEach((weight, i) => {
    const percentage = (weight * 100).toFixed(2);
    console.log(`C${i + 1}: ${weight.toFixed(6)} (${percentage}%)`);
  });

  // Verifikasi total = 1
  const total = weights.reduce((sum, w) => sum + w, 0);
  console.log("-".repeat(30));
  console.log(`Total: ${total.toFixed(6)} ✓`);

  // Ranking kriteria
  console.log("\n📈 RANKING KEPENTINGAN:");
  const ranked = weights
    .map((weight, index) => ({
      index: index + 1,
      weight,
      percentage: (weight * 100).toFixed(2),
    }))
    .sort((a, b) => b.weight - a.weight);

  ranked.forEach((item, rank) => {
    const medal =
      rank === 0
        ? "🥇"
        : rank === 1
        ? "🥈"
        : rank === 2
        ? "🥉"
        : `${rank + 1}.`;
    console.log(`${medal} C${item.index}: ${item.percentage}%`);
  });

  console.log("\n💡 INTERPRETASI:");
  console.log(
    `• Kriteria paling penting: C${ranked[0].index} (${ranked[0].percentage}%)`
  );
  console.log(
    `• Kriteria paling tidak penting: C${ranked[ranked.length - 1].index} (${
      ranked[ranked.length - 1].percentage
    }%)`
  );

  console.log("\n✅ Perhitungan selesai!");
} catch (error) {
  console.error("❌ Error:", error.message);
}
