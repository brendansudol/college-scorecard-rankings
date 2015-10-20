var React = require('react');



var Header = React.createClass({
  render: function() {
    return (
      <header className='py1 mb3 border-bottom'>
        <div className="h3 bold m0 caps">College Rankings*</div>
        <div className="h4 m0">* Based on ...</div>
      </header>
    )
  }
});


module.exports = Header