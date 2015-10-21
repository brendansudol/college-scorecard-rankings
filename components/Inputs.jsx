var React = require('react');
var _ = require('lodash');

var config = require('../src/app-config'),
    metrics = config.metrics,
    importance = config.importance;



var Inputs = React.createClass({
  changeHandler: function(e) {
    this.props.onChange(e);
  },

  render: function() {
    var self = this;

    var inputs = this.props.inputs,
        input_groups = _.chunk(Object.keys(inputs), 3);

    return (
      <section>
        <div className="h3 bold mb2">Select the variables and weights to determine ranking:</div>
        <form>
          <div className='fieldset-reset py2'>
            <div className='clearfix mxn3'>
            {
              input_groups.map(function(i_group) {
                return (
                  <div key={i_group} className='clearfix mb2 sm-flex flex-end'>
                  {
                    i_group.map(function(i) {
                      var val = inputs[i];
                      return (
                        <div key={i} className='sm-col sm-col-4 mb2 px3'>
                          <label className='h5 bold block'>
                            {metrics[i].display} <br/>
                            <small className='regular'>{importance[val]}</small>
                          </label>
                          <input type='range' value={val}
                            min='0' max='3'
                            onBlur={self.changeHandler}
                            onChange={self.changeHandler}
                            data-input={i}
                            className='col-12 dark-gray range-light' />
                        </div>
                      );
                    })
                  }
                  </div>
                );
              })
            }
            </div>
          </div>
        </form>
      </section>
    )
  }
});


module.exports = Inputs