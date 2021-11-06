/* eslint-disable quotes */
const { Plugin } = require("powercord/entities");
const webpack = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");
let suppress = false;
const Settings = require("./components/settings");

module.exports = class Panikk extends Plugin {
  async startPlugin() {
    const dispatcher = webpack.getModule(["dispatch"], false);
    powercord.api.settings.registerSettings(this.entityID, {
      category: this.entityID,
      label: "Panikk",
      render: Settings,
    });
    dispatcher.addSubscription("STREAM_START", async () => {
      if (!this.settings.get("panikkOnLive", false)) {
        return;
      }
      suppress = true;
      await powercord.shutdown();
      suppress = false;
    });
    dispatcher.addSubscription("STREAM_STOP", async () => {
      if (!this.settings.get("panikkOnLive", false)) {
        return;
      }
      suppress = true;
      await powercord.startup();
      suppress = false;
    });
    document.body.removeEventListener("keyup", this.keyup);
    document.body.addEventListener("keyup", (e) => this.keyup(e, this));
  }

  pluginWillUnload() {
    if (!suppress) {
      document.body.removeEventListener("keyup", this.keyup);
    }
    powercord.api.settings.unregisterSettings(this.entityID);
  }

  async keyup(event, _this) {
    var key = _this.settings.get("keybind", "F5");
    if (event.key === key) {
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
