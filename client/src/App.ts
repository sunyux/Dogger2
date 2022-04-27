import { State } from "./types/StateTypes";

export function renderApp(state: State) {
  let name = state.name;
  console.log(name);


  return `<p onClick="emitEvent('increaseCount')">${name} clicked ${state.count} times</p>`;
}