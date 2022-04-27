import { renderApp } from "./App";
import { State } from "./types/StateTypes";

let state: State = {
  name: "Doggr",
  count: 0,
};

let eventHandlers = {
  increaseCount: (oldState) => {
    return { ...oldState, count: oldState.count + 1 };
  },

  decreaseCount: (oldState) => {
    return { ...oldState, count: oldState.count - 1 };
  },
};

//global.emitEvent("staticCount");
global.emitEvent = (eventName) => {
  const eventHandler = eventHandlers[eventName];
  console.log("emitting event: ", eventName);
  state = eventHandler(state);
  render();
};

function render() {
  let html = renderApp(state);
  document.body.innerHTML = html;
}

render();

/*
- Large-ish profile picture of the next match
- Name of the pet
- Pass/Like buttons
- A list of previous pets you Liked
- A button for each to Unmatch
*/

