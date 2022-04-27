import { getRandomProfile } from "./initialState";
import { State, Profile } from "./types/StateTypes";

type UpdateFunction = (state: State, param?: any) => State;

export enum Event {
  onLikeButtonClick = "onLikeButtonClick",
  onPassButtonClick = "onPassButtonClick",
  onUnmatchButtonClick = "onUnmatchButtonClick"
};

type EventHandlerObject = { [key in Event]: UpdateFunction }


const eventHandlers: EventHandlerObject = {
  onLikeButtonClick: (state: State) => {
    const { currentProfile, likeHistory } = state;
    likeHistory.push(currentProfile);
    const newProfile = getRandomProfile();
    return { ...state, currentProfile: newProfile, likeHistory };
  },
  onPassButtonClick: (state) => {
    const { currentProfile, passHistory } = state;
    passHistory.push(currentProfile);
    const newProfile = getRandomProfile();
    return { ...state, currentProfile: newProfile, passHistory };
  },
  onUnmatchButtonClick: (state: State, id: number) => {
    const { currentProfile, likeHistory } = state;
    console.log("Incoming id is");
    console.log(id);

    const newHistory = likeHistory
      .filter((val) => val.id !== id);
    return { ...state, likeHistory: newHistory };
  },
};

export default eventHandlers;