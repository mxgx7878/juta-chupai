import { createSlice } from "@reduxjs/toolkit";
import { conversations, thread } from "@/data/screens";

const seededThreads = {
  "Ayesha Khan": thread,
  "Frame Story Films": [
    { me: false, text: "Sent over the updated package for the 24th.", time: "09:40" },
    { me: true, text: "Thanks! Reviewing now.", time: "09:42" },
  ],
  "Zeeshan Ali": [
    { me: false, text: "Can we add valet parking?", time: "08:15" },
  ],
  "Saffron Table Co.": [
    { me: false, text: "Menu confirmed for 300 guests.", time: "Yesterday" },
    { me: true, text: "Perfect, thank you.", time: "Yesterday" },
  ],
  "Hina Raza": [
    { me: true, text: "See you on the 20th!", time: "Mon" },
    { me: false, text: "Thank you! See you then.", time: "Mon" },
  ],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    conversations,
    activeIndex: 0,
    threads: seededThreads,
  },
  reducers: {
    selectConversation: (s, a) => {
      s.activeIndex = a.payload;
      const conv = s.conversations[a.payload];
      if (conv) conv.unread = 0;
    },
    sendMessage: (s, a) => {
      const conv = s.conversations[s.activeIndex];
      if (!conv) return;
      const key = conv.name;
      if (!s.threads[key]) s.threads[key] = [];
      s.threads[key].push({ me: true, text: a.payload, time: "now" });
      conv.last = a.payload;
      conv.time = "now";
    },
  },
});

export const { selectConversation, sendMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
