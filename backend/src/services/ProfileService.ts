import { db, Profile } from "../database/models";

export function createProfile(req, res) {

  const name = req.body.name;
  const imageURL = req.body.imageURL;
  console.log(`in createprofile with ${name}:${imageURL}`);
  Profile.create({ name, imageURL })
    .then(() => {
      console.log("Created single profile");
      res.status(200).json({ message: "Created profile successfully" });
    })
    .catch((err) => {
      console.log('failed to create profile');
      console.log(err);
      res.status(500).json({ message: err });
    });

}