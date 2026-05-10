import { initVisualizer } from '../../visualizer.js';
import { state } from '../../state.js';
import { sort, sortName, adjustDelayAndSteps } from '../../algos/merge/mergeSort.js';

state.sortName = sortName;

window.onload = function() {
  adjustDelayAndSteps();
  initVisualizer(sort, adjustDelayAndSteps);
}
