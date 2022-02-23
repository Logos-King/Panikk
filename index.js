/* eslint-disable quotes */
const { Plugin } = require('powercord/entities');
const { FluxDispatcher: Dispatcher } = require('powercord/webpack');
let suppress = false;
const Settings = require('./components/settings');

module.exports = class Panikk extends Plugin {
  async startPlugin() {
    powercord.api.settings.registerSettings(this.entityID, {
      category: this.entityID,
      label: 'Panikk',
      render: Settings,
    });
    this.handlers = {
      listeners: [['keyup', this.keyup.bind(this)]],
      subscriptions: [
        ['STREAM_START', this.streamStart.bind(this)],
        ['STREAM_STOP', this.streamStop.bind(this)],
      ],
    };
    this.addHandlers();
  }

  pluginWillUnload() {
    if (!suppress) {
      this.removeHandlers();
    }
    powercord.api.settings.unregisterSettings(this.entityID);
  }

  async keyup(event) {
    const key = this.settings.get('keybind', 'F5');
    if (event.key === key) {
      if (powercord?.api?.settings?.ready === true) {
        suppress = true;
        await powercord.shutdown();
        suppress = false;
      } else {
        suppress = true;
        await this.startup();
        suppress = false;
      }
    }
  }
  async startup() {
    this.removeHandlers();
    await powercord.startup();
  }
  async streamStart() {
    if (!this.settings.get('panikkOnLive', false)) {
      return;
    }
    suppress = true;
    await powercord.shutdown();
    suppress = false;
  }
  async streamStop() {
    if (!this.settings.get('panikkOnLive', false)) {
      return;
    }
    suppress = true;
    await this.startup();
    suppress = false;
  }
  async addHandlers() {
    for (let i = 0; i < this.handlers.listeners.length; i++) {
      document.body.addEventListener(this.handlers.listeners[i][0], this.handlers.listeners[i][1]);
    }
    for (let i = 0; i < this.handlers.subscriptions.length; i++) {
      Dispatcher.subscribe(this.handlers.subscriptions[i][0], this.handlers.subscriptions[i][1]);
    }
  }
  async removeHandlers() {
    for (let i = 0; i < this.handlers.listeners.length; i++) {
      document.body.removeEventListener(this.handlers.listeners[i][0], this.handlers.listeners[i][1]);
    }
    for (let i = 0; i < this.handlers.subscriptions.length; i++) {
      Dispatcher.unsubscribe(this.handlers.subscriptions[i][0], this.handlers.subscriptions[i][1]);
    }
  }
};
