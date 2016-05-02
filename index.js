(function() {
  var React;
  if (typeof require !== 'undefined') {
    React = require('react');
  } else if (typeof window !== 'undefined') {
    React = window.React;
  }

  var Zoomable = React.createClass({
    displayName: 'Zoomable',

    propTypes: {
      tag: React.PropTypes.string.isRequired,
      scale: React.PropTypes.number.isRequired,
      pan: React.PropTypes.bool
    },

    getDefaultProps: function() {
      return {
        tag: 'div',
        scale: 1,
        pan: false
      };
    },

    getInitialState: function() {
      return {
        x: 0,
        y: 0
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var shrinkage;
      if (nextProps.scale < this.props.scale) {
        shrinkage = nextProps.scale / this.props.scale;
        this.setState({
          x: this.state.x * shrinkage,
          y: this.state.y * shrinkage
        });
      }
    },

    _start: {
      x: 0,
      y: 0
    },

    activeEventHandlers: {
      mousemove: function(event) {
        this.setState({
          x: event.pageX - this._start.x,
          y: event.pageY - this._start.y
        });
      },

      mouseup: function() {
        removeEventListener('mousemove', this);
        removeEventListener('mouseup', this);
      }
    },

    handleEvent: function(event) {
      var handler = this.activeEventHandlers[event.type];
      if (handler !== undefined) {
        handler.apply(this, arguments);
      }
    },

    handleMouseDown: function(event) {
      if (this.props.pan) {
        event.preventDefault();
        event.stopPropagation();
        this._start.x = event.pageX - this.state.x;
        this._start.y = event.pageY - this.state.y;
        addEventListener('mousemove', this);
        addEventListener('mouseup', this);
      }
    },

    render: function() {
      var transformation = [
        'translate(' + this.state.x + 'px, ' + this.state.y + 'px)',
        'scale(' + this.props.scale + ')'
      ].join(' ');

      var wrapper = React.createElement(this.props.tag, {
        style: {
          transform: transformation
        }
      }, this.props.children);

      return React.createElement(this.props.tag, {
        className: [
          'react-zoomable',
          this.props.className
        ].filter(Boolean).join(' '),
        'data-panning': this.props.pan || null,
        style: Object.assign({
          overflow: 'hidden'
        }, this.props.style),
        onMouseDown: this.handleMouseDown
      }, wrapper);
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = Zoomable;
  } else if (typeof window !== 'undefined') {
    window.ReactZoomable = Zoomable;
  }
}());
