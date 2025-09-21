# DSS MEREC

[![npm version](https://badge.fury.io/js/dss-merec.svg)](https://badge.fury.io/js/dss-merec)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Languages**: [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

## English

Implementation of MEREC (Method based on Removal Effects of Criteria) algorithm for calculating criteria weights in multi-criteria decision making systems.

### Overview

MEREC (Method based on the Removal Effects of Criteria) is a modern multi-criteria decision-making (MCDM) method that determines **criteria weights** based on the removal effects of each criterion on the overall performance of alternatives.

**Important**: MEREC is only for calculating criteria weights, not for ranking alternatives. Use the generated weights for other MCDM methods like TOPSIS, SAW, or WASPAS.

### Features

- **Pure MEREC Implementation**: Clean implementation of MEREC algorithm for weighting
- **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- **Well Tested**: Comprehensive test suite with various edge cases
- **Easy to Use**: Simple API with sensible defaults
- **Configurable**: Customizable options for different use cases
- **Well Documented**: Complete documentation with examples

### Installation

```bash
npm install dss-merec
```

### Quick Start

**CommonJS (Node.js):**

```javascript
const { Merec } = require("dss-merec");

// Define your decision matrix
const matrix = [
  [8, 7, 6, 5], // Alternative 1
  [6, 8, 7, 6], // Alternative 2
  [7, 6, 8, 7], // Alternative 3
  [5, 9, 5, 8], // Alternative 4
];

// Define criteria types
const criteriaTypes = ["benefit", "benefit", "cost", "benefit"];

// Calculate criteria weights
const weights = Merec.CalculateWeight(matrix, criteriaTypes);

console.log("Criteria weights:", weights);
// Output: [0.3519, 0.1917, 0.1998, 0.2566]
```

**ES Modules (TypeScript/Modern JS):**

```typescript
import { Merec } from "dss-merec";

// Define your decision matrix
const matrix = [
  [8, 7, 6, 5], // Alternative 1
  [6, 8, 7, 6], // Alternative 2
  [7, 6, 8, 7], // Alternative 3
  [5, 9, 5, 8], // Alternative 4
];

// Define criteria types
const criteriaTypes: ("benefit" | "cost")[] = [
  "benefit",
  "benefit",
  "cost",
  "benefit",
];

// Calculate criteria weights
const weights = Merec.CalculateWeight(matrix, criteriaTypes);

console.log("Criteria weights:", weights);
// Output: [0.3519, 0.1917, 0.1998, 0.2566]
```

### API Reference

#### Static Method

**`Merec.CalculateWeight(matrix, criteriaTypes)`**

Calculate criteria weights using MEREC algorithm.

**Parameters:**

- `matrix` (number[][]): Decision matrix where rows = alternatives, columns = criteria
- `criteriaTypes` (("benefit" | "cost")[]): Array of criteria types

**Returns:**

- `number[]`: Array of criteria weights [0-1] that sum to 1.0

**Example:**

```javascript
const matrix = [
  [4.5, 25, 150000], // Alternative 1: [rating, reviews, price]
  [3.8, 65, 72000], // Alternative 2
  [4.2, 95, 88000], // Alternative 3
];

const criteriaTypes = ["benefit", "benefit", "cost"];
const weights = Merec.CalculateWeight(matrix, criteriaTypes);
```

### Criteria Types

- **"benefit"**: Higher values are better (e.g., quality, performance, rating)
- **"cost"**: Lower values are better (e.g., price, distance, time)

### Input Validation

The method includes comprehensive input validation:

```javascript
try {
  const weights = Merec.CalculateWeight(matrix, criteriaTypes);
} catch (error) {
  console.error("Error:", error.message);
  // Possible errors:
  // - "Matrix tidak boleh kosong" (Empty matrix)
  // - "Tipe kriteria tidak boleh kosong" (Empty criteria types)
  // - "Jumlah kolom matrix (X) harus sama dengan jumlah tipe kriteria (Y)"
  // - "Baris X harus memiliki Y kolom" (Inconsistent row lengths)
}
```

### Algorithm Details

The MEREC algorithm follows these steps:

1. **Decision Matrix Creation**: Organize alternatives and criteria into a matrix
2. **Normalization**: Apply MEREC-specific normalization
   - Benefit criteria: `n_ij = x_ij / max(x_j)`
   - Cost criteria: `n_ij = min(x_j) / x_ij`
3. **Overall Performance**: Calculate `S_i = ln(1 + (1/m) * Σ|ln(n_ij)|)`
4. **Removal Effects**: Calculate performance without each criterion
5. **Deviation Calculation**: Measure impact of removing each criterion
6. **Weight Determination**: Calculate weights based on removal effects

**Output**: Criteria weights array that can be used for other MCDM methods.

### Performance Considerations

- **Time Complexity**: O(m×n²) where m = alternatives, n = criteria
- **Space Complexity**: O(m×n)
- **Recommended Limits**: < 1000 alternatives, < 50 criteria for optimal performance

### Integration with Other MCDM Methods

Use MEREC weights with other decision-making methods:

```javascript
// Calculate weights with MEREC
const weights = Merec.CalculateWeight(matrix, criteriaTypes);

// Use with TOPSIS
const topsisResult = topsis(matrix, weights, criteriaTypes);

// Use with SAW (Simple Additive Weighting)
const sawResult = saw(matrix, weights, criteriaTypes);

// Use with WASPAS
const waspasResult = waspas(matrix, weights, criteriaTypes);
```

---

## Bahasa Indonesia

Implementasi algoritma MEREC (Method based on Removal Effects of Criteria) untuk menghitung bobot kriteria dalam sistem pengambilan keputusan multi-kriteria.

### Gambaran Umum

MEREC (Method based on the Removal Effects of Criteria) adalah metode pengambilan keputusan multi-kriteria modern yang menentukan **bobot kriteria** berdasarkan efek penghapusan setiap kriteria terhadap kinerja keseluruhan alternatif.

**Penting**: MEREC hanya untuk menghitung bobot kriteria, bukan untuk ranking alternatif. Gunakan bobot yang dihasilkan untuk metode MCDM lain seperti TOPSIS, SAW, atau WASPAS.

### Fitur

- **Implementasi MEREC Murni**: Implementasi bersih algoritma MEREC untuk pembobotan
- **Dukungan TypeScript**: Dukungan penuh TypeScript dengan definisi tipe lengkap
- **Teruji dengan Baik**: Test suite komprehensif dengan berbagai edge case
- **Mudah Digunakan**: API sederhana dengan pengaturan default yang masuk akal
- **Dapat Dikonfigurasi**: Opsi yang dapat disesuaikan untuk berbagai use case
- **Dokumentasi Lengkap**: Dokumentasi lengkap dengan contoh-contoh

### Instalasi

```bash
npm install dss-merec
```

### Memulai Cepat

**CommonJS (Node.js):**

```javascript
const { Merec } = require("dss-merec");

// Definisikan matriks keputusan Anda
const matrix = [
  [8, 7, 6, 5], // Alternatif 1
  [6, 8, 7, 6], // Alternatif 2
  [7, 6, 8, 7], // Alternatif 3
  [5, 9, 5, 8], // Alternatif 4
];

// Definisikan tipe kriteria
const criteriaTypes = ["benefit", "benefit", "cost", "benefit"];

// Hitung bobot kriteria
const weights = Merec.CalculateWeight(matrix, criteriaTypes);

console.log("Bobot kriteria:", weights);
// Output: [0.3519, 0.1917, 0.1998, 0.2566]
```

**ES Modules (TypeScript/Modern JS):**

```typescript
import { Merec } from "dss-merec";

// Definisikan matriks keputusan Anda
const matrix = [
  [8, 7, 6, 5], // Alternatif 1
  [6, 8, 7, 6], // Alternatif 2
  [7, 6, 8, 7], // Alternatif 3
  [5, 9, 5, 8], // Alternatif 4
];

// Definisikan tipe kriteria
const criteriaTypes: ("benefit" | "cost")[] = [
  "benefit",
  "benefit",
  "cost",
  "benefit",
];

// Hitung bobot kriteria
const weights = Merec.CalculateWeight(matrix, criteriaTypes);

console.log("Bobot kriteria:", weights);
// Output: [0.3519, 0.1917, 0.1998, 0.2566]
```

### Referensi API

#### Method Static

**`Merec.CalculateWeight(matrix, criteriaTypes)`**

Menghitung bobot kriteria menggunakan algoritma MEREC.

**Parameter:**

- `matrix` (number[][]): Matriks keputusan dimana baris = alternatif, kolom = kriteria
- `criteriaTypes` (("benefit" | "cost")[]): Array tipe kriteria

**Returns:**

- `number[]`: Array bobot kriteria [0-1] yang berjumlah 1.0

**Contoh:**

```javascript
const matrix = [
  [4.5, 25, 150000], // Alternatif 1: [rating, review, harga]
  [3.8, 65, 72000], // Alternatif 2
  [4.2, 95, 88000], // Alternatif 3
];

const criteriaTypes = ["benefit", "benefit", "cost"];
const weights = Merec.CalculateWeight(matrix, criteriaTypes);
```

### Tipe Kriteria

- **"benefit"**: Nilai lebih tinggi lebih baik (contoh: kualitas, performa, rating)
- **"cost"**: Nilai lebih rendah lebih baik (contoh: harga, jarak, waktu)

### Validasi Input

Method ini menyertakan validasi input yang komprehensif:

```javascript
try {
  const weights = Merec.CalculateWeight(matrix, criteriaTypes);
} catch (error) {
  console.error("Error:", error.message);
  // Kemungkinan error:
  // - "Matrix tidak boleh kosong"
  // - "Tipe kriteria tidak boleh kosong"
  // - "Jumlah kolom matrix (X) harus sama dengan jumlah tipe kriteria (Y)"
  // - "Baris X harus memiliki Y kolom"
}
```

### Detail Algoritma

Algoritma MEREC mengikuti langkah-langkah berikut:

1. **Pembuatan Matriks Keputusan**: Mengorganisir alternatif dan kriteria ke dalam matriks
2. **Normalisasi**: Menerapkan normalisasi spesifik MEREC
   - Kriteria benefit: `n_ij = x_ij / max(x_j)`
   - Kriteria cost: `n_ij = min(x_j) / x_ij`
3. **Kinerja Keseluruhan**: Menghitung `S_i = ln(1 + (1/m) * Σ|ln(n_ij)|)`
4. **Efek Penghapusan**: Menghitung kinerja tanpa setiap kriteria
5. **Perhitungan Deviasi**: Mengukur dampak penghapusan setiap kriteria
6. **Penentuan Bobot**: Menghitung bobot berdasarkan efek penghapusan

**Output**: Array bobot kriteria yang dapat digunakan untuk metode MCDM lain.

### Integrasi dengan Metode MCDM Lain

Gunakan bobot MEREC dengan metode pengambilan keputusan lain:

```javascript
// Hitung bobot dengan MEREC
const weights = Merec.CalculateWeight(matrix, criteriaTypes);

// Gunakan dengan TOPSIS
const topsisResult = topsis(matrix, weights, criteriaTypes);

// Gunakan dengan SAW (Simple Additive Weighting)
const sawResult = saw(matrix, weights, criteriaTypes);

// Gunakan dengan WASPAS
const waspasResult = waspas(matrix, weights, criteriaTypes);
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Citation

If you use this library in academic research, please cite:

```
Keshavarz-Ghorabaee, M., Zavadskas, E. K., Olfat, L., & Turskis, Z. (2015).
Multi-criteria inventory classification using a new method of evaluation based on removal effects of criteria (MEREC).
Informatica, 26(4), 615-632.
```

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
