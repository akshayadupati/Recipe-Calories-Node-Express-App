const express = require("express");
const path = require("path");
const request = require("request");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

let recipeList = [];
let caloryList = [];

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/recipe", (req, res) => {
  res.render("recipe", { title: "Recipe", recipeList: recipeList });
});

app.get("/calory", (req, res) => {
  res.render("calory", { title: "Calory", caloryList: caloryList });
});

app.get("/errorrecipe", (req, res) => {
  res.render("errorrecipe", { title: "Error" });
});

app.get("/errorcalory", (req, res) => {
  res.render("errorcalory", { title: "Error" });
});

app.post("/ingredient", (req, res) => {
  let ingredient = req.body.ingredient;
  if (ingredient) {
    const options = {
      url: `https://api.api-ninjas.com/v1/recipe?query=${ingredient}`,
      method: "GET",
      headers: {
        "X-API-KEY": "OX19PkpPdGhbCCHT0eFkMw==ShnqftEtyYqQXE2V",
      },
    };
    request(options, (err, response, body) => {
      const apiResponse = JSON.parse(response.body);
      recipeLists(apiResponse);
      if (recipeList.length > 0) {
        res.redirect("/recipe");
      } else {
        res.redirect("/errorrecipe");
      }
    });
  } else {
    res.redirect("/errorrecipe");
  }
});

app.post("/calories", (req, res) => {
  const options = {
    url: `https://api.api-ninjas.com/v1/nutrition?query=${req.body.title}`,
    header: "GET",
    headers: {
      "X-API-KEY": "OX19PkpPdGhbCCHT0eFkMw==ShnqftEtyYqQXE2V",
    },
  };
  request(options, (err, response, body) => {
    const caloryResponse = JSON.parse(response.body);
    caloryLists(caloryResponse);
    if (caloryList.length > 0) {
      res.redirect("/calory");
    } else {
      res.redirect("/errorcalory");
    }
  });
});
app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});

function recipeLists(recipe) {
  recipeList = [];
  recipe.map((recipe) => {
    recipeList.push(recipe);
  });
}

function caloryLists(calory) {
  caloryList = [];
  calory.map((eachCalory) => {
    eachCalory.name = caloryName(eachCalory.name);
    caloryList.push(eachCalory);
  });
}

function caloryName(title) {
  const caloryTitle = title.split(" ");

  for (let i = 0; i < caloryTitle.length; i++) {
    caloryTitle[i] = caloryTitle[i][0].toUpperCase() + caloryTitle[i].substr(1);
  }

  return caloryTitle.join(" ");
}
