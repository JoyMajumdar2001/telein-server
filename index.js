const { Telegraf } = require("telegraf");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const { endpoint, key, databaseId, containerId, containerId2 } = config;
var client, database, container, container2;
const app = express();
const bot = new Telegraf("5258605859:AAFKzQ_E0CcDM8CTJAJ26Py-FkZZ0wUw_6g");

app.use(bodyParser.json());
app.use(cors());

app.get("/login/:id", (req, res) => {
  login(req.params.id, res);
});

app.post('/create/',(req, res) => {
    const newAd = req.body;
    insertUser(newAd).catch(() => {
        res.send({ message: 'Error', key : 2 });
      })
      .then(() => {
        res.send({ message: 'New account created', key : 1 });
      });
  });

bot.start((ctx) => {
  var uidKey = uuidv4();
  var dataJson = {
    tempuid: uidKey,
    tid: ctx.from.id,
    fname: ctx.from.first_name,
    lname: ctx.from.last_name,
  };
  insertTemp(dataJson)
    .catch((error) => {
      console.error(error);
    })
    .then(() => {
      ctx.reply("Click the link to login https://app.telein.com/verify/ " + uidKey);
    });
});

main().then(() => {
  bot.launch();

  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
});

async function main() {
  client = new CosmosClient({ endpoint, key });
  database = await client.database(databaseId);
  container = await database.container(containerId);
  container2 = await database.container(containerId2);
}

async function login(keyid, res) {

  resources = await container2.items
    .query({
      query: "SELECT * from c WHERE c.uid = @Uid",
      parameters: [{ name: "@Uid", value: keyid }],
    })
    .fetchAll();

    var crtAcc = {key : 0, msg : "signup"}

    if(resources.resources.length == 0){
        res.send(crtAcc);
    }
    else{
        res.send(resources.resources[0]);
    }
}

async function insertTemp(jsonData) {
  container.items.create(jsonData);
}

async function insertUser(jsonData) {
    container2.items.create(jsonData);
  }
