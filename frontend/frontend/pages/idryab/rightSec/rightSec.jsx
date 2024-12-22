import { useEffect, useState,  useRef} from 'react';
import Conversation from '../conversation/conversation';
import MsgBubble from '../msgbubble/msgbubble'
import RightBubble from '../msgbubble/rightBubble'
import "../usersList/userslist.css"
import { useNavigate } from 'react-router-dom';

import api from "../../../api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import {faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

import { useData } from '../../../DatasContext';
const RightSec = ({messages, selecteduser, setPage, page}) => {
  const {sendJsonMessage} = useData();
  const userobj = JSON.parse(localStorage.user);
    //========================================get the value of message input===================================
  const [msg, setMsg] = useState('');
  const getMessage = (event) => {
    setMsg(event.target.value);
  };

  const [blocklist, setblocklist] = useState([]);
  useEffect(() => {
        api
          .get(`https://${window.location.hostname}/api/block_list/`)
          .then((res) => {
              setblocklist(res.data.blocked_users);
          })
          .catch((err) => {console.error(err);});
  }, []);
  blocklist.map((block) => {
    if(block=== selecteduser.username)
      selecteduser.is_blocked  = true;
  });
  //Sending message when the user click ENTER
  const getkeyDown = (event) => {
    if(event.key === "Enter" && selecteduser && msg != '')
      {
        sendJsonMessage(
          {
            message: msg,
            sender: userobj.username,
            receiver: selecteduser.username,
            typeofmsg: "message"
          })
          setMsg('');
        }
      };
      //scroll to the bottom of the chat(when loaded previouss messages or new message came)
      const chatAreaRef = useRef(null);
      const scrollToBottom = () => {
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
      };
    //scroll everytime the messages array changed
  useEffect(() => {
    if(page <= 2)
      scrollToBottom();
  }, [messages]);

const [open, setOpen] = useState(false);
let menuRef = useRef(false);

useEffect(() =>{
  let handler = (e)=>{
    if(menuRef.current && !menuRef.current.contains(e.target))
    {
      setOpen(false);
    }
};

document.addEventListener("mousedown", handler);
return () =>{
  document.removeEventListener("mousedown", handler);
}
}, []);

const handlescrolltop = (e) => {
  if(e.target.scrollTop === 0)
  {
      e.target.scrollTop = 25;
      setPage(prevPage => prevPage + 1);
  }
};

// const [blocked_or_not, setblockornot] = useState(selecteduser.is_blocked);
const handleBlockFriend = () => {
  if(selecteduser)
    {
      api
      .post(`https://${window.location.hostname}/api/block_friend/${selecteduser.username}/`)
      .then((res) => {
        selecteduser.is_blocked = true;
        // toast.success(res.data.success);
      })
      .catch((err) => {
        toast.error("Error blocking friend");
      });
      
    }
};


const handleUnBlockFriend = () => {
  if(selecteduser)
  {
    api
        .post(`https://${window.location.hostname}/api/unblock_friend/${selecteduser.username}/`)
        .then((res) => {
          selecteduser.is_blocked = false;
        })
        .catch((err) => {
            toast.error("Error unblocking friend");
        });
  }
};
    //Game
    const navigate = useNavigate();
    const iviteToGame = () => {
      navigate('/randomlyGame', {state: {sender: userobj.username, receiver: selecteduser.username}});
    };
    //Game

    return (
      <>
      <div className='convo-header'>
        <div className='first-empty'>
          <Conversation className='convo-user' friend={selecteduser} status={false}/>
          <FontAwesomeIcon onClick={() =>{setOpen(true)}} className='convo-menu' icon={faEllipsis} />
        </div>


        {open ? 
        <div className='dropdown' ref={menuRef}>
          {selecteduser.is_blocked ? <button onClick={handleUnBlockFriend}>Unblock</button> : <button onClick={handleBlockFriend}>block</button>}
          <button
           onClick={() => {
             sendJsonMessage({
               message: "let's play, homie!",
               sender: userobj.username,
               receiver: selecteduser.username,
               typeofmsg: "invite_to_game",
             });
             iviteToGame(); }}>Invite </button>
      </div> : null}
      </div>


      
      <div ref={chatAreaRef} className="chat-area" onScroll={(e) => handlescrolltop(e)}>
        {messages.map((data, index) => (
          <div id="messages_area" key={index}  className='received-messages-area'>
            {messages && data.senderName != userobj.username && selecteduser.username === data.senderName ? 
            <MsgBubble
              profilePicture={selecteduser.profile_image}
              messages={data}
            /> : null }
            {messages && data.senderName === userobj.username && selecteduser.username != data.senderName ? 
            <RightBubble messages={data} /> : null }
          </div>
        ))}
      </div>
      <div className="send-area">
        <button><FontAwesomeIcon icon={faFile} className="file-icon" /></button>
        <input type='text' placeholder='type a message here...' value={msg} onChange={getMessage} onKeyDown={getkeyDown} />
        <button onClick={() => {
          if(msg != '')
          {
              sendJsonMessage(
                  {
                    message: msg,
                    sender: userobj.username,
                    receiver: selecteduser.username,
                    typeofmsg: "message"
                  }
              );
          }
          setMsg('');
        }}><FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
        </button>
      </div>
    </>);
};

export default RightSec;