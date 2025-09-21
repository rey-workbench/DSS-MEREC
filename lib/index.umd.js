(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DSSMerec = {}));
})(this, (function (exports) { 'use strict';

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
    /**
     * Membuat matriks keputusan dari alternatif yang diberikan
     * @param alternatives - Array alternatif
     * @param criteria - Array kriteria
     * @returns Matriks keputusan X (m x n)
     */
    function calculateDecisionMatrix(alternatives, criteria) {
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
        const matrix = [];
        for (let i = 0; i < m; i++) {
            const alternative = alternatives[i];
            // Validasi jumlah nilai sesuai dengan jumlah kriteria
            if (alternative.values.length !== n) {
                throw new Error(`Alternative '${alternative.name}' must have exactly ${n} values`);
            }
            // Validasi semua nilai harus positif (x_ij > 0)
            const row = [];
            for (let j = 0; j < n; j++) {
                let value = alternative.values[j];
                // Jika nilai negatif atau nol, konversi ke positif
                if (value <= 0) {
                    console.warn(`Nilai negatif atau nol ditemukan pada alternatif '${alternative.name}' ` +
                        `kriteria '${criteria[j].name}'. Menggunakan nilai absolut + 1.`);
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
    function validateDecisionMatrix(matrix, criteria) {
        const m = matrix.length;
        const n = matrix[0]?.length || 0;
        if (m === 0 || n === 0) {
            throw new Error("Matriks keputusan tidak boleh kosong");
        }
        if (n !== criteria.length) {
            throw new Error(`Jumlah kolom matriks (${n}) tidak sesuai dengan jumlah kriteria (${criteria.length})`);
        }
        // Pastikan semua nilai positif
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (matrix[i][j] <= 0) {
                    throw new Error(`Nilai matriks pada posisi [${i}][${j}] harus lebih besar dari 0`);
                }
            }
        }
    }

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
    /**
     * Melakukan normalisasi matriks keputusan sesuai rumus MER-02
     * @param matrix - Matriks keputusan X (m x n)
     * @param criteria - Array kriteria dengan tipe benefit/cost
     * @param epsilon - Nilai kecil untuk menghindari pembagian dengan nol
     * @returns Matriks yang dinormalisasi N (m x n)
     */
    function calculateNormalizedMatrix(matrix, criteria, epsilon = 1e-10) {
        const m = matrix.length; // jumlah alternatif
        const n = matrix[0].length; // jumlah kriteria
        if (n !== criteria.length) {
            throw new Error(`Jumlah kolom matriks (${n}) tidak sesuai dengan jumlah kriteria (${criteria.length})`);
        }
        // Hasil matriks normalisasi
        const normalizedMatrix = [];
        for (let i = 0; i < m; i++) {
            const normalizedRow = [];
            for (let j = 0; j < n; j++) {
                const criteriaType = criteria[j].type;
                const currentValue = matrix[i][j];
                // Ambil semua nilai pada kolom j
                const columnValues = matrix.map((row) => row[j]);
                let normalizedValue;
                if (criteriaType === "benefit") {
                    // Untuk kriteria benefit: nx_ij = min_k(x_kj) / x_ij
                    const minValue = Math.min(...columnValues);
                    if (minValue <= 0) {
                        console.warn(`Kriteria benefit '${criteria[j].name}' memiliki nilai minimum <= 0, menggunakan epsilon`);
                        normalizedValue = epsilon;
                    }
                    else {
                        normalizedValue = minValue / Math.max(currentValue, epsilon);
                    }
                }
                else {
                    // Untuk kriteria cost: nx_ij = x_ij / max_k(x_kj)
                    const maxValue = Math.max(...columnValues);
                    if (maxValue === 0) {
                        console.warn(`Kriteria cost '${criteria[j].name}' memiliki nilai maksimum 0, menggunakan epsilon`);
                        normalizedValue = epsilon;
                    }
                    else {
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
    function validateNormalizedMatrix(normalizedMatrix) {
        const m = normalizedMatrix.length;
        const n = normalizedMatrix[0]?.length || 0;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                const value = normalizedMatrix[i][j];
                if (!isFinite(value) || value <= 0) {
                    throw new Error(`Nilai normalisasi tidak valid pada posisi [${i}][${j}]: ${value}`);
                }
            }
        }
    }

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
    function calculateOverallPerformance(normalizedMatrix, epsilon = 1e-10) {
        const m = normalizedMatrix.length; // jumlah alternatif
        const n = normalizedMatrix[0]?.length || 0; // jumlah kriteria
        if (m === 0 || n === 0) {
            throw new Error("Matriks normalisasi tidak boleh kosong");
        }
        const performances = [];
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
                    console.warn(`Nilai ln tidak terbatas pada alternatif ${i}, kriteria ${j}. ` +
                        `nx_ij = ${nx_ij}, menggunakan epsilon.`);
                    sumAbsLn += Math.abs(Math.log(epsilon));
                }
                else {
                    sumAbsLn += absLnValue;
                }
            }
            // Hitung rata-rata: (1/m * Σ_j |ln(nx_ij)|)
            const avgAbsLn = sumAbsLn / n; // Note: menggunakan n (jumlah kriteria), bukan m
            // Hitung S_i = ln(1 + avgAbsLn)
            const S_i = Math.log(1 + avgAbsLn);
            // Validasi hasil akhir
            if (!isFinite(S_i)) {
                console.warn(`Kinerja tidak terbatas pada alternatif ${i}. ` +
                    `avgAbsLn = ${avgAbsLn}, menggunakan nilai default.`);
                performances.push(0);
            }
            else {
                performances.push(S_i);
            }
        }
        return performances;
    }
    /**
     * Validasi hasil kinerja keseluruhan
     * @param performances - Array kinerja keseluruhan
     */
    function validateOverallPerformance(performances) {
        if (performances.length === 0) {
            throw new Error("Array kinerja keseluruhan tidak boleh kosong");
        }
        for (let i = 0; i < performances.length; i++) {
            const S_i = performances[i];
            if (!isFinite(S_i)) {
                throw new Error(`Kinerja keseluruhan tidak valid pada alternatif ${i}: ${S_i}`);
            }
            if (S_i < 0) {
                console.warn(`Kinerja keseluruhan negatif pada alternatif ${i}: ${S_i}. ` +
                    `Ini mungkin menunjukkan masalah dalam normalisasi.`);
            }
        }
    }

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
    function calculateRemovalPerformance(normalizedMatrix, epsilon = 1e-10) {
        const m = normalizedMatrix.length; // jumlah alternatif
        const n = normalizedMatrix[0]?.length || 0; // jumlah kriteria
        if (m === 0 || n === 0) {
            throw new Error("Matriks normalisasi tidak boleh kosong");
        }
        const removalPerformances = [];
        for (let i = 0; i < m; i++) {
            const removalRow = [];
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
                            console.warn(`Nilai ln tidak terbatas pada removal alternatif ${i}, ` +
                                `kriteria ${k} (menghilangkan ${j}). nx_ik = ${nx_ik}, menggunakan epsilon.`);
                            sumAbsLnWithoutJ += Math.abs(Math.log(epsilon));
                        }
                        else {
                            sumAbsLnWithoutJ += absLnValue;
                        }
                        countWithoutJ++;
                    }
                }
                // Jika semua kriteria dihilangkan (n=1), gunakan nilai default
                if (countWithoutJ === 0) {
                    console.warn(`Hanya ada 1 kriteria, tidak bisa menghilangkan kriteria ${j}. ` +
                        `Menggunakan nilai default untuk S'_${i}${j}.`);
                    removalRow.push(0);
                    continue;
                }
                // Hitung rata-rata: (1/(n-1) * Σ_k,k≠j |ln(nx_ik)|)
                const avgAbsLnWithoutJ = sumAbsLnWithoutJ / countWithoutJ;
                // Hitung S'_ij = ln(1 + avgAbsLnWithoutJ)
                const S_prime_ij = Math.log(1 + avgAbsLnWithoutJ);
                // Validasi hasil akhir
                if (!isFinite(S_prime_ij)) {
                    console.warn(`Kinerja removal tidak terbatas pada alternatif ${i}, kriteria ${j}. ` +
                        `avgAbsLnWithoutJ = ${avgAbsLnWithoutJ}, menggunakan nilai default.`);
                    removalRow.push(0);
                }
                else {
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
    function validateRemovalPerformance(removalPerformances) {
        const m = removalPerformances.length;
        if (m === 0) {
            throw new Error("Matriks kinerja removal tidak boleh kosong");
        }
        const n = removalPerformances[0]?.length || 0;
        for (let i = 0; i < m; i++) {
            if (removalPerformances[i].length !== n) {
                throw new Error(`Panjang baris ${i} tidak konsisten dalam matriks kinerja removal`);
            }
            for (let j = 0; j < n; j++) {
                const S_prime_ij = removalPerformances[i][j];
                if (!isFinite(S_prime_ij)) {
                    throw new Error(`Kinerja removal tidak valid pada posisi [${i}][${j}]: ${S_prime_ij}`);
                }
                if (S_prime_ij < 0) {
                    console.warn(`Kinerja removal negatif pada posisi [${i}][${j}]: ${S_prime_ij}. ` +
                        `Ini mungkin menunjukkan masalah dalam normalisasi.`);
                }
            }
        }
    }

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
    function calculateAbsoluteDeviations(performances, removalPerformances) {
        const m = performances.length; // jumlah alternatif
        const n = removalPerformances[0]?.length || 0; // jumlah kriteria
        // Validasi input
        if (m === 0) {
            throw new Error("Array kinerja keseluruhan tidak boleh kosong");
        }
        if (removalPerformances.length !== m) {
            throw new Error(`Jumlah baris matriks removal (${removalPerformances.length}) ` +
                `tidak sesuai dengan jumlah alternatif (${m})`);
        }
        if (n === 0) {
            throw new Error("Matriks kinerja removal tidak boleh kosong");
        }
        const deviations = [];
        // Hitung E_j untuk setiap kriteria j
        for (let j = 0; j < n; j++) {
            let E_j = 0;
            // Hitung Σ_i |S'_ij - S_i|
            for (let i = 0; i < m; i++) {
                const S_i = performances[i];
                const S_prime_ij = removalPerformances[i][j];
                // Validasi nilai sebelum perhitungan
                if (!isFinite(S_i)) {
                    console.warn(`Kinerja keseluruhan tidak terbatas pada alternatif ${i}: ${S_i}. ` +
                        `Menggunakan 0 untuk perhitungan deviasi.`);
                }
                if (!isFinite(S_prime_ij)) {
                    console.warn(`Kinerja removal tidak terbatas pada posisi [${i}][${j}]: ${S_prime_ij}. ` +
                        `Menggunakan 0 untuk perhitungan deviasi.`);
                }
                // Hitung |S'_ij - S_i|
                const safeS_i = isFinite(S_i) ? S_i : 0;
                const safeS_prime_ij = isFinite(S_prime_ij) ? S_prime_ij : 0;
                const absoluteDeviation = Math.abs(safeS_prime_ij - safeS_i);
                E_j += absoluteDeviation;
            }
            // Validasi hasil E_j
            if (!isFinite(E_j)) {
                console.warn(`Deviasi absolut tidak terbatas untuk kriteria ${j}: ${E_j}. ` +
                    `Menggunakan 0.`);
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
    function validateAbsoluteDeviations(deviations) {
        if (deviations.length === 0) {
            throw new Error("Array deviasi absolut tidak boleh kosong");
        }
        for (let j = 0; j < deviations.length; j++) {
            const E_j = deviations[j];
            if (!isFinite(E_j)) {
                throw new Error(`Deviasi absolut tidak valid pada kriteria ${j}: ${E_j}`);
            }
            if (E_j < 0) {
                throw new Error(`Deviasi absolut tidak boleh negatif pada kriteria ${j}: ${E_j}`);
            }
        }
    }

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
    function calculateFinalWeights(deviations) {
        const n = deviations.length; // jumlah kriteria
        // Validasi input
        if (n === 0) {
            throw new Error("Array deviasi absolut tidak boleh kosong");
        }
        // Hitung total deviasi: Σ_k E_k
        const totalDeviations = deviations.reduce((sum, e) => sum + e, 0);
        // Jika total deviasi adalah 0, berikan bobot yang sama untuk semua kriteria
        if (totalDeviations === 0 || !isFinite(totalDeviations)) {
            console.warn("Total deviasi adalah 0 atau tidak terbatas, menggunakan bobot yang sama untuk semua kriteria");
            const equalWeight = 1 / n;
            return new Array(n).fill(equalWeight);
        }
        const weights = [];
        // Hitung w_j = E_j / Σ_k E_k untuk setiap kriteria
        for (let j = 0; j < n; j++) {
            const E_j = deviations[j];
            // Validasi E_j
            if (!isFinite(E_j)) {
                console.warn(`Deviasi tidak terbatas pada kriteria ${j}: ${E_j}. ` +
                    `Menggunakan 0 untuk perhitungan bobot.`);
                weights.push(0);
                continue;
            }
            if (E_j < 0) {
                console.warn(`Deviasi negatif pada kriteria ${j}: ${E_j}. ` +
                    `Menggunakan nilai absolut.`);
            }
            // Hitung bobot
            const w_j = Math.abs(E_j) / totalDeviations;
            weights.push(w_j);
        }
        // Validasi total bobot = 1
        const totalWeights = weights.reduce((sum, w) => sum + w, 0);
        if (Math.abs(totalWeights - 1) > 1e-10) {
            console.warn(`Total bobot tidak sama dengan 1: ${totalWeights}. ` +
                `Melakukan normalisasi ulang.`);
            // Normalisasi ulang jika total tidak = 1
            if (totalWeights > 0) {
                for (let j = 0; j < n; j++) {
                    weights[j] = weights[j] / totalWeights;
                }
            }
            else {
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
    function validateFinalWeights(weights) {
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
                throw new Error(`Bobot tidak boleh lebih dari 1 pada kriteria ${j}: ${w_j}`);
            }
            totalWeight += w_j;
        }
        // Toleransi untuk floating point precision
        if (Math.abs(totalWeight - 1) > 1e-10) {
            throw new Error(`Total bobot harus sama dengan 1, tetapi mendapat: ${totalWeight}`);
        }
    }

    /**
     * MEREC (Method based on the Removal Effects of Criteria) implementation
     * Pure function approach for calculating criteria weights
     */
    // Import calculation functions
    /**
     * Calculate criteria weights using MEREC algorithm
     * @param matrix - Decision matrix where rows = alternatives, columns = criteria
     * @param criteriaTypes - Array of criteria types ("benefit" or "cost")
     * @returns Array of criteria weights [0-1] that sum to 1.0
     */
    function calculateMerecWeights(matrix, criteriaTypes) {
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
            throw new Error(`Jumlah kolom matrix (${n}) harus sama dengan jumlah tipe kriteria (${criteriaTypes.length})`);
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
        console.log = () => { };
        console.warn = () => { };
        try {
            // MER-01: Create Decision Matrix
            const decisionMatrix = calculateDecisionMatrix(alternatives, criteria);
            validateDecisionMatrix(decisionMatrix, criteria);
            // MER-02: Normalize Decision Matrix
            const normalizedMatrix = calculateNormalizedMatrix(decisionMatrix, criteria, 1e-10);
            validateNormalizedMatrix(normalizedMatrix);
            // MER-03: Calculate Overall Performance
            const overallPerformances = calculateOverallPerformance(normalizedMatrix, 1e-10);
            validateOverallPerformance(overallPerformances);
            // MER-04: Calculate Removal Performance
            const removalPerformances = calculateRemovalPerformance(normalizedMatrix, 1e-10);
            validateRemovalPerformance(removalPerformances);
            // MER-05: Calculate Absolute Deviations
            const absoluteDeviations = calculateAbsoluteDeviations(overallPerformances, removalPerformances);
            validateAbsoluteDeviations(absoluteDeviations);
            // MER-06: Calculate Final Weights
            const finalWeights = calculateFinalWeights(absoluteDeviations);
            validateFinalWeights(finalWeights);
            return finalWeights;
        }
        finally {
            // Restore console output
            console.log = originalConsoleLog;
            console.warn = originalConsoleWarn;
        }
    }

    exports.calculateMerecWeights = calculateMerecWeights;
    exports.default = calculateMerecWeights;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
