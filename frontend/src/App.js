import React, { useState, useRef, useEffect } from 'react';
import {io} from 'socket.io-client';

const socket = io('http://localhost', {rejectUnauthorized: false});

function App() {
  const [nickName, setNickName] = useState(null);
  
  function handleJoin(value) {
    if (value.length> 0) {
      setNickName(value);
      socket.emit('message', {action: 'joined', nickName: value, message: 'Joined'});
    }
  }

  function handleLeave() {
    setNickName('');
    socket.emit('message', {action: 'left', nickName: nickName, message: 'Left'});
  }

  return (
    <div className="container mt-5">
        { nickName ? <Chat socket={socket} nickName={nickName} handleLeave={handleLeave} /> : <Join handleJoin={handleJoin} />}
    </div>
  );
}

export default App;

/**
 * This component should be in a different js file. But, I used it this way because this is not a very complex app.
 * Please consider this component in a separated js file.
 * 
 * Join chat component.
 */
function Join({ handleJoin }) {
  const nickNameRef = useRef();

  function handleForm(e) {
    e.preventDefault();
    handleJoin(nickNameRef.current.value);
  }

  return (
    <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <form onClick={(e) => handleForm(e)}>
                  <h2 className="text-center mb-4">Join the Chat App</h2>
                  <div className="mb-3">
                    <label htmlFor="input-nickname" className="form-label">Nickname</label>
                    <input type="text" className="form-control" ref={nickNameRef} id="input-nickname" />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Join</button>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

/**
 * Please consider this component in a separated js file.
 * 
 * Chat component.
 */
function Chat({ socket, nickName, handleLeave }) {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [messageVal, setMessageVal] = useState('');
  const chatBox = useRef();

  function handleMessage(e) {
    e.preventDefault();
    
    if (messageVal.length > 0) {
      socket.emit('message', {nickName: nickName, message: messageVal});
      socket.emit('typing', {nickName: nickName, typing: false});
      setMessageVal('');
    }
  }

  function leave(e) {
    e.preventDefault();
    socket.emit('typing', {nickName: nickName, typing: false});

    handleLeave();
  }

  function handleMessageInput(e) {
    setMessageVal(e.target.value);
  
    socket.emit('typing', {nickName: nickName, typing: (e.target.value.length > 0), time: new Date().getTime()});
  }


  useEffect(() => {
    socket.on('message', (payload) => {
      let temp = messages;
      temp.push(payload);
      setMessages([...temp]);

      if (chatBox.current) {
        chatBox.current.scrollTop = chatBox.current.scrollHeight - chatBox.current.clientHeight;
      }
    });

    socket.on('typing', (payload) => {
      let temp = typingUsers;
      let userIndex = typingUsers.findIndex(user => user.nickName === payload.nickName);

      if (userIndex > -1) {
        temp[userIndex] = payload;
      } else {
        temp.push(payload);
      }
      
      setTypingUsers(temp.filter(user => user.typing));
      
    });

    return (() => {
      socket.offAny();
    })

  }, [nickName]);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Chat App</h3>
        <p className="card-subtitle mb-2 text-muted">Have fun with our awesome chat app. <a href="/#" onClick={(e) => leave(e)}>Leave</a></p>
      </div>

      <div className="card-body" ref={chatBox} style={{maxHeight: 600, overflowX: 'scroll'}}>
        {messages.map((message, index) => <Item message={message} key={index} />)}
      </div>

      {typingUsers.length > 0 && (
        <div className="card-footer">
        {typingUsers.map((user, index) => (
          <div key={index} className="small"><strong>{user.nickName}</strong> is typing ...</div>
        ))}
        </div>
      )}
      
      <div className="card-footer">
        <form onSubmit={(e) => handleMessage(e)}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Type here" value={messageVal} onChange={(e) => handleMessageInput(e)} />
            <button className="btn btn-primary" type="submit" id="button-addon1">Send</button>
          </div>
        </form>
      </div>

    </div>
  );
}


/**
 * Please consider this component in a separated js file.
 * 
 * Chat message item component
 */
function Item({message}) {
  if (message.action) {
    return (
      <div className="mb-2">
        <span className={'badge bg-'+ (message.action === 'joined' ? 'success': 'danger')}>{message.nickName}: {message.message}</span>
      </div>
    )
  }

  return (
    <div className="mb-2">
      <span className="badge bg-light text-dark">{message.nickName}: </span><br />
      <span className="badge bg-primary">{message.message}</span>
    </div>
  )
}
