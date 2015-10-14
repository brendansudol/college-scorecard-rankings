var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
var qs = require('qs');



var metrics = {
  C150_4_POOLED: '% Who Graduate In 6 years',
  PAR_ED_PCT_1STGEN: '% Of Students Who Are First Generation College Students',
  PCTFLOAN: '% Of Students Recieving Federal Loans',
  PCTPELL: '% Of Students Recieving Pell Grants',
  CDR3: 'Default Rate',
  MD_EARN_WNE_P6: 'Median Wage, 6 Years After Entry',
  MD_EARN_WNE_P10: 'Median Wage, 10 Years After Entry',
  NPT4_PUB_PRIV: 'Average Net Price',
  NPT4_048_PUB_PRIV: 'Net Price For Students Whose Families Earn less than $48,000'
};

var levels = {
  0: 'Not important',
  1: 'A little important',
  2: 'Fairly important',
  3: 'Extremely important'
};



var Table = React.createClass({
  render: function() {
    var colleges = this.props.colleges;

    if (!colleges || colleges.length == 0) return null;

    return (
      <table className="table-light border rounded">
        <thead>
          <tr>
            <th>College</th>
            <th>State</th>
            <th>CDR3</th>
            <th>MD_EARN_WNE_P6</th>
          </tr>
        </thead>
        <tbody>
        {
          colleges.map(function(c) {
            return (
              <tr key={c.UNITID}>
                <td>{c.INSTNM}</td>
                <td>{c.STABBR}</td>
                <td>{c.CDR3}</td>
                <td>{c.MD_EARN_WNE_P6}</td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
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
          url = '/data/data-clean/college-data.json';

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
            possible_vals = _.keys(levels).map(Number);

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
          pos_inputs = _.pick(inputs, function(v, k) { return v > 0; }),
          params = qs.stringify(pos_inputs);

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
          input_names = Object.keys(inputs);

      var colleges = this.state.colleges.slice(0, 25);

      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <div className='fieldset-reset py2'>
              <div className='clearfix mxn3 mb3'>
              {
                input_names.map(function(n) {
                  var val = inputs[n];

                  return (
                    <div key={n} className='sm-col sm-col-4 mb2 px3'>
                      <label className='h5 bold block'>
                        {n} <small className='gray'>({levels[val]})</small>
                      </label>
                      <input type='range' value={val}
                        min='0' max='3'
                        onBlur={self.changeInput}
                        onChange={self.changeInput}
                        data-input={n}
                        className='col-12 dark-gray range-light' />
                      </div>
                  );
                })
              }
              </div>
            </div>
          </form>
          <Table colleges={colleges} />
        </div>
      )
    }
});



module.exports = App
