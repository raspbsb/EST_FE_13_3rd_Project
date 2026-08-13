import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import { MoreVertIcon } from "../../lib/icons";

export default function CollectionManageDialog({ open, onClose, collections, onCreate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  // 컬렉션 생성 상태
  const [openCreate, setOpenCreate] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState("");

  // 메뉴 열고 닫기
  const handleMenuOpen = (event, collection) => {
    setAnchorEl(event.currentTarget);
    setSelectedCollection(collection);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCollection(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>컬렉션 관리</DialogTitle>

        <DialogContent>
          <List>
            {collections.map(collection => (
              <ListItem
                key={collection.id}
                secondaryAction={
                  <IconButton edge="end" onClick={event => handleMenuOpen(event, collection)}>
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={collection.title} secondary={`총 ${collection.total}개`} />
              </ListItem>
            ))}
          </List>

          <Divider />

          <Button fullWidth sx={{ mt: 2 }} onClick={() => setOpenCreate(true)}>
            + 새 컬렉션 만들기
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>닫기</Button>
        </DialogActions>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>이름 수정</MenuItem>

          <MenuItem onClick={handleMenuClose}>삭제</MenuItem>
        </Menu>
      </Dialog>
      {/* 컬렉션 생성 dialog */}
      <Dialog
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setCollectionTitle("");
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>새 컬렉션 만들기</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="컬렉션 이름"
            value={collectionTitle}
            onChange={e => setCollectionTitle(e.target.value)}
            margin="normal"
            placeholder="예: React 프로젝트"
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenCreate(false);
              setCollectionTitle("");
            }}
          >
            취소
          </Button>

          <Button
            variant="contained"
            disabled={!collectionTitle.trim()}
            onClick={() => {
              onCreate(collectionTitle.trim());
              setCollectionTitle("");
              setOpenCreate(false);
            }}
          >
            만들기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
