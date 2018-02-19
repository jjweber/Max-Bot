module.exports = () => {
  const util = require('apex-util');

  const _run = (message) => {
    const disallowedRoles = ['admin', 'armada officers', 'armada officer', 'moderator', 'privateers', 'privateer', 'tester', 'crew', 'fleet officer', '@everyone'];
    


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
        action: (message, ctrl, msg) => {

          const chnls = message.guild.channels;
          // console.log("Channels: ", chnls);

          console.log(message.channel.name);
          let channelNames = [];
          let messageContent = String;
          messageContent = message.content;
          console.log("Content: ", messageContent);

          chnls.map((channel) => {
            console.log("Checking for " + channel.name + " in " + messageContent);
            if(channel.type === "text" && (messageContent.indexOf(channel.name) > 0)) {
              console.log("WILL DO SEND!");
              console.log(msg);
              channel.send("IT WORKS");
            } 
            // if(channel.name === 'bot_spam') channel.send(messageContent);

            /*
            console.log("channel: ", channel);
            s

            for(let i = 0; i < channelNames.length; i++) {
              const cn = channelNames[i];

              console.log("Comparing " + cn.name + " to " + channel.name);
              if (cn.name === channel.name) {
                channel.send(messageContent);
              }
              else {
                console.log("This channels name was not in the string");
              }              
            }
            */
            // channel.send("TEST");
          });    

          console.log("Channel details: ", channelNames);

          /*
          const messageParts = msg;

          console.log("msg: ", msg);

          const msgContent = message.content;
          console.log("Message Content: ", msgContent);

          console.log("Message Parts array: ", messageParts);
          
          const channelMsgInput = msg.parsed[1];
          const channelNameInput = msg.parsed[2];

          console.log("Message for this channel: ", channelMsgInput);
          console.log("NEW Channel Name given: ", channelNameInput);

          

          message.channel.send('My Message');

          const channels = message.channel.server;
          console.log("Channels: ", channels);

          */

          /*
          const channelNameAndMsg = message.guild.roles.find('name', msg.parsed[1]);
          console.log('Message: ', message);
          console.log("Ctrl: ", ctrl);
          console.log("Msg: ", msg);
          util.log('Your input for this was. Message:  ', message);
          */
          /*
          message.guild.roles.map((role) => {
              if (!disallowedRoles.includes(role.name.toLowerCase())) {
              return roles.push(role.name);
              }
              return role.name;
          });
          */
          return 'Take the channel name given and send a message to it: \n\n';
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
