# Canvas Sorting Visualizer

> ⚠️ **Seizure Warning**: This visualizer contains rapidly flashing colors and lights. Viewer discretion is advised for people with photosensitive epilepsy or similar conditions.

**[Live Demo](https://lau-luna.github.io/canvas-sorting-visualizer/)**

A sorting algorithm visualizer written in JavaScript, rendered via HTML Canvas.

It works by generating a random array of integers within a configurable range. Each integer is represented as a vertical bar whose height corresponds to its value. Bars are also colored along the visible light spectrum, scaled to the array's value range.

Highlighted bars (shown in pink or white) represent elements currently being accessed or modified by the algorithm. After each sort completes, a sequential check animation runs to visually confirm the array is sorted.

The visualization speed and steps per frame are automatically adjusted based on the selected algorithm and array size, so the sorting process is always easy to follow regardless of how large or small the array is.

Each run displays a live count of comparisons and array accesses performed by the algorithm.

## Screenshots

Colorized mode:
![Colorized](./screenshots/colorized.png)

Decolorized mode:
![Decolorized](./screenshots/decolorized.png)

## Currently Supported Algorithms

1. Bubble Sort
2. Merge Sort
3. Quick Sort
