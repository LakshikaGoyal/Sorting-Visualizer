const container = document.getElementById("array-container");
const speedSlider = document.getElementById("speedSlider");
const comparisonDisplay = document.getElementById("comparison-count");
const swapDisplay = document.getElementById("swap-count");

let array = [];
let comparisons = 0;
let swaps = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getSpeed() {
  return 1001 - speedSlider.value;
}

function updateCounters() {
  comparisonDisplay.textContent = comparisons;
  swapDisplay.textContent = swaps;
}

function generateArray(size = 40) {
  array = [];
  container.innerHTML = "";
  comparisons = 0;
  swaps = 0;
  updateCounters();

  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 300) + 10;
    array.push(value);
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    container.appendChild(bar);
  }
}

function swap(i, j) {
  swaps++;
  updateCounters();
  const bars = document.getElementsByClassName("bar");
  [array[i], array[j]] = [array[j], array[i]];
  bars[i].style.height = `${array[i]}px`;
  bars[j].style.height = `${array[j]}px`;
}

async function startSort() {
  const algo = document.getElementById("algorithm").value;
  switch (algo) {
    case "bubble": await bubbleSort(); break;
    case "selection": await selectionSort(); break;
    case "insertion": await insertionSort(); break;
    case "quick": await quickSort(0, array.length - 1); break;
    case "merge": await mergeSort(0, array.length - 1); break;
  }
  markAllSorted();
}

function markAllSorted() {
  const bars = document.getElementsByClassName("bar");
  for (let bar of bars) {
    bar.classList.remove("active");
    bar.classList.add("sorted");
  }
}

async function bubbleSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;
      updateCounters();
      bars[j].classList.add("active");
      bars[j + 1].classList.add("active");
      if (array[j] > array[j + 1]) {
        await sleep(getSpeed());
        swap(j, j + 1);
      }
      bars[j].classList.remove("active");
      bars[j + 1].classList.remove("active");
    }
  }
}

async function selectionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    bars[minIdx].classList.add("active");
    for (let j = i + 1; j < array.length; j++) {
      comparisons++;
      updateCounters();
      bars[j].classList.add("active");
      await sleep(getSpeed());
      if (array[j] < array[minIdx]) {
        bars[minIdx].classList.remove("active");
        minIdx = j;
        bars[minIdx].classList.add("active");
      } else {
        bars[j].classList.remove("active");
      }
    }
    swap(i, minIdx);
    bars[minIdx].classList.remove("active");
    bars[i].classList.add("sorted");
  }
}

async function insertionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      comparisons++;
      updateCounters();
      await sleep(getSpeed());
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j]}px`;
      j--;
    }
    comparisons++;
    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
  }
}

async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  const bars = document.getElementsByClassName("bar");
  let pivot = array[high];
  let i = low - 1;

  bars[high].classList.add("active");

  for (let j = low; j < high; j++) {
    comparisons++;
    updateCounters();
    bars[j].classList.add("active");
    await sleep(getSpeed());
    if (array[j] < pivot) {
      i++;
      swap(i, j);
    }
    bars[j].classList.remove("active");
  }
  swap(i + 1, high);
  bars[high].classList.remove("active");
  return i + 1;
}

async function mergeSort(l, r) {
  if (l >= r) return;
  const mid = l + Math.floor((r - l) / 2);
  await mergeSort(l, mid);
  await mergeSort(mid + 1, r);
  await merge(l, mid, r);
}

async function merge(l, m, r) {
  const n1 = m - l + 1;
  const n2 = r - m;

  const L = array.slice(l, m + 1);
  const R = array.slice(m + 1, r + 1);

  let i = 0, j = 0, k = l;
  const bars = document.getElementsByClassName("bar");

  while (i < n1 && j < n2) {
    comparisons++;
    updateCounters();
    await sleep(getSpeed());
    if (L[i] <= R[j]) {
      array[k] = L[i];
      bars[k].style.height = `${L[i]}px`;
      i++;
    } else {
      array[k] = R[j];
      bars[k].style.height = `${R[j]}px`;
      j++;
    }
    k++;
  }

  while (i < n1) {
    await sleep(getSpeed());
    array[k] = L[i];
    bars[k].style.height = `${L[i]}px`;
    i++;
    k++;
  }

  while (j < n2) {
    await sleep(getSpeed());
    array[k] = R[j];
    bars[k].style.height = `${R[j]}px`;
    j++;
    k++;
  }
}

generateArray();
