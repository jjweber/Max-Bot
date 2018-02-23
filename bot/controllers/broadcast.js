module.exports = () => {
  const Discord = require('discord.js');
  const util = require('apex-util');

  const _run = (message) => {
    
    const ctrls = [
      {
        cmd: '!broadcastMsg',
        example: '!broadcastMsg',
        title: 'Broadcast A Message',
        desc: 'Broadcast a message to a specified channel.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'dm',
        action: (message) => {
          // Channels in my guild
          const chnls = message.guild.channels;
          
          // String provided
          const messageContent = message.content;
          util.log('Getting Message Content: ', messageContent, 4);

          // Breaking string up into part to send and part to remove
          const dissectedMessage = messageContent.split('~');
          const commandPortionOfMsg = dissectedMessage[0];
          const portionOfMsgToSend = dissectedMessage[1];

          // Role check variables
          const acceptableRoles = ['Admin', 'admin', 'officer'];
          let isValidRole = false;

          // Looping through the array of acceptable roles.
          acceptableRoles.map((role) => {
            util.log('Checking if role is allowed to send message', role, 4);

            // Comparing users active roles against this acceptable role iteration. 
            const modRole = message.guild.roles.find('name', role);

            // If the role matches then an id will be present.
            if (message.member.roles.has(modRole.id)) {
              util.log('This is the role that was found on line 39: ', modRole, 4);

              // If id exists the isValidRole will become true.
              isValidRole = true;
            } else {

              // isValidRole remains false.
              return;
            }
          })

          // Checking if user has a valid role to use command.
          if (isValidRole === true) {

            // Looping through the channels.
            chnls.map((channel) => {
              util.log('Checking if channel name is in string', channel, 4);

              // Checking if channel is text and if it is found in the string.
              if(channel.type === "text" && (messageContent.indexOf(channel.name) > 0)) {
                  util.log('These Channels Where Found In The String: ', channel.name, 4);

                  // If channel is in string it will send the message part of the string.
                  channel.send('"' +  portionOfMsgToSend + '"').catch(console.error);
              } 

            });

          } else {
            // If user role is not allowed max will return a reply to user that they do not have permission to use.
            return message.reply('You do not have the permission to use this command!').catch(console.error);
          }
          // If valid message was sent max will return direct message with the successfully sent message.
          return 'This is the message that was sent: ' + portionOfMsgToSend + '\n\n';
        }
      },
    ];

    const onSuccess = (message, res, ctrl) => {
      if (res !== null) {
        if (ctrl.resType === 'reply') {
          return message.reply(res);
        } else if (ctrl.resType === 'dm') {
          return message.author.send(res);
        }
      }
      // Fail Safe
      return false;
    };

    const onError = message => message.reply('I Broke... Beep...Boop...Beep');
    
    const messageMiddleware = (message) => {
      const container = {};
      container.parsed = message.content.split(' ');
      const msg = Object.assign(message, container);
      return msg;
    };

                                                                                                                                                                                                                                                              
    ctrls.map((ctrl) => {
      util.log('Running through controller', ctrl.cmd, 2);

      const msg = messageMiddleware(message);
      if (msg.parsed[0].toLowerCase() === ctrl.cmd.toLowerCase()) {
        util.log('!!! Matched Ctrl to Cmd !!!', ctrl.cmd, 2);

        // Ensure the communication is happening on a server
        if (!ctrl.allowInDM) {
          if (!message.guild) return onError(message, 'Please don\'t use this command directly. Instead use it in a channel on a server. :beers:');
        }

        // Do Stuff
        const res = ctrl.action(message, ctrl, msg);
        if (res) {
          onSuccess(message, res, ctrl);
        } else {
          onError(message, res, ctrl);
        }
      }
      return ctrl;
    });
  };

  return {
    run: _run,
  };
};
