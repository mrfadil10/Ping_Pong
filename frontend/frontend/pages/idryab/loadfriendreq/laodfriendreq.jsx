
import Friendreq from './friendreq'
import { useData } from '../../../DatasContext';
  
  function LoadFriendreq() {
    const {Notifs, FriendReq} = useData();
    if(FriendReq)
    {
        Notifs.push(FriendReq);
    }

    return (
        <div className="notifications-cont">
            {Notifs?.map((requester, index) => (<Friendreq key={index} requester={requester}/>))}
        </div>
    );
}

export default LoadFriendreq;