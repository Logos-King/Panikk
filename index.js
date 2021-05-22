/* eslint-disable quotes */
const { Plugin } = require("powercord/entities");
const webpack = require("powercord/webpack");
let suppress = false;
const Settings = require("./components/settings");
module.exports = class Panikk extends Plugin {
  async startPlugin() {
    const dispatcher = webpack.getModule(["dispatch"], false);
    powercord.api.settings.registerSettings(this.entityID, {
      category: this.entityID,
      label: "Panikk",
      render: (props) =>
        webpack.React.createElement(Settings, {
          main: this,
          ...props
        })
    });
    dispatcher.subscribe("STREAM_START", async () => {
      if (!this.settings.get("panikkOnLive", false)) {
        return;
      }
      suppress = true;
      await powercord.shutdown();
      suppress = false;
    });
    dispatcher.subscribe("STREAM_STOP", async () => {
      if (!this.settings.get("panikkOnLive", false)) {
        return;
      }
      suppress = true;
      await powercord.startup();
      suppress = false;
    });
    document.body.removeEventListener("keyup", this.keyup);
    document.body.addEventListener("keyup", this.keyup);
  }

  pluginWillUnload() {
    if (!suppress) {
      document.body.removeEventListener("keyup", this.keyup);
    }
  }

  async keyup(event) {
    if (event.key === "F5") {
      if (powercord?.api?.settings?.ready === true) {
        suppress = true;
        await powercord.shutdown();
        suppress = false;
      } else {
        suppress = true;
        await powercord.startup();
        suppress = false;
      }
    }
  }
};
