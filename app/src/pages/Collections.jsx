import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import Link from "@mui/material/Link";

import BookmarkCard from "../components/mypage/BookmarkCard";

import styles from "./Collections.module.css";

// 임시 데이터
const collections = [
  {
    id: 1,
    title: "Collection title",
    total: 12,
    thumbnail: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
  },
  {
    id: 2,
    title: "Collection title",
    total: 8,
    thumbnail: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
  },
  {
    id: 3,
    title: "Collection title",
    total: 15,
    thumbnail: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
  },
  {
    id: 4,
    title: "Collection title",
    total: 6,
    thumbnail: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
  },
  {
    id: 5,
    title: "Collection title",
    total: 10,
    thumbnail: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
  },
  {
    id: 6,
    title: "Collection title",
    total: 4,
    thumbnail: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
  },
];

export default function Collections() {
  const handleCollectionClick = id => {
    console.log("컬렉션 클릭:", id);
  };

  return (
    <Box component="section" className={styles.section}>
      <Box className={styles.header}>
        <Text component="h2" variant="h6">
          북마크 컬렉션
        </Text>

        <Link component="button" underline="hover" variant="subtitle2">
          + 컬렉션 관리
        </Link>
      </Box>

      {/* 컬렉션 목록 */}
      {collections.length === 0 ? (
        <Box className={styles.empty}>
          <Text variant="body1">북마크 컬렉션을 생성해주세요.</Text>
        </Box>
      ) : (
        <div className={styles.grid}>
          {collections.map(collection => (
            <BookmarkCard
              key={collection.id}
              title={collection.title}
              total={collection.total}
              handleClick={() => handleCollectionClick(collection.id)}
            />
          ))}
        </div>
      )}
    </Box>
  );
}
