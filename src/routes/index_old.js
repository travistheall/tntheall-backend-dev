import { postRouter } from "./Blog";
import {
  mealRouter,
  mealPortionRouter,
  participantRouter,
  servingRouter,
  studyRouter
} from "./DCAP";
import {
  foodRouter,
  foodIngredientRouter,
  foodNutRouter,
  foodPortionRouter
} from "./FNDDS";
import { authRouter, profileRouter } from "./User";

export {
  postRouter,
  mealRouter,
  mealPortionRouter,
  participantRouter,
  servingRouter,
  studyRouter,
  foodRouter,
  foodIngredientRouter,
  foodNutRouter,
  foodPortionRouter,
  authRouter,
  profileRouter
};

let json = {
  "user": {
    "$oid": "613556ab40cac7149da298f8"
  },
  "firstName": "Travis",
  "lastName": "Theall",
  "company": "Alphident",
  "website": "https://www.tntheall.com",
  "jobTitle": "Frontend Developer",
  "skills": ["javascript", "python"],
  "bio": "Frontend React developer",
  "githubusername": "travistheall",
  "social": {
    "youtube": "https://youtube.com/channel/UCg9KyxKowrc9R9kDYvgjZGg",
    "twitter": "https://twitter.com/TheallTravis",
    "instagram": "https://instagram.com/travistheall",
    "linkedin": "https://linkedin.com/in/travis-theall",
    "facebook": "https://facebook.com/travis.theall"
  },
  "address": {
    "address": "8277 Bayou Fountaine Ave",
    "city": "Baton Rouge",
    "state": "LA",
    "zip": 70065
  }
};
