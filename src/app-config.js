var f = require('d3-format');



var metrics = {
  C150_4_POOLED: {
    display: '% Who Graduate In 6 years',
    fmt: ".0%"
  },
  PAR_ED_PCT_1STGEN: {
    display: '% First Generation College Students',
    fmt: ".0%"
  },
  MD_EARN_WNE_P10: {
    display: 'Median Wage, 10 Years After Entry',
    fmt: "($.2s"
  },
  PCTFLOAN: {
    display: '% Of Students Receiving Federal Loans',
    fmt: ".0%"
  },
  PCTPELL: {
    display: '% Of Students Receiving Pell Grants',
    fmt: ".0%"
  },
  CDR3: {
    display: 'Default Rate',
    fmt: ".1%"
  },
  NPT4_PUB_PRIV: {
    display: 'Average Net Price',
    fmt: "($.2s"
  },
  NPT4_048_PUB_PRIV: {
    display: 'Net Price Whose Families Earn < $48k',
    fmt: "($.2s"
  }
};


// loop through metrics and add format functions
Object.keys(metrics).forEach(function(k) { 
  metrics[k].fmt = f.format(metrics[k].fmt);
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
