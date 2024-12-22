import { useEffect, useState,  useRef} from 'react';
import MsgCard from '../msgCard/msgCard';
import SearchBar from '../searchbar/seachBar';
import Header from '../chat/header'
import RightSec from '../rightSec/rightSec'
import "./userslist.css"
import api from "../../../api";
import { ToastContainer, toast } from 'react-toastify';
import AllFriends from '../allfriends/allfriends';
import { useData } from '../../../DatasContext';
import chats from "../../../assets/chats.svg"



const Users = () => {
  const { datas, setDatas} = useData();
  const userObj = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [selecteduser, setSelecteduser] = useState("");
  const [messages, setMessages] = useState([]);
  

  //========================================Here I fetch friends, not all of them, just the onces I talk with 'em===================================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`https://${window.location.hostname}/api/users/`)
        userObj?.blocked_friends?.map((block_id) => {
          response.data?.map((user) =>{
            if(user.id === block_id)
                user.is_blocked = true;
          });
        });
        setUsers(response.data);
      } catch (error) {
        toast.error("Error fetching friends list");
      }
    };
    fetchUsers();
  }, [datas]);
  

//====================================== Just Test Code ================================================================
  //This was just a test code but I developed it, so maybe I'll keep it. (fetch the previouss messages from Database with paginator)
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async (selectedusername) => {
    setLoading(true);
    try {
        const response = await api.get(`https://${window.location.hostname}/api/loadmessages/?user1=${userObj.username}&user2=${selectedusername}&page=${page}`);
        response.data.results.reverse();
        setMessages(prevMessages => [...response.data.results, ...prevMessages]);
    } 
    catch  {
      // console.log('No more messages available');
      console.log("");
    }
    setLoading(false);
  };

//====================================== End Test Code =================================================================
//select user(The user I wanna talk to it) and Load messages in between
  const selectUser = (friend) =>{
    if (selecteduser.username != friend.username)
    {
        setPage(1);
        setMessages([]);//Reset the messages array to be empty
        // userObj.blocked_friends?.map((block_id) => {
        //     if(friend.id === block_id)
        //       friend.is_blocked = true;
        // });
        setSelecteduser(friend);//set the new selected-user
    }
  }

//==========================================================unreaded messages (works only in real-time)============================================================
  // const UnreadedMessages = (friends, sender_name) => {
  //   friends.map((friend) => {
  //     if(!friend?.mes_count)
  //       friend.mes_count = null;
  //     if(friend.username === sender_name)
  //     {
  //       console.log("seeen indisde: ", sender_name);
  //       friend.mes_count += 1;
  //     }
  //   });
  // }
  useEffect(() => {
    if (datas.length > 0) {
      setMessages((prevMessages) => [...prevMessages, ...datas]);//concatenate the loaded messages && real-time messages
      // UnreadedMessages(users, datas[0]?.senderName);//call the UnreadedMessages
      setDatas([]);//clear real-time data (messages)
    }
  }, [datas]);
  
//==============================================================================================================================================================================

const [open, setOpen] = useState(false);
let menuRef = useRef(false);

useEffect(() =>{
  let handler = (e)=>{
    if(!menuRef.current.contains(e.target))
      setOpen(false);
};

document.addEventListener("mousedown", handler);
return () =>{
  document.removeEventListener("mousedown", handler);
}
}, []);

useEffect(() =>{
  if(selecteduser)
  {
    fetchMessages(selecteduser.username);
  }
}, [page, selecteduser]);
  return (
    <div className="chat-section">
      <div className='left-section'>
        <div className='top-left-section'>
          <Header profilePicture={`https://${window.location.hostname}${userObj?.profile_image}`}/>
          <div onClick={() =>{setOpen(true)}}><SearchBar />
          <div className="friends-section" ref={menuRef}>
            {open === true && <AllFriends selectUser={selectUser}/>}
          </div>
          </div>
        </div>

          <div className='users-section'>
            {/* <span>DIRECT MESSAGES</span> */}
            <ul>
              {/* <hr></hr> */}
              {users.map((friend, index) => (
                <li key={index} onClick={() => selectUser(friend)}>
                  <MsgCard friend={friend} status={false} selectuser={selecteduser}/>
                </li>
              ))}
            </ul>
          </div>
          <div className="bottom-left-section">
          {/* <LoadFriendreq/> */}
        </div>
      </div>
      
    {selecteduser ? (
      <div className="right-sec">
          <RightSec messages={messages} selecteduser={selecteduser} setPage={setPage} page={page}/>
      </div>
    ) : (     
      <div className='no-conv'>
        <img src={chats} alt="Profile" className="prfpicture" />
        <p>Start Some Conversation...</p>
      </div> 
      )}
    </div>
  );
};

export default Users;
