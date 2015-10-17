var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
var qs = require('qs');
var fmt = require('d3-format');

var config = require('../src/app-config'),
    metrics = config.metrics,
    importance = config.importance;



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
      <div className="mb3">
        Ranking includes:&nbsp;
        {
          criteria.map(function(c, i) {
            return (
              <span key={c.metric}>
                {metrics[c.metric].display}
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


var Table = React.createClass({
  render: function() {
    var colleges = this.props.colleges,
        inputs = this.props.inputs,
        cols = Object.keys(inputs);

    if (!colleges || 
        colleges.length == 0 || 
        cols.length == 0) 
    {
      return null;
    };

    var w1 = cols.length == 1 ? 50 : 40,
        w2 = (100 - 5 - w1) / cols.length;

    return (
      <section>
      <div className="overflow-scroll mb4">
        <table className="table-light rounded">
          <thead>
            <tr>
              <th style={{width: '5%'}}>#</th>
              <th style={{width: w1 + '%'}}>College</th>
              {
                cols.map(function(col) {
                  return (
                    <th key={col} style={{width: w2 + '%'}}>
                      {metrics[col].display}
                    </th>
                  )
                })
              }
            </tr>
          </thead>
          <tbody>
          {
            colleges.map(function(college, i) {
              return (
                <tr key={college.UNITID}>
                  <td>{i + 1}</td>
                  <td>{college.INSTNM}</td>
                  {
                    cols.map(function(col) {
                      var fmt = metrics[col].fmt;
                      return (
                        <td key={college.UNITID + '-' + col}>
                          {fmt(college[col])}
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
      <p>
        A note about the data and methodology. We filtered for schools where the 
        predominant degree granted is a four-year bachelor's degree. We also 
        filter out trade-specific schools and religious programs like seminaries 
        and yeshivas. There are also a few limitations to the income data that 
        the government released. Incomes reported in the data set include only 
        students who took out federal loans from the government. Each 
        institution's score is based on a weighted sum of z-scores for 
        each variable mentioned in the list. Ratings cannot be compared 
        across lists.
      </p>
      </section>
    )
  }
});



var App = React.createClass({
    getInitialState: function(){
        return { 
          inputs: {},
          colleges: [],
          criteria: [],
        };
    },

    componentWillMount: function() {
      this.updateUrl = _.debounce(this.updateUrl, 200);

      var inputs = {};
      Object.keys(metrics).forEach(function(m) { 
        inputs[m] = 0; 
      });
      this.setState({ inputs: inputs });
    },

    componentDidMount: function() {
      this.fetchColleges();
      this.getUrlParams();
    },

    fetchColleges: function() {
      var self = this,
          url = 'college-data/data-clean/college-data.json';

      $.getJSON(url, function(data) {
        self.setState({ colleges: data });
        self.updateRankCriteria();
      });
    },

    getUrlParams: function() {
      if (typeof window !== 'undefined') {
        var params = window.location.search.replace(/^\?|\/$/g, ''),
            params_obj = qs.parse(params);
            
        var inputs = this.state.inputs,
            possible_vals = _.keys(importance).map(Number);

        _.forEach(params_obj, function(v, k) {
          var num = parseInt(v);
          if (_.isFinite(inputs[k]) && 
              _.isFinite(num) && 
              _.includes(possible_vals, num)) {
            inputs[k] = num;
          }
        });

        this.setState({ inputs: inputs });
        this.updateRankCriteria();
      }
    },

    updateUrl: function() {
      var inputs = this.state.inputs,
          active_inputs = _.pick(inputs, function(v, k) { return v > 0; }),
          params = qs.stringify(active_inputs);

      window.history.pushState(this.state, '', '?' + params);
    },

    changeInput: function(e) {
      var target = e.target.getAttribute('data-input'),
          inputs = this.state.inputs;

      inputs[target] = parseInt(e.target.value);

      this.setState({ inputs: inputs });
      this.updateRankCriteria();
    },

    updateRankCriteria: function() {
      var inputs = this.state.inputs,
          total = 0,
          criteria = [];

      var filtered_inputs = _.keys(_.pick(inputs, function(v, k) { 
        return v > 0;
      })).sort();

      filtered_inputs.forEach(function(key) {
        total += inputs[key];
      });

      filtered_inputs.forEach(function(i) {
        criteria.push({
          metric: i,
          perc: inputs[i] / total
        });
      });

      this.updateCollegeScore(criteria);
    },

    updateCollegeScore: function(criteria) {
      var colleges = this.state.colleges;

      colleges.forEach(function(college) {
        var val = 0;
        criteria.forEach(function(d) {
          val += (college[d.metric + '_z'] * d.perc);
        });
        college.score = val;
      });

      colleges = _.sortByOrder(colleges, 'score', 'desc');

      this.setState({ 
        colleges: colleges,
        criteria: criteria
      }, this.updateUrl);
    },

    render: function() {
      var self = this;

      var inputs = this.state.inputs,
          input_groups = _.chunk(Object.keys(inputs), 3);

      var active_inputs = _.pick(inputs, function(v, k) { return v > 0; }),
          colleges = this.state.colleges.slice(0, 25);

      return (
        <div>
          <form onSubmit={this.handleSubmit}>
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
                              <small className='gray'>{importance[val]}</small>
                            </label>
                            <input type='range' value={val}
                              min='0' max='3'
                              onBlur={self.changeInput}
                              onChange={self.changeInput}
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
          <Formula criteria={this.state.criteria} />
          <Table colleges={colleges} inputs={active_inputs} />
        </div>
      )
    }
});



module.exports = App
