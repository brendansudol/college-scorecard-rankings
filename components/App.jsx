var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
var qs = require('qs');

var config = require('../src/app-config'),
    metrics = config.metrics,
    importance = config.importance;

var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');
var Formula = require('./Formula.jsx');
var Table = require('./Table.jsx');



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
        var val = 0,
            eligible = true;

        criteria.forEach(function(d) {
          val += (college[d.metric + '_z'] * d.perc);
          if (college[d.metric] == null) eligible = false;
        });

        college.score = val;
        college.eligible = eligible;
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
          input_groups = _.chunk(Object.keys(inputs), 3),
          active_inputs = _.pick(inputs, function(v, k) { return v > 0; });

      var colleges = _.filter(this.state.colleges, function(c) { return c.eligible; });
      colleges = colleges.slice(0, 50);

      return (
        <div>
          <Header />
          <div className="h3 bold">Select the ...</div>
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
          <div className="inline-block clearfix mb1">
            <button type="button" className="left btn btn-primary bg-black x-group-item rounded-left">Top 50</button>
            <button type="button" className="left btn btn-outline x-group-item not-rounded">Bottom 50</button>
          </div>
          <Table colleges={colleges} inputs={active_inputs} />
          <Footer />
        </div>
      )
    }
});



module.exports = App
