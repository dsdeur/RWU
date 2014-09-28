/**
 * @jsx React.DOM
 */

var React = require('react');
var WorkersContainer = require('workers_container');


var RWURoot = React.createClass({
    componentDidMount: function() {
        this.props.RWU.initSayCheese();
    },

    refresh: function () {
        this.forceUpdate();
    },

    render: function() {
        if(this.props.RWU.me.snapshot === null) {
            return null;
        }

        return (
            <WorkersContainer workers={this.props.RWU.workers} 
                              me={this.props.RWU.me}
                              retakeSnaphot={this.props.RWU.retakeSnaphot} />
        );
    }
});

module.exports = RWURoot;