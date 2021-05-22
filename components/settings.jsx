const { React } = require("powercord/webpack");
const { FormTitle } = require("powercord/components");
const { SwitchItem, RadioGroup } = require("powercord/components/settings");

module.exports = class Panikk extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      onLive: this.props.getSetting("panikkOnLive", true)
    };
  }

  render() {
    return (
      <>
        <SwitchItem
          note='Panikk on live'
          value={this.state.onLive}
          onChange={() => {
            this.setState({ onLive: !this.state.onLive });
            this.props.toggleSetting("panikkOnLive");
          }}>
          Enable
        </SwitchItem>
      </>
    );
  }
};
