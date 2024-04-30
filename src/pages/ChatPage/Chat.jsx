import { Container, Flex } from '@chakra-ui/react';
import Chatbox from '../../components/Chat/Chatbox';
import Topbar from '../../components/Chat/Topbar';
import Iteminfo from '../../components/Chat/Iteminfo';
import Sidebar from '../../components/Chat/Sidebar';
import React, { useEffect, useContext } from "react";
import { auth, firestore } from "../../firebase/firebase";
import { useParams,useSearchParams } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";

import {
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { ChatContext } from "../../context/ChatContext";



const Chat = () => {
  const [authUser] = useAuthState(auth);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("post");
 const { data, dispatch } = useContext(ChatContext);
 const [directChatUser, setDirectChatUser] = useState();
 

  useEffect(()=>{
    const fetchData = async () => {
      //check whether the group(chats in firestore) exists, if not create
      const docRef = doc(firestore, "users", id);
      const docSnap = await getDoc(docRef);
      const user= docSnap.data()
   

      const currentUserRef = doc(firestore, "users", authUser.uid);
      const currentUserSnap = await getDoc(currentUserRef);
      const currentUser= currentUserSnap.data()
     
      const combinedId = authUser.uid > user.uid
        ? authUser.uid + user.uid + postId
        : user.uid + authUser.uid + postId;
        // console.log('combinedId',combinedId)
        console.log('user',user)
           setDirectChatUser({
             ...user,
             chatId: combinedId,
           });
      try {
        const res = await getDoc(doc(firestore, "chats", combinedId));
    
        dispatch({ type: "SET_CHAT_ID", payload: combinedId });
  
        if (!res.exists()) {
          //create a chat in chats collection
          await setDoc(doc(firestore, "chats", combinedId), { messages: [] });
  
          //create user chats
          await updateDoc(doc(firestore, "userChats", authUser.uid), {
            [combinedId + ".userInfo"]: {
              uid: user.uid,
              displayName: user.fullName,
              photoURL: user.profilePicURL,
              username:user.username,
              postId:postId,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
          console.log('user',user)
  
          await updateDoc(doc(firestore, "userChats", user.uid), {
            [combinedId + ".userInfo"]: {
              uid: authUser.uid,
              displayName: currentUser.fullName,
              photoURL: currentUser.profilePicURL,
              username:user.username,
              postId:postId,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
        }
      } catch (err) {}
  
    };

    if(id !== 'messages'){
      fetchData();
    }
 
  },[id])
  return (
    <Container
      maxW="container.xlg"
      p={0}
      h="100vh"
      centerContent
      overflow="hidden"
    >
      <Flex w="full" h="full" flexDirection="column">
        <Topbar w="full" />
        <Flex flex={1} w="full" flexDirection="row">
          <Flex flex={1} w="full">
            <Sidebar directChatUser={directChatUser} />
          </Flex>
          <Flex flex={3} w="full">
            <Chatbox />
          </Flex>
          <Flex flex={2} w="full">
            <Iteminfo />
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
}

export default Chat;
