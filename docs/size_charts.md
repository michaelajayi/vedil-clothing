# Vedil Clothing Size Charts

This document contains the size chart information provided by Vedil Clothing.

All measurements are in **inches**.

The original size chart images supplied by the business should be treated as the visual source material. This document provides the same information in a text-readable format for implementation and reference.

---

# Women's Size Chart

All measurements are in inches.

| Size | Bust (in) | Waist (in) | Hip (in) |
|---|---:|---:|---:|
| 8 | 34 | 28 | 36 |
| 10 | 36 | 30 | 38 |
| 12 | 38 | 32 | 40 |
| 14 | 40 | 34 | 42 |
| 16 | 42 | 36 | 44 |
| 18 | 44 | 38 | 46 |
| 20 | 46 | 40 | 48 |
| 22 | 48 | 42 | 50 |
| 24 | 50 | 44 | 52 |
| 26 | 52 | 46 | 54 |

## How to Measure

### Bust

Measure around the fullest part of your bust, keeping the tape comfortable and level.

### Waist

Measure around the natural waistline, which is the smallest part of your waist.

### Hip

Measure around the fullest part of your hips.

## Fit Recommendation

If you are between two sizes, we recommend choosing the larger size for a more comfortable fit.

---

# Men's Size Chart

All measurements are in inches.

| Size | Chest (in) | Waist (in) |
|---|---:|---:|
| XS | 34–35 | 28–29.5 |
| S | 36–37.5 | 30–31.5 |
| M | 38–40 | 32–34 |
| L | 41–44 | 35–38 |
| XL | 45–48 | 39.5–41 |
| 2XL | 49–52 | 41.5–43.5 |
| 3XL | 53–56 | 44–46 |
| 4XL | 57–60 | 46.5–48 |
| 5XL | 61–64 | 48.5–51 |
| 6XL | 65–67 | 52–54 |

## How to Measure

### Chest

Measure around the fullest part of your chest, keeping the tape level around your body.

### Waist

Measure around your natural waistline, which is the smallest part of your waist.

## Fit Recommendation

If you are between two sizes, we recommend choosing the larger size for a more comfortable fit.

---

# Men's Trousers Size Chart

All measurements are in inches.

| Size | Waist (in) | Hip (in) | Trouser Length (in) |
|---|---:|---:|---:|
| XS | 25–26 | 33–34 | 40 |
| S | 27–28 | 35–36 | 41 |
| M | 29–30 | 39–40 | 41 |
| L | 31–32 | 41–42 | 41 |
| XL | 35–36 | 45–46 | 41 |
| 2XL | 37–38 | 47–48 | 41 |
| 3XL | 39–40 | 49–50 | 42 |
| 4XL | 41–42 | 51–52 | 43 |
| 5XL | 44–45 | 53–54 | 43 |
| 6XL | 47–48 | 55–56 | 44 |
| 7XL | 47–48 | 55–56 | 44 |
| 8XL | 47–48 | 55–56 | 44 |

## How to Measure

### Waist

Measure around the natural waistline, where you wear your pants.

### Hip

Measure around the fullest part of your hips.

### Trouser Length

Measure from the waist down to your desired length.

## Fit Recommendation

If you are between two sizes, we recommend choosing the larger size for a more comfortable fit.

---

# Kiddies Size Chart

All measurements are in inches.

| Size | Chest (in) | Waist (in) | Hip (in) | Shirt Length (in) | Dress Length (in) |
|---|---:|---:|---:|---:|---:|
| 1 | 20 | 19 | 21 | 16 | 22 |
| 2 | 21 | 20 | 22 | 18 | 24 |
| 3 | 22 | 21 | 23 | 20 | 25 |
| 4 | 22.5 | 21 | 24 | 24 | 28 |
| 5 | 23 | 22 | 25 | 24.5 | 30 |
| 6 | 24 | 23 | 26 | 26 | 32 |
| 7 | 26 | 24 | 27 | 28 | 35 |
| 8 | 27.5 | 25 | 28 | 31 | 41 |
| 9 | 28 | 26 | 29 | 33 | 48 |
| 10 | 29 | 27 | 30 | 33 | 48 |

## How to Measure

### Chest

Measure around the fullest part of the chest.

### Waist

Measure around the natural waistline.

### Hip

Measure around the fullest part of the hips.

### Length

Measure from the highest point of the shoulder down.

## Fit Recommendation

If you are between two sizes, we recommend choosing the larger size for a more comfortable fit.

---

# Implementation Notes

- All measurements are in inches.
- The size chart data should be represented as structured, accessible content rather than as images.
- The original supplied images should not be used as the primary website representation of the size charts.
- The implementation should support different chart structures, because the four charts do not have identical measurement columns.
- Measurement instructions should be associated with the relevant chart.
- The size chart experience should work well on desktop and mobile devices.
- Tables with more columns must remain readable on smaller screens.
- The implementation should follow the existing Vedil Clothing website's visual and architectural patterns where appropriate.

---

# Items Requiring Business Confirmation

The following values should be confirmed with the business owner before treating the implementation as final:

1. The Men's Trousers chart lists identical values for 6XL, 7XL, and 8XL:

   - Waist: 47–48
   - Hip: 55–56
   - Trouser Length: 44

   Confirm that these values are intentional.

2. Confirm what the Kiddies sizes 1–10 represent.

   Do they represent:

   - ages,
   - garment sizes,
   - or an internal Vedil Clothing sizing system?

   The website should not label these as ages unless confirmed.

3. Confirm that the newly supplied Women's Size Chart replaces the previous Women's Size Chart currently displayed on the website.

4. Confirm whether all products within each category should use the same size chart or whether some individual products require different measurements.