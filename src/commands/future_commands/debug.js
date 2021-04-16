// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const db = require("../../core/db");
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");

// -------------------------------
// debug varible command handler
// -------------------------------

const debug = function debug (data)
{

   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "on")
   {

      console.log(`DEBUG: debug variable ${commandVariable1}`);
      return db.updateWebhookVar(
         data.message.channel.guild.id,
         // This would be the Webhook ID
         commandVariable1,
         // this would be the Webhook Token
         commandVariable1,
         true,
         function error (err)
         {

            if (err)
            {

               return logger("error", err, "command", data.message.guild.name);

            }
            const outputgh =
            "**```Start Debug mode```**\n" +
            `Debug mode has been Started. \n` +
            `Error Logs will be output to this channel \n\n`;
            data.color = "info";
            data.text = outputgh;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
      );

   }
   else if (commandVariable1 === "off")
   {

      console.log(`DEBUG: debug variable ${commandVariable1}`);
      return db.removeWebhook(
         data.message.channel.guild.id,
         function error (err)
         {

            if (err)
            {

               return logger("error", err, "command", data.message.guild.name);

            }
            const outputoc =
          "**```Stop Debug mode```**\n" +
          `Debug mode has been Stopped. \n` +
          `Error logs will not be shown.\n\n`;
            data.color = "info";
            data.text = outputoc;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
      );

   }

   data.color = "error";
   data.text =
      `:warning:  **\`${commandVariable1
      }\`** is not a valid debug option.\n`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -----------------------
// Command code
// -----------------------

module.exports = function run (data)
{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   Override: if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {

      if (data.message.isAdmin === false)
      {

         data.color = "warn";
         data.text = ":cop:  This command is reserved for server admins.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
      break Override;

   }
   // --------------------------------
   // Error if debug param is missing
   // --------------------------------

   if (!data.cmd.params)
   {

      data.color = "error";
      data.text =
         ":warning:  Missing `debug` parameter. Use `" +
         `${data.config.translateCmdShort} help debug\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return debug(data);

};
