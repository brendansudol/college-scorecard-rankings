var React = require('react');



var Footer = React.createClass({
  render: function() {
    return (
      <footer className="mt4 py2 border-top">
        <a className="right h6 black bold" href="#">GitHub</a>
        <p className="h6 mb0">
          Made by <a className="black bold" href="#">brensudol</a>
        </p>
      </footer>
    )
  }
});


module.exports = Footer