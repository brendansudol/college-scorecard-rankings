var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
var qs = require('qs');

var config = require('../src/app-config'),
    metrics = config.metrics,
    importance = config.importance;

var Header = require('./Header.jsx');
var Formula = require('./Formula.jsx');
var Inputs = require('./Inputs.jsx');
var OrderToggle = require('./OrderToggle.jsx');
var Table = require('./Table.jsx');
var Footer = require('./Footer.jsx');



var App = React.createClass({
    getInitialState: function(){
        return { 
          inputs: {},
          colleges: [],
          criteria: [],
          order: 'top',
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

    toggleOrder: function(o) {
      if (o !== this.state.order) {
        this.setState({ order: o });
      }
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
      var colleges = this.state.colleges,
          order = this.state.order;

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

      this.setState({ 
        colleges: colleges,
        criteria: criteria
      }, this.updateUrl);
    },

    render: function() {
      var self = this;

      var inputs = this.state.inputs,
          active_inputs = _.pick(inputs, function(v, k) { return v > 0; });

      var colleges = this.state.colleges,
          sort = this.state.order == 'top' ? 'desc' : 'asc';

      colleges = _.filter(colleges, function(c) { return c.eligible; });
      colleges = _.sortByOrder(colleges, 'score', sort);
      colleges = colleges.slice(0, 50);

      return (
        <div>
          <Header />
          <Inputs 
            onChange={this.changeInput} 
            inputs={inputs} 
          />
          <Formula 
            criteria={this.state.criteria} 
          />
          <OrderToggle 
            onClick={this.toggleOrder} 
            order={this.state.order} 
            criteria={this.state.criteria} 
          />
          <Table 
            colleges={colleges} 
            inputs={active_inputs} 
          />
          <Footer />
        </div>
      )
    }
});


module.exports = App