const { React } = require("powercord/webpack");
const { FormTitle } = require("powercord/components");
const { SwitchItem, RadioGroup } = require("powercord/components/settings");
const KeybindRecorder = require("./KeybindRecorder");
module.exports = class Panikk extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      onLive: this.props.getSetting("panikkOnLive", true),
    };
  }

  render() {
    const { updateSetting, getSetting } = this.props;
    return (
      <>
        <KeybindRecorder
          value={getSetting("keybind", "F5")}
          onChange={(e) => {
            this.setState({ value: e });
            updateSetting("keybind", e);
          }}
          onReset={() => {
            this.setState({ value: "F5" });
            updateSetting("keybind", "F5");
          }}
        >
          Toggle Keybind
        </KeybindRecorder>

        <SwitchItem
          note="Panikk on live"
          value={this.state.onLive}
          onChange={() => {
            this.setState({ onLive: !this.state.onLive });
            this.props.toggleSetting("panikkOnLive");
          }}
        >
          Enable
        </SwitchItem>
      </>
    );
  }
};
