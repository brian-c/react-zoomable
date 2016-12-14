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
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
      panning: React.PropTypes.bool.isRequired,
      onPan: React.PropTypes.function
    },

    getDefaultProps: function() {
      return {
        tag: 'div',
        scale: 1,
        x: 0,
        y: 0,
        panning: false,
        onPan: null
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var shrinkage;
      if (nextProps.scale < this.props.scale) {
        shrinkage = nextProps.scale / this.props.scale;
        if (typeof this.props.onPan === 'function') {
          this.props.onPan({
            x: this.props.x * shrinkage,
            y: this.props.y * shrinkage
          });
        }
      }
    },

    _start: {
      x: 0,
      y: 0
    },

    activeEventHandlers: {
      mousemove: function(event) {
        if (typeof this.props.onPan === 'function') {
          this.props.onPan({
            x: event.pageX - this._start.x,
            y: event.pageY - this._start.y
          });
        }
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
      if (this.props.panning) {
        event.preventDefault();
        event.stopPropagation();
        this._start.x = event.pageX - this.props.x;
        this._start.y = event.pageY - this.props.y;
        addEventListener('mousemove', this);
        addEventListener('mouseup', this);
      }
    },

    render: function() {
      var transformation = [
        'translate(' + this.props.x + 'px, ' + this.props.y + 'px)',
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
        'data-panning': this.props.panning || null,
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
