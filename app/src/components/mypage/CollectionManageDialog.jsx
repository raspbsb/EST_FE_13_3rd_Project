import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Text from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import { MoreVertIcon } from "../../lib/icons";

export default function CollectionManageDialog({ open, onClose, collections, onCreate, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  // 컬렉션 생성 상태
  const [openCreate, setOpenCreate] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState("");
  // 컬렉션 타이틀 수정 상태
  const [openEdit, setOpenEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  // 컬렉션 삭제 확인 상태
  const [openDelete, setOpenDelete] = useState(false);

  // 컬렉션 옵션 열고 닫기
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

          <Button fullWidth sx={{ mt: 2 }} onClick={() => setOpenCreate(true)} disabled={collections.length >= 8}>
            + 새 컬렉션 만들기
          </Button>
          {collections.length >= 8 && (
            <Text variant="caption" color="error" sx={{ display: "block", textAlign: "center" }}>
              컬렉션은 최대 8개까지 만들 수 있습니다.
            </Text>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>닫기</Button>
        </DialogActions>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              setEditTitle(selectedCollection.title);
              setOpenEdit(true);
              setAnchorEl(null);
            }}
          >
            이름 수정
          </MenuItem>

          <MenuItem
            onClick={() => {
              setOpenDelete(true);
              setAnchorEl(null);
            }}
          >
            삭제
          </MenuItem>
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
      {/* 컬렉션 타이틀 수정 dialog */}
      <Dialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditTitle("");
          setSelectedCollection(null);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>컬렉션 이름 수정</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="컬렉션 이름"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenEdit(false);
              setEditTitle("");
              setSelectedCollection(null);
            }}
          >
            취소
          </Button>

          <Button
            variant="contained"
            disabled={!editTitle.trim() || !selectedCollection}
            onClick={() => {
              onEdit(selectedCollection.id, editTitle.trim());

              setOpenEdit(false);
              setEditTitle("");
              setSelectedCollection(null);
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
      {/* 컬렉션 삭제 확인 dialog */}
      <Dialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedCollection(null);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>컬렉션 삭제</DialogTitle>

        <DialogContent>
          <Text component="p">
            <strong>{selectedCollection?.title}</strong> 컬렉션을 삭제하시겠습니까?
          </Text>

          <Text component="caption" variant="subtitle2" sx={{ display: "flex", mt: 1 }}>
            컬렉션을 삭제해도 북마크한 프로젝트는 삭제되지 않습니다.
          </Text>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenDelete(false);
              setSelectedCollection(null);
            }}
          >
            취소
          </Button>

          <Button
            color="error"
            variant="contained"
            disabled={!selectedCollection}
            onClick={() => {
              onDelete(selectedCollection.id);

              setOpenDelete(false);
              setSelectedCollection(null);
            }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
