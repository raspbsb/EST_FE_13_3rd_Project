import { useEffect, useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function CollectionSelectDialog({
  open,
  onClose,
  collections = [],
  onSelect,
  selectedCollectionId = null,
  onSave,
}) {
  const [selectedId, setSelectedId] = useState(selectedCollectionId);

  // Dialog를 다시 열 때 선택 상태 동기화
  useEffect(() => {
    if (open) {
      setSelectedId(selectedCollectionId);
    }
  }, [open, selectedCollectionId]);

  const handleSelect = collectionId => {
    onSelect(collectionId);
    setSelectedId(collectionId);
  };

  // 컬렉션 저장 함수
  const handleSave = () => {
    if (!selectedId) return;

    const selectedCollection = collections.find(collection => collection.collection_id === selectedId);

    onSave?.(selectedCollection);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>컬렉션에 북마크</DialogTitle>

      <DialogContent dividers>
        {collections.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: "center",
            }}
          >
            <Text color="text.primary">생성된 컬렉션이 없습니다.</Text>
            <Link
              href="/mypage/collections"
              underline="hover"
              sx={{
                display: "inline-block",
                mt: 1,
                fontSize: 14,
                fontWeight: 600,
              }}
              onClick={onClose}
            >
              컬렉션 추가하기
            </Link>
          </Box>
        ) : (
          <List disablePadding>
            {collections.map(collection => (
              <ListItem key={collection.collection_id} disablePadding>
                <ListItemButton
                  selected={selectedId === collection.collection_id}
                  onClick={() => handleSelect(collection.collection_id)}
                >
                  <Radio edge="start" checked={selectedId === collection.collection_id} tabIndex={-1} disableRipple />

                  <ListItemText primary={collection.title} secondary={`총 ${collection.total ?? 0}개`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>취소</Button>

        <Button variant="contained" disabled={!selectedId} onClick={handleSave}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
