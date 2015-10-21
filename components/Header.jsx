var React = require('react');



var Header = React.createClass({
  render: function() {
    return (
      <header className='py1 mb3 border-bottom'>
        <div className="h3 bold m0 caps">College Rankings*</div>
        <div className="h5 m0">
            * Using the <a target="_blank" href="https://collegescorecard.ed.gov/data/">College Scorecard Data</a>
        </div>
      </header>
    )
  }
});


module.exports = Header