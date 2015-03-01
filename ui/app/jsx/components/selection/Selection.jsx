var React = require('react/addons');

var GamePanel = require('./GamePanel.jsx');
var Games = require('../../stores/Games.jsx');

module.exports = React.createClass({
    render: function() {
        return (
            <div className="selection">
                Hello, world! I am a CommentBox
            </div>
        );
    }
});
