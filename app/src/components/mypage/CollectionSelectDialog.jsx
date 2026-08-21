import { supabase } from "../../utils/supabase";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Text from "@mui/material/Typography";
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

const EMPTY_COLLECTIONS = [];

export default function CollectionSelectDialog({
  open,
  onClose,
  collections = EMPTY_COLLECTIONS,
  onSelect,
  selectedCollectionId = null,
  onSave,
}) {
  const [selectedId, setSelectedId] = useState(selectedCollectionId);
  const [collectionsWithCount, setCollectionsWithCount] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog를 다시 열 때 선택 상태 동기화
  useEffect(() => {
    if (open) {
      setSelectedId(selectedCollectionId);
    }
  }, [open, selectedCollectionId]);

  // 컬렉션의 북마크 갯수 조회하기 위한 함수
  useEffect(() => {
    if (!open) {
      return;
    }

    if (collections.length === 0) {
      setCollectionsWithCount(current => (current.length === 0 ? current : []));
      return;
    }

    const fetchBookmarkCounts = async () => {
      setLoading(true);

      const collectionIds = collections.map(collection => collection.collection_id);

      const { data, error } = await supabase
        .from("bookmarks")
        .select("collection_id")
        .in("collection_id", collectionIds);

      if (error) {
        console.error("북마크 개수 조회 실패:", error);
        setCollectionsWithCount(
          collections.map(collection => ({
            ...collection,
            total: 0,
          })),
        );
        setLoading(false);
        return;
      }

      const countMap = data.reduce((acc, bookmark) => {
        acc[bookmark.collection_id] = (acc[bookmark.collection_id] ?? 0) + 1;
        return acc;
      }, {});

      const result = collections.map(collection => ({
        ...collection,
        total: countMap[collection.collection_id] ?? 0,
      }));

      setCollectionsWithCount(result);
      setLoading(false);
    };

    fetchBookmarkCounts();
  }, [open, collections]);

  const handleSelect = collectionId => {
    onSelect(collectionId);
    setSelectedId(collectionId);
  };

  // 컬렉션 저장 함수
  const handleSave = () => {
    if (!selectedId) return;

    const selectedCollection = collectionsWithCount.find(collection => collection.collection_id === selectedId);

    onSave?.(selectedCollection);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>북마크 추가</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box
            sx={{
              py: 4,
              textAlign: "center",
            }}
          >
            <Text color="text.secondary">컬렉션 정보를 불러오는 중...</Text>
          </Box>
        ) : collectionsWithCount.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: "center",
            }}
          >
            <Text color="text.secondary">생성된 컬렉션이 없습니다.</Text>

            <Button component={Link} to="/mypage/collections" color="primary" variant="text" sx={{ mt: 2 }}>
              컬렉션 추가하러 가기
            </Button>
          </Box>
        ) : (
          <List disablePadding>
            {collectionsWithCount.map(collection => (
              <ListItem key={collection.collection_id} disablePadding>
                <ListItemButton
                  selected={selectedId === collection.collection_id}
                  onClick={() => handleSelect(collection.collection_id)}
                >
                  <Radio edge="start" checked={selectedId === collection.collection_id} tabIndex={-1} disableRipple />

                  <ListItemText primary={collection.title} secondary={`총 ${collection.total}개`} />
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
