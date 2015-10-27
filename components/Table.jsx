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
                  <td>
                    <a className="black" 
                       href={'http://' + college.insturl} 
                       target="_blank"
                    >
                      {college.instnm}
                    </a>
                  </td>
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
        About the data and methodology: I filtered for schools where the 
        predominant degree granted is a four-year bachelor's degree. I also 
        filter out religious programs (i.e., seminaries, yeshivas) and 
        trade-specific schools. Each institution's ranking is based on 
        a weighted sum of z-scores for each variable. The 
        script that generates the cleaned dataset can be found&nbsp;
        <a href="https://github.com/brendansudol/college-scorecard-rankings/blob/gh-pages/college-data/ipy-notebooks/munge.ipynb">here</a>, and 
        more information about this project can be found <a href="http://www.brendansudol.com/writing/college-rankings/">here</a>.
      </p>
      </section>
    )
  }
});


module.exports = Table