import { renderApp } from "./App";
import { State } from "./types/StateTypes";
import initialState, { getRandomProfile } from "./initialState";
import eventHandlers, { Event } from "./eventHandlers";

let state = initialState;



//global.emitEvent("staticCount");
global.emitEvent = (eventName: Event, param?: any) => {
  const eventHandler = eventHandlers[eventName];
  console.log("emitting event: ", eventName);
  state = eventHandler(state, param);
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

