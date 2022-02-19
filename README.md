# Telein Server
This is the backend of [TeleIn](https://github.com/JoyMajumdar2001/TeleIn-Android) Android App.
The backend server is based on NodeJs and it uses [Telegraf](https://telegraf.js.org/) to make conection with Telegram Bot.
This backend is hosted on [Render](https://render.com/).

## Code snippets
``` javascript

async function login(keyid, res) {

  resourcesMain = await container.items
    .query({
      query: "SELECT * from c WHERE c.tempuid = @Uid",
      parameters: [{ name: "@Uid", value: keyid }],
    })
    .fetchAll();

  resources = await container2.items
    .query({
      query: "SELECT * from c WHERE c.tid = @Tid",
      parameters: [{ name: "@Tid", value: resourcesMain.resources[0].tid }],
    })
    .fetchAll();

    if(resources.resources.length == 0){
        var crtAcc = {
            key : 0, 
            msg : "signup",
            uid : resourcesMain.resources[0].tempuid,
            tid : resourcesMain.resources[0].tid,
            fname : resourcesMain.resources[0].fname,
            lname : resourcesMain.resources[0].lname
        }
        res.send(crtAcc);
    }
    else{
        res.send(resources.resources[0]);
    }
}

```

``` javascript

const bot = new Telegraf("5258605859:AAFKzQ_E0CcDM8CTJAJ26Py-FkZZ0wUw_6g");

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
      ctx.reply("Click the link to login https://app.telein.com/verify/" + uidKey);
    });
});

```


## Used Tech
1. **Telegraf**
2. **Telegram Bot**
3. **Render**
4. **uuid Package**
