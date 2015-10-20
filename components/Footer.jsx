var React = require('react');



var Footer = React.createClass({
  render: function() {
    return (
      <footer className="mt4 py2 border-top">
        <a className="right h6 black bold" href="https://github.com/brendansudol/college-scorecard-rankings">GitHub</a>
        <p className="h6 mb0">
          Made by <a className="black bold" href="https://twitter.com/brensudol">brensudol</a>
        </p>
      </footer>
    )
  }
});


module.exports = Footer