"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Relevant links:
// - Step-by-step guide https://goo.gl/sz7kRF
// - This pen https://goo.gl/98wWXr
// - Complete example https://goo.gl/aYazLi (DON'T CHEAT! xD)
// - Server source code https://goo.gl/g2dcdC (not needed, but you might be interested)

var Topics = function Topics(_ref) {
  var topics = _ref.topics;
  var setTopic = _ref.setTopic;
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h4",
      null,
      "Click on a topic..."
    ),
    React.createElement(
      "ul",
      null,
      topics.map(function (topic) {
        return React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { href: "#", onClick: function onClick() {
                return setTopic(topic);
              } },
            topic
          )
        );
      })
    )
  );
};

var Messages = function Messages(_ref2) {
  var messages = _ref2.messages;
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h4",
      null,
      "Here's what people are saying..."
    ),
    React.createElement(
      "ul",
      { className: "list-group" },
      messages.map(function (message) {
        return React.createElement(
          "li",
          { className: "list-group-item" },
          message
        );
      })
    )
  );
};

var Input = function Input(_ref3) {
  var sendMessage = _ref3.sendMessage;
  return React.createElement(
    "form",
    { onSubmit: function onSubmit(event) {
        var form = event.target;
        sendMessage(form.elements.message.value);
        form.reset();
        event.preventDefault();
      } },
    React.createElement("input", { name: "message", className: "form-control", placeholder: "Say something interesting (and not gross)..." })
  );
};

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = { messages: [], topics: ['Classes', 'Leo and Una', 'The Fountain', 'fashion', 'walking while texting', 'various smells'] };
    _this.socket = new Phoenix.Socket('wss://dreadful-spider-42903.herokuapp.com/socket');
    _this.socket.connect();
    return _this;
  }

  App.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    fetch('https://dreadful-spider-42903.herokuapp.com/topics');
    fetch().then(function (response) {
      return response.json();
    }).then(function (json) {
      return _this2.setState({ topics: json.data });
    });
  };

  App.prototype.setTopic = function setTopic(topic) {
    var _this3 = this;

    if (this.channel) {
      this.channel.leave();
    }

    this.channel = this.socket.channel("chat:" + topic);
    this.channel.join();
    this.channel.on('shout', function (_ref4) {
      var data = _ref4.data;
      return _this3.receiveMessage(data);
    });
    this.receiveMessage("Joining " + topic + "...");
  };

  App.prototype.receiveMessage = function receiveMessage(message) {
    this.setState(function (_ref5) {
      var messages = _ref5.messages;
      return { messages: messages.concat(message) };
    });
  };

  App.prototype.sendMessage = function sendMessage(message) {
    this.channel.push('shout', { data: message });
  };

  App.prototype.render = function render() {
    var _this4 = this;

    return React.createElement(
      "div",
      null,
      React.createElement(Topics, { topics: this.state.topics, setTopic: function setTopic(topic) {
          return _this4.setTopic(topic);
        } }),
      React.createElement(Messages, { messages: this.state.messages }),
      React.createElement("hr", null),
      React.createElement(Input, { sendMessage: function sendMessage(message) {
          return _this4.sendMessage(message);
        } })
    );
  };

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));