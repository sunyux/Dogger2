import { State } from "./types/StateTypes";

let state: State = {
  name: "Doggr",
  count: 0,
};

global.changeCount = () => {
  state.count += 1;
  render();
};

export function renderApp(state: State) {
  return `<p onClick="changeCount()">You've clicked ${state.count} times.</p>`;
}

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