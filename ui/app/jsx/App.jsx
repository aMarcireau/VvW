var React = require('react/addons');
var Router = require('react-router');

var Selection = require('./components/selection/Selection.jsx');

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
    render: function() {
        return (
          <div>
            {/* this is the important part */}
            <RouteHandler/>
          </div>
        );
    }
});

var routes = (
    <Route name="app" path="/" handler={App}>
        <DefaultRoute handler={Selection}/>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
});
