const React = require("react");
const { Text } = require("react-native");

const Icon = ({ name, testID }) =>
  React.createElement(Text, { testID: testID || `icon-${name}` }, name);

module.exports = {
  Ionicons: Icon,
};
