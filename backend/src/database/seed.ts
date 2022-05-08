import "dotenv/config";
import { Sequelize, DataTypes } from "sequelize";
import { db, User,Profile } from "./models";


const userSeedData = [
  { email: "test@gmail.com", password: "123456" },
  { email: "test2@email.com", password: "password" },
];

const ProfileSeedData=[
  {name:"Test name1",imageURL:"https://loremflickr.com/320/240"},
  {name:"Test name2",imageURL:"https://loremflickr.com/320/240"},
];

const seed = async () => {
  console.log("Beginning seed");

  // force true will drop the table if it already exists
  // such that every time we run seed, we start completely fresh
  await User.sync({ force: true });
  console.log('User Tables have synced!');
  await Profile.sync({force:true});
  console.log('Profile Tables have synced!');

  await User.bulkCreate(userSeedData, { validate: true })
    .then(() => {
      console.log('Users created');
    }).catch((err) => {
      console.log('failed to create seed users');
      console.log(err);
    });
  
  await User.create({ email: "athirdemail@aol.com", password: "123456" })
    .then(() => {
      console.log("Created single user");
    })
    .catch((err) => {
      console.log('failed to create seed users');
      console.log(err);
    })

    await Profile.bulkCreate(ProfileSeedData, { validate: true })
    .then(() => {
      console.log('Profile created');
    }).catch((err) => {
      console.log('failed to create seed Profile');
      console.log(err);
    });
  
  await Profile.create({ name: "testname3", imageURL:"https://loremflickr.com/320/240" })
    .then(() => {
      console.log("Created single profile");
    })
    .catch((err) => {
      console.log('failed to create seed profile');
      console.log(err);
    })
    .finally(() => {
      db.close();
    });

};

seed();
