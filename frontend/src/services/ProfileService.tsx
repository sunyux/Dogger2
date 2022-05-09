import axios from "./HttpService";

export const Profiles_set = {
  async create(profile) {
    return axios.post("/profiles"
      , { name: profile.name, imageURL: profile.imageURL }
    )
    
  }
}