import { Event } from "./eventHandlers";
import { Profile, State } from "./types/StateTypes";

function renderCurrentProfile({ currentProfile }: State) {
  // TODO: actions for the buttons
  return `
  <div>
    <img src="${currentProfile.imgUri}"><br/>
    <h2>${currentProfile.name}</h2>
    <div>
      <button onClick="emitEvent('onPassButtonClick')">Pass</button> &nbsp 
      <button onClick="emitEvent('onLikeButtonClick')">Like</button>
    </div>
  </div>`;
}

function renderHistoryProfile(idx: number, profile: Profile) {
  return `
  <div>
    <img src="${profile.thumbUri}"> 
    ${profile.name} &nbsp <button onClick="emitEvent('onUnmatchButtonClick', ${profile.id})">Unmatch</button>
  </div>`;
}

function renderMatchHistory({ likeHistory }: State) {
  return `
  <div>
    <h3>Past matches:</h3>
    ${likeHistory.map((profile, idx) => renderHistoryProfile(idx, profile))}
  </div>`;
}

function renderDoggr(state: State) {
  return renderCurrentProfile(state) + renderMatchHistory(state);
}

export function renderApp(state: State) {
  let header = "<h1>Doggr</h1>";
  return `<div>
    ${header}
    <br/>
    ${renderDoggr(state)}
  </div>`;
}