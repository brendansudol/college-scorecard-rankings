var React = require('react');
var _ = require('lodash');
var fmt = require('d3-format');

var config = require('../src/app-config'),
    metrics = config.metrics;



var Formula = React.createClass({
  format: function(x) {
    var how = ((x * 100) % 1 === 0) ? '.0%' : '.1%';
    return fmt.format(how)(x);
  },

  render: function() {
    var self = this, 
        criteria = this.props.criteria;

    criteria = _.sortByOrder(criteria, 'perc', 'desc');

    return (
      <div className="mb3 h5">
        <span className="bold">Ranking includes:&nbsp;</span>
        {
          criteria.map(function(c, i) {
            return (
              <span key={c.metric}>
                {metrics[c.metric].display.replace('%', 'Percent')}
                &nbsp;({self.format(c.perc)})
                {i + 1 == criteria.length ? '.' : ', '}
              </span>
            )
          })
        }
      </div>
    )
  }
});


module.exports = Formula