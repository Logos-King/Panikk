const { Plugin } = require("powercord/entities");
let suppress = false;
module.exports = class Panikk extends Plugin {
  async startPlugin() {
    document.body.removeEventListener("keyup", this.keyup);
    document.body.addEventListener("keyup", this.keyup);
  }
  pluginWillUnload() {
      if (!suppress) {
        document.body.removeEventListener("keyup", this.keyup);
      }
  }
  async keyup(event) {
    if (event.key == "F5") {
      if(powercord?.api?.settings?.ready == true) {
        suppress = true
        await powercord.shutdown()
        suppress = false
      } else {
        suppress = true
        await powercord.startup()
        suppress = false
      }
    }
  }
};