var React = require('react');



var OrderToggle = React.createClass({
  clickHandler: function(e) {
    var order = e.target.getAttribute('data-order');
    this.props.onClick(order);
  },

  render: function() {
    var o = this.props.order,
        criteria = this.props.criteria;

    if (criteria.length === 0) return null;

    return (
      <div className="inline-block clearfix mb1">
        <button type="button" 
          data-order="top" 
          className={
            (o == 'top' ? 'btn-primary bg-black' : 'btn-outline') + 
            ' left btn x-group-item rounded-left'
          }
          onClick={this.clickHandler}
        >
          Top 50
        </button>
        <button type="button" 
          data-order="bottom" 
          className={
            (o == 'bottom' ? 'btn-primary bg-black' : 'btn-outline') + 
            ' left btn x-group-item rounded-right'
          }
          onClick={this.clickHandler}
        >
          Bottom 50
        </button>
      </div>
    )
  }
});


module.exports = OrderToggle