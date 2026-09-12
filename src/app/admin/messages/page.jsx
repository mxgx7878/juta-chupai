"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PageHeader from "@/components/layout/PageHeader";
import { selectConversation, sendMessage } from "@/store/messagesSlice";

const AV = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899"];

export default function MessagesPage() {
  const dispatch = useDispatch();
  const { conversations, activeIndex, threads } = useSelector((s) => s.messages);
  const [draft, setDraft] = useState("");

  const active = conversations[activeIndex];
  const thread = threads[active?.name] || [];

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    dispatch(sendMessage(text));
    setDraft("");
  };

  return (
    <Box>
      <PageHeader overline="Workspace" title="Messages" subtitle="In-app conversations with customers and vendors" />

      <Card sx={{ overflow: "hidden", height: { xs: "auto", md: 620 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "320px 1fr" }, height: "100%" }}>
          {/* Conversation list */}
          <Box sx={{ borderRight: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 40, borderRadius: 2, bgcolor: "grey.50", border: "1px solid", borderColor: "divider" }}>
                <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <InputBase placeholder="Search chats…" sx={{ fontSize: 14, flex: 1 }} />
              </Box>
            </Box>
            <Divider />
            <Box sx={{ overflowY: "auto", flex: 1 }}>
              {conversations.map((c, i) => (
                <Box key={c.name}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    onClick={() => dispatch(selectConversation(i))}
                    sx={{
                      alignItems: "center",
                      p: 2,
                      cursor: "pointer",
                      bgcolor: i === activeIndex ? "action.selected" : "transparent",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Badge color="primary" badgeContent={c.unread || 0}>
                      <Avatar sx={{ bgcolor: AV[i % AV.length], width: 42, height: 42, fontSize: 14 }}>
                        {c.initials}
                      </Avatar>
                    </Badge>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                        <Typography variant="subtitle2" fontWeight={700} noWrap>
                          {c.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {c.time}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                        {c.last}
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider component="div" />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Thread */}
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: 420 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", p: 2 }}>
              <Avatar sx={{ bgcolor: AV[activeIndex % AV.length], width: 40, height: 40, fontSize: 14 }}>
                {active?.initials}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  {active?.name}
                </Typography>
                <Typography variant="caption" color="success.main">
                  ● Online
                </Typography>
              </Box>
            </Stack>
            <Divider />

            <Box sx={{ flex: 1, overflowY: "auto", p: 3, bgcolor: "grey.50" }}>
              <Stack spacing={1.5}>
                {thread.map((m, i) => (
                  <Stack key={i} direction="row" sx={{ justifyContent: m.me ? "flex-end" : "flex-start" }}>
                    <Box
                      sx={{
                        maxWidth: "72%",
                        px: 2,
                        py: 1.25,
                        borderRadius: 3,
                        bgcolor: m.me ? "primary.main" : "background.paper",
                        color: m.me ? "#fff" : "text.primary",
                        border: m.me ? "none" : "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="body2">{m.text}</Typography>
                      <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.7, textAlign: "right" }}>
                        {m.time}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Divider />
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", p: 1.5 }}>
              <InputBase
                placeholder="Type a message…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                sx={{ flex: 1, px: 2, py: 1, borderRadius: 2, bgcolor: "grey.50", border: "1px solid", borderColor: "divider" }}
              />
              <IconButton onClick={send} sx={{ bgcolor: "primary.main", color: "#fff", "&:hover": { bgcolor: "primary.dark" } }}>
                <SendRoundedIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
