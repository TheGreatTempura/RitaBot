// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const langCheck = require("../../core/lang.check");
const translate = require("../../core/translate");
const fn = require("../../core/helpers");
const logger = require("../../core/logger");
const countryLangs = require("../../core/country.langs");

// ----------------------------------------------------
// Translate a message through discord reaction (flag)
// ----------------------------------------------------

module.exports = function run (data, client)
{

   // ---------------------
   // Get country by emoji
   // ---------------------

   const emoji = data.emoji.name;

   if (Object.prototype.hasOwnProperty.call(
      emoji && countryLangs,
      emoji
   ))
   {

      // ------------------------------------------------
      // Stop proccessing if country has no langs / null
      // ------------------------------------------------

      if (!countryLangs[emoji].langs)
      {

         return;

      }

      // -----------------
      // Get message data
      // -----------------

      fn.getMessage(
         client,
         data.message_id,
         data.channel_id,
         data.user_id,
         (message, err) =>
         {

            if (err)
            {

               return logger(
                  "error",
                  err,
                  "command",
                  data.message.guild.name
               );

            }

            // ignore bots

            if (message.author.bot)
            {

               return;

            }

            const flagExists = message.reactions.get(emoji);

            // prevent flag spam

            if (flagExists)
            {

               return;

            }

            // translate data

            data.translate = {
               from: langCheck("auto"),
               multi: true,
               original: message.content,
               to: langCheck(countryLangs[emoji].langs)
            };

            // message data

            data.message = message;
            delete data.message.attachments;
            data.message.roleColor = fn.getRoleColor(data.message.member);
            data.canWrite = true;

            // ------------------
            // Start translation
            // ------------------

            translate(data);

         }
      );

   }

};
