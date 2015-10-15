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

var metrics2 = {
  C150_4_POOLED: {
    display: '% Who Graduate In 6 years'
  },
  PAR_ED_PCT_1STGEN: {
    display: '% Of Students Who Are First Generation College Students'
  },
  PCTFLOAN: {
    display: '% Of Students Recieving Federal Loans'
  },
  PCTPELL: {
    display: '% Of Students Recieving Pell Grants'
  },
  CDR3: {
    display: 'Default Rate'
  },
  MD_EARN_WNE_P6: {
    display: 'Median Wage, 6 Years After Entry'
  },
  MD_EARN_WNE_P10: {
    display: 'Median Wage, 10 Years After Entry'
  },
  NPT4_PUB_PRIV: {
    display: 'Average Net Price'
  },
  NPT4_048_PUB_PRIV: {
    display: 'Net Price For Students Whose Families Earn less than $48,000'
  }
};

var levels = {
  0: 'Not important',
  1: 'A little important',
  2: 'Fairly important',
  3: 'Extremely important'
};



var data = {
  metrics: metrics,
  metrics2: metrics2,
  levels: levels
}

module.exports = data
