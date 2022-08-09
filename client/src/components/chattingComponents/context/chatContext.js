import React from 'react';
import {createContext, useState} from 'react';

const ChatContext = createContext();

export function ChatContextProvider({children}) {
  const [chatLog, setChatLog] = useState('');

  return (
    <ChatContext.Provider value={{chatLog, setChatLog}}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatContext;
