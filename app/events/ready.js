const { Events } = require("discord.js");
const profile = require(`${global.projectdir}/config/profile.json`);

// in miliseconds
const PRESENCE_INTERVAL = 5000;

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(
      `[LOG] Logged in as ${client.user.tag} in ${process.env.NODE_ENV} mode`
    );

    // tracks currently displayed presence index
    // randomize on start
    let presenceIndex = Math.floor(Math.random() * profile.presences.length);

    // define presence handler ...
    const switchPresence = () => {
      client.user.setPresence(profile.presences[presenceIndex]);

      presenceIndex++;
      // go back to the first one if reached the end
      if (presenceIndex === profile.presences.length) {
        presenceIndex = 0;
      }
    };
    switchPresence(); // ... and invoke it to see the presence immidiately

    // change bot presence every PRESENCE_INTERVAL miliseconds
    setInterval(switchPresence, PRESENCE_INTERVAL);
  },
};
