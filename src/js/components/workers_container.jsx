/**
 * @jsx React.DOM
 */

var React = require('react');
var Worker = require('worker');

var WorkerContainer = React.createClass({
    render: function() {
        var workers = [];

        workers.push(<Worker isMe={true} retakeSnaphot={this.props.retakeSnaphot} snapshot={this.props.me.snapshot} key={this.props.me.id} />);

        for (var key in this.props.workers) {
            if (key && this.props.workers.hasOwnProperty(key)) {
                workers.push((<Worker snapshot={this.props.workers[key].snapshot} 
                                     key={this.props.workers[key].id} />));
            }
        }

        return (
            <div>
                {workers}
            </div>
        );
    }
});

module.exports = WorkerContainer;