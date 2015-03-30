0/*** @jsx React.DOM */



var socket = io.connect();
var messages = [{text:"Messaggio1"},
                {text:"Messaggio2"}
                    ];

var Title  = React.createClass({
    render: function() {
        return (
            <div className="title">
                <h1>{this.props.text}</h1>
            </div>
        );
    }
});

var Chatty = React.createClass({
    getInitialState: function(){
        socket.on('init', this.initialize);
        socket.on('send:message', this.messageRecieve);

        return { messages:[], text: ''};
    },

    initialize: function(data){
        this.setState({user: data.name});
    },

    messageRecieve: function(message){
        this.state.messages.push(message);
        this.setState();
    },
    handleMessageSubmit : function(message){
        this.state.messages.push(message);
        this.setState();

        socket.emit('send:message', message);
    },
    render: function(){
        return(
            <div className="chatty">
                <Title text="Chat"/>
                <MessageList messages={this.state.messages}/>
                <MessageForm submitfnc={this.handleMessageSubmit}/>
            </div>
        );
    }
});

var MessageList = React.createClass({

    render: function () {
        var renderMessage = function(message){
            return <Message msg={message.text} />
        }
        return(
        <ul className="message">
            { this.props.messages.map(renderMessage)}
        </ul>
        );
    }
});



var MessageForm = React.createClass({

    getInitialState: function(){
        return {text: ''};
    },
    changeHandler : function(e){
        this.setState({ text : e.target.value });
    },
    handleSubmit : function(e){
        e.preventDefault();
        var message = {
            text : this.state.text
        }

        this.props.submitfnc(message);
        this.setState({ text: '' });
    },
    render:function(){
        return(
          <div className="messageForm">
              <form onSubmit={this.handleSubmit} >
                  <input onChange={this.changeHandler} value={this.state.text}/>
              </form>
          </div>
        );
    }
});

var Message = React.createClass({
    render: function(){
        return(
            <li className="message">{this.props.msg}
            </li>
        );
    }


});


React.render(
<Chatty />,
    document.getElementById('container')
);