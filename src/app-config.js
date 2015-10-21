var fmt = require('d3-format');



var metrics = {
  c150_4_pooled: {
    display: '% Who Graduate In 6 years',
    fmt: ".1%"
  },
  par_ed_pct_1stgen: {
    display: '% First Generation College Students',
    fmt: ".0%"
  },
  md_earn_wne_p10: {
    display: 'Median Wage, 10 Years After Entry',
    fmt: "($.3s"
  },
  pctfloan: {
    display: '% Receiving Federal Loans',
    fmt: ".1%"
  },
  pctpell: {
    display: '% Receiving Pell Grants',
    fmt: ".1%"
  },
  cdr3: {
    display: 'Default Rate',
    fmt: ".1%"
  },
  npt4_pub_priv: {
    display: 'Average Net Price',
    fmt: "($.3s"
  },
  npt4_048_pub_priv: {
    display: 'Net Price Whose Families Earn <$48k',
    fmt: "($.3s"
  }
};


// loop through metrics and add format functions
Object.keys(metrics).forEach(function(k) { 
  metrics[k].fmt = fmt.format(metrics[k].fmt);
});


var importance = {
  0: 'Not important',
  1: 'A little important',
  2: 'Fairly important',
  3: 'Extremely important'
};


var data = {
  metrics: metrics,
  importance: importance
}

module.exports = data
