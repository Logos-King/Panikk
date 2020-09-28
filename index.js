// powercord.styleManager.themes.forEach((f) => powercord.styleManager.disable(f.entityID))
const { Plugin } = require("powercord/entities");

module.exports = class Panikk extends Plugin {
  constructor() {
    super();
    this.state = {
      shutted: false,
    };
  }

  async startPlugin() {
    document.body.addEventListener("keyup", this.keyup);
  }

  pluginWillUnload() {
    document.body.removeEventListener("keyup", this.keyup);
  }
  keyup(event) {
    if (event.key == "F5") {
      if (this.state.shutted === false) {
        powercord.shutdown();
        this.state.shutted = true;
      } else {
        powercord.startup();
        this.state.shutted = false;
      }
    }
  }
};
