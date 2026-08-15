import { useState } from "react";

import ContactCard from "./ContactCard";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";

import { CloseIcon } from "../../lib/icons";

export default function ContactDialog({ open, onClose, contacts = [], onMessageClick }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [filter, setFilter] = useState("new");

  // new 와 all 필터
  const handleChange = (e, value) => {
    if (value !== null) {
      setFilter(value);
    }
  };

  const filteredContacts =
    filter === "new"
      ? contacts.filter(contact => {
          // 메시지 -> 읽지 않은 메시지만 New
          if (contact.type === "message") {
            return !contact.isRead;
          }

          // 좋아요 -> 알람 생성 후 7일 이내만 New
          if (contact.type === "like") {
            const createdAt = new Date(contact.createdAtRaw);
            const now = new Date();

            const sevenDays = 7 * 24 * 60 * 60 * 1000;

            return now - createdAt < sevenDays;
          }

          return false;
        })
      : contacts;

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="알람 목록 모달"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          관심 & 연락
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleChange}
              sx={{
                border: "1px solid",
                borderColor: "#fafafa",
                borderRadius: "999px",
                overflow: "hidden",

                "& .MuiToggleButton-root": {
                  width: 120,
                  height: 45,
                  border: 0,
                  borderRadius: 6,
                  textTransform: "none",
                  typography: "h5",
                  color: "text.primary",

                  "&:hover": {
                    bgcolor: "transparent",
                  },
                },

                "& .Mui-selected": {
                  bgcolor: "#212121 !important",
                  color: "#fff !important",
                },
              }}
            >
              <ToggleButton value="new">New</ToggleButton>

              <ToggleButton value="all">All</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <List disablePadding="true">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <ContactCard key={contact.id} item={contact} onMessageClick={onMessageClick} />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 200,
                }}
              >
                <Text component="p" variant="body2" color="text.secondary">
                  {filter === "new" ? "새로운 알람이 없습니다." : "관심 및 연락 내역이 없습니다."}
                </Text>
              </Box>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
