var React = require('react');

var config = require('../src/app-config'),
    metrics = config.metrics;



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

    // sort cols by contribution
    cols = cols.sort(function(a, b) { 
        return inputs[b] - inputs[a]; 
    });

    var w1 = cols.length == 1 ? 50 : 40,
        w2 = (100 - 5 - w1) / cols.length;

    return (
      <section>
      <div className="overflow-scroll mb3">
        <table className="border rounded">
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
                <tr key={college.unitid}>
                  <td>{i + 1}</td>
                  <td>{college.instnm}</td>
                  {
                    cols.map(function(col) {
                      var fmt = metrics[col].fmt;
                      return (
                        <td key={college.unitid + '-' + col}>
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


module.exports = Table