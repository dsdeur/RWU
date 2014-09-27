/**
 * @jsx React.DOM
 */

var React = require('react');
var $ = require('jquery');

var Worker = React.createClass({
    componentDidMount: function() {
        var self = $(this.getDOMNode());
        self.css("transition", "none");
        self.css("border-radius", 120);
        setTimeout(function() {
            self.css("transition", "30s linear");
            self.css("border-radius", 3);
        }, 0);
    },
    componentWillReceiveProps: function(nextProps) {
        var self = this;
        if(this.props.snapshot !== nextProps.snapshot) {
            var DOMNode = $(this.getDOMNode());
            DOMNode.css("transition", "none");
            DOMNode.css("border-radius", 120);
            setTimeout(function() {
                DOMNode.css("transition", "30s linear");
                DOMNode.css("border-radius", 3);
            }, 0);
        }
    },
    render: function() {
        var meClass = (this.props.isMe) ? "self" : null;

        return (
            <div className={"worker " + meClass}>
                <img src={this.props.snapshot} />
            </div>
        );
    }
});

module.exports = Worker;