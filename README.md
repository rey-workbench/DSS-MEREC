# DSS MEREC

**Decision Support System menggunakan metode MEREC (Method based on the Removal Effects of Criteria) untuk Multi-Criteria Decision Making dan penentuan bobot kriteria.**

---

## Deskripsi

MEREC (Method based on the Removal Effects of Criteria) adalah metode pengambilan keputusan multi-kriteria yang menentukan bobot kriteria berdasarkan efek penghapusan setiap kriteria terhadap kinerja keseluruhan alternatif.

Package ini mengimplementasikan algoritma MEREC dengan pendekatan functional programming yang sederhana dan mudah digunakan.

---

## Instalasi

```bash
npm install merec-dss
```

---

## Penggunaan

### CommonJS

```javascript
const { calculateMerecWeights } = require("merec-dss");

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
  // Hitung bobot menggunakan MEREC
  const weights = calculateMerecWeights(matrix, criteriaTypes);

  console.log("Bobot Kriteria:");
  weights.forEach((weight, i) => {
    const percentage = (weight * 100).toFixed(2);
    console.log(`C${i + 1}: ${weight.toFixed(6)} (${percentage}%)`);
  });

  // Verifikasi total = 1
  const total = weights.reduce((sum, w) => sum + w, 0);
  console.log(`Total: ${total.toFixed(6)}`);
} catch (error) {
  console.error("Error:", error.message);
}
```

### ES Modules

```javascript
import { calculateMerecWeights } from "merec-dss";

const matrix = [
  [8, 7, 6, 5],
  [6, 8, 7, 6],
  [7, 6, 8, 7],
  [5, 9, 5, 8],
];

const criteriaTypes = ["benefit", "benefit", "cost", "benefit"];

try {
  const weights = calculateMerecWeights(matrix, criteriaTypes);

  console.log("Hasil Bobot MEREC:");
  weights.forEach((weight, i) => {
    console.log(`Kriteria ${i + 1}: ${(weight * 100).toFixed(2)}%`);
  });
} catch (error) {
  console.error("Error:", error.message);
}
```

### Browser (UMD)

```html
<script src="https://unpkg.com/merec-dss/lib/index.umd.js"></script>
<script>
  const { calculateMerecWeights } = DSSMerec;

  const matrix = [
    [8, 7, 6, 5],
    [6, 8, 7, 6],
    [7, 6, 8, 7],
  ];

  const criteriaTypes = ["benefit", "benefit", "cost", "benefit"];

  const weights = calculateMerecWeights(matrix, criteriaTypes);
  console.log("Bobot kriteria:", weights);
</script>
```

---

## API Reference

### `calculateMerecWeights(matrix, criteriaTypes, epsilon?)`

Menghitung bobot kriteria menggunakan algoritma MEREC.

#### Parameters

- **`matrix`** `number[][]` - Matrix keputusan (m x n) dimana m = jumlah alternatif, n = jumlah kriteria
- **`criteriaTypes`** `CriteriaType[]` - Array tipe kriteria untuk setiap kolom
- **`epsilon`** `number` _(optional)_ - Nilai epsilon untuk menghindari pembagian dengan nol (default: 1e-10)

#### Returns

- **`number[]`** - Array bobot kriteria yang sudah dinormalisasi (total = 1)

#### Types

```typescript
type CriteriaType = "benefit" | "cost";
```

- **`"benefit"`** - Kriteria benefit (semakin besar nilai semakin baik)
- **`"cost"`** - Kriteria cost (semakin kecil nilai semakin baik)

#### Contoh

```javascript
const matrix = [
  [100, 80, 75], // Alternatif A
  [90, 85, 80], // Alternatif B
  [85, 90, 70], // Alternatif C
];

const criteriaTypes = ["benefit", "benefit", "cost"];

const weights = calculateMerecWeights(matrix, criteriaTypes);
// Output: [0.334, 0.333, 0.333] (contoh)
```

---

## Langkah Algoritma MEREC

1. **MER-01**: Membuat matriks keputusan (X)
2. **MER-02**: Normalisasi matriks menggunakan formula MEREC
3. **MER-03**: Menghitung kinerja keseluruhan (Si)
4. **MER-04**: Menghitung kinerja setelah penghapusan kriteria (Si')
5. **MER-05**: Menghitung deviasi absolut (Ei)
6. **MER-06**: Menentukan bobot akhir kriteria (Wi)

---

## Contoh Lengkap

```javascript
const { calculateMerecWeights } = require("merec-dss");

// Contoh kasus: Pemilihan smartphone
const smartphones = [
  [8, 7, 6, 5, 9], // iPhone
  [6, 8, 7, 6, 7], // Samsung
  [7, 6, 8, 7, 8], // Xiaomi
  [5, 9, 5, 8, 6], // OnePlus
];

// Kriteria: Performa, Kamera, Harga, Baterai, Desain
const criteriaTypes = ["benefit", "benefit", "cost", "benefit", "benefit"];

try {
  console.log("=== ANALISIS BOBOT KRITERIA SMARTPHONE ===");

  const weights = calculateMerecWeights(smartphones, criteriaTypes);

  const criteriaNames = ["Performa", "Kamera", "Harga", "Baterai", "Desain"];

  console.log("\nHasil Bobot Kriteria:");
  console.log("-".repeat(40));

  weights.forEach((weight, i) => {
    const percentage = (weight * 100).toFixed(2);
    console.log(
      `${criteriaNames[i].padEnd(10)}: ${weight.toFixed(6)} (${percentage}%)`
    );
  });

  // Ranking kriteria berdasarkan kepentingan
  const ranked = weights
    .map((weight, index) => ({
      name: criteriaNames[index],
      weight,
      percentage: (weight * 100).toFixed(2),
    }))
    .sort((a, b) => b.weight - a.weight);

  console.log("\nRanking Kepentingan Kriteria:");
  console.log("-".repeat(40));
  ranked.forEach((item, rank) => {
    console.log(`${rank + 1}. ${item.name}: ${item.percentage}%`);
  });

  console.log("\nInterpretasi:");
  console.log(
    `- Kriteria paling penting: ${ranked[0].name} (${ranked[0].percentage}%)`
  );
  console.log(
    `- Kriteria paling tidak penting: ${ranked[ranked.length - 1].name} (${
      ranked[ranked.length - 1].percentage
    }%)`
  );
} catch (error) {
  console.error("Error:", error.message);
}
```

---

## Validasi Input

Package ini melakukan validasi otomatis terhadap input:

- Matrix tidak boleh kosong
- Semua baris matrix harus memiliki jumlah kolom yang sama
- Jumlah `criteriaTypes` harus sesuai dengan jumlah kolom matrix
- Nilai matrix akan dikonversi ke positif jika negatif atau nol

---

## Error Handling

```javascript
try {
  const weights = calculateMerecWeights(matrix, criteriaTypes);
  // Berhasil
} catch (error) {
  if (error.message.includes("Matrix tidak boleh kosong")) {
    console.log("Silakan berikan data matrix yang valid");
  } else if (error.message.includes("harus memiliki")) {
    console.log("Pastikan semua baris matrix memiliki jumlah kolom yang sama");
  } else {
    console.log("Error:", error.message);
  }
}
```

---

## Compatibility

- **Node.js**: 14.x atau lebih tinggi
- **Browser**: Chrome 80+, Firefox 72+, Safari 13.1+
- **TypeScript**: 4.x atau lebih tinggi

---

## Lisensi

MIT License. Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

## Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request di [GitHub repository](https://github.com/reysilvaa/merec-dss).

---

# DSS MEREC (English)

**Decision Support System using MEREC (Method based on the Removal Effects of Criteria) for Multi-Criteria Decision Making and criteria weight determination.**

---

## Description

MEREC (Method based on the Removal Effects of Criteria) is a multi-criteria decision-making method that determines criteria weights based on the removal effects of each criterion on the overall performance of alternatives.

This package implements the MEREC algorithm with a simple and easy-to-use functional programming approach.

---

## Installation

```bash
npm install merec-dss
```

---

## Usage

### CommonJS

```javascript
const { calculateMerecWeights } = require("merec-dss");

// Data matrix: each row = alternative, each column = criterion
const matrix = [
  [8, 7, 6, 5], // Alternative 1
  [6, 8, 7, 6], // Alternative 2
  [7, 6, 8, 7], // Alternative 3
  [5, 9, 5, 8], // Alternative 4
];

// Criteria types: "benefit" = higher is better, "cost" = lower is better
const criteriaTypes = ["benefit", "benefit", "cost", "benefit"];

try {
  // Calculate weights using MEREC
  const weights = calculateMerecWeights(matrix, criteriaTypes);

  console.log("Criteria Weights:");
  weights.forEach((weight, i) => {
    const percentage = (weight * 100).toFixed(2);
    console.log(`C${i + 1}: ${weight.toFixed(6)} (${percentage}%)`);
  });

  // Verify total = 1
  const total = weights.reduce((sum, w) => sum + w, 0);
  console.log(`Total: ${total.toFixed(6)}`);
} catch (error) {
  console.error("Error:", error.message);
}
```

### ES Modules

```javascript
import { calculateMerecWeights } from "merec-dss";

const matrix = [
  [8, 7, 6, 5],
  [6, 8, 7, 6],
  [7, 6, 8, 7],
  [5, 9, 5, 8],
];

const criteriaTypes = ["benefit", "benefit", "cost", "benefit"];

try {
  const weights = calculateMerecWeights(matrix, criteriaTypes);

  console.log("MEREC Weight Results:");
  weights.forEach((weight, i) => {
    console.log(`Criterion ${i + 1}: ${(weight * 100).toFixed(2)}%`);
  });
} catch (error) {
  console.error("Error:", error.message);
}
```

### Browser (UMD)

```html
<script src="https://unpkg.com/merec-dss/lib/index.umd.js"></script>
<script>
  const { calculateMerecWeights } = DSSMerec;

  const matrix = [
    [8, 7, 6, 5],
    [6, 8, 7, 6],
    [7, 6, 8, 7],
  ];

  const criteriaTypes = ["benefit", "benefit", "cost", "benefit"];

  const weights = calculateMerecWeights(matrix, criteriaTypes);
  console.log("Criteria weights:", weights);
</script>
```

---

## API Reference

### `calculateMerecWeights(matrix, criteriaTypes, epsilon?)`

Calculate criteria weights using the MEREC algorithm.

#### Parameters

- **`matrix`** `number[][]` - Decision matrix (m x n) where m = number of alternatives, n = number of criteria
- **`criteriaTypes`** `CriteriaType[]` - Array of criteria types for each column
- **`epsilon`** `number` _(optional)_ - Epsilon value to avoid division by zero (default: 1e-10)

#### Returns

- **`number[]`** - Array of normalized criteria weights (total = 1)

#### Types

```typescript
type CriteriaType = "benefit" | "cost";
```

- **`"benefit"`** - Benefit criterion (higher values are better)
- **`"cost"`** - Cost criterion (lower values are better)

#### Example

```javascript
const matrix = [
  [100, 80, 75], // Alternative A
  [90, 85, 80], // Alternative B
  [85, 90, 70], // Alternative C
];

const criteriaTypes = ["benefit", "benefit", "cost"];

const weights = calculateMerecWeights(matrix, criteriaTypes);
// Output: [0.334, 0.333, 0.333] (example)
```

---

## MEREC Algorithm Steps

1. **MER-01**: Create decision matrix (X)
2. **MER-02**: Normalize matrix using MEREC formula
3. **MER-03**: Calculate overall performance (Si)
4. **MER-04**: Calculate performance after criteria removal (Si')
5. **MER-05**: Calculate absolute deviation (Ei)
6. **MER-06**: Determine final criteria weights (Wi)

---

## Complete Example

```javascript
const { calculateMerecWeights } = require("merec-dss");

// Example case: Smartphone selection
const smartphones = [
  [8, 7, 6, 5, 9], // iPhone
  [6, 8, 7, 6, 7], // Samsung
  [7, 6, 8, 7, 8], // Xiaomi
  [5, 9, 5, 8, 6], // OnePlus
];

// Criteria: Performance, Camera, Price, Battery, Design
const criteriaTypes = ["benefit", "benefit", "cost", "benefit", "benefit"];

try {
  console.log("=== SMARTPHONE CRITERIA WEIGHT ANALYSIS ===");

  const weights = calculateMerecWeights(smartphones, criteriaTypes);

  const criteriaNames = ["Performance", "Camera", "Price", "Battery", "Design"];

  console.log("\nCriteria Weight Results:");
  console.log("-".repeat(40));

  weights.forEach((weight, i) => {
    const percentage = (weight * 100).toFixed(2);
    console.log(
      `${criteriaNames[i].padEnd(12)}: ${weight.toFixed(6)} (${percentage}%)`
    );
  });

  // Rank criteria by importance
  const ranked = weights
    .map((weight, index) => ({
      name: criteriaNames[index],
      weight,
      percentage: (weight * 100).toFixed(2),
    }))
    .sort((a, b) => b.weight - a.weight);

  console.log("\nCriteria Importance Ranking:");
  console.log("-".repeat(40));
  ranked.forEach((item, rank) => {
    console.log(`${rank + 1}. ${item.name}: ${item.percentage}%`);
  });

  console.log("\nInterpretation:");
  console.log(
    `- Most important criterion: ${ranked[0].name} (${ranked[0].percentage}%)`
  );
  console.log(
    `- Least important criterion: ${ranked[ranked.length - 1].name} (${
      ranked[ranked.length - 1].percentage
    }%)`
  );
} catch (error) {
  console.error("Error:", error.message);
}
```

---

## Input Validation

This package automatically validates inputs:

- Matrix cannot be empty
- All matrix rows must have the same number of columns
- Number of `criteriaTypes` must match the number of matrix columns
- Matrix values will be converted to positive if negative or zero

---

## Error Handling

```javascript
try {
  const weights = calculateMerecWeights(matrix, criteriaTypes);
  // Success
} catch (error) {
  if (error.message.includes("Matrix cannot be empty")) {
    console.log("Please provide valid matrix data");
  } else if (error.message.includes("must have")) {
    console.log("Ensure all matrix rows have the same number of columns");
  } else {
    console.log("Error:", error.message);
  }
}
```

---

## Compatibility

- **Node.js**: 14.x or higher
- **Browser**: Chrome 80+, Firefox 72+, Safari 13.1+
- **TypeScript**: 4.x or higher

---

## License

MIT License. See [LICENSE](LICENSE) file for full details.

---

## Contributing

Contributions are welcome! Please create an issue or pull request on the [GitHub repository](https://github.com/reysilvaa/merec-dss).
