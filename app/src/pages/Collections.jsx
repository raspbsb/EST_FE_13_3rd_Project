import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import Link from "@mui/material/Link";

import BookmarkCard from "../components/mypage/BookmarkCard";

import styles from "./Collections.module.css";

export default function Collections() {
  const { userId } = useParams();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // collections DB 불러오기
  useEffect(() => {
    const fetchCollections = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("collections")
        .select(
          `
          collection_id,
          title,
          created_at,
          bookmarks (
            bookmark_id,
            project_id,
            created_at,
            portfolios (
              project_id,
              portfolio_images (
                image_path,
                is_thumbnail
              )
            )
          )
        `,
        )
        .eq("owner_id", userId);

      if (error) {
        console.error("컬렉션 조회 실패:", error);
        setLoading(false);
        return;
      }

      console.log("컬렉션:", data);

      const formattedCollections = data.map(collection => {
        // 가장 최근에 북마크한 순서
        const sortedBookmarks = [...collection.bookmarks].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        const latestBookmark = sortedBookmarks[0];

        // 가장 최근 북마크 한 프로젝트의 썸네일
        const thumbnail =
          latestBookmark?.portfolios?.portfolio_images?.find(image => image.is_thumbnail)?.image_path ?? null;

        return {
          id: collection.collection_id,
          title: collection.title,
          total: collection.bookmarks.length,
          thumbnail,
        };
      });

      setCollections(formattedCollections);
      setLoading(false);
    };

    fetchCollections();
  }, [userId]);

  const handleCollectionClick = collectionId => {
    console.log("컬렉션 클릭:", collectionId);
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
      {loading ? (
        <Text>컬렉션을 불러오는 중...</Text>
      ) : collections.length === 0 ? (
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
              thumbnail={collection.thumbnail}
              handleClick={() => handleCollectionClick(collection.id)}
            />
          ))}
        </div>
      )}
    </Box>
  );
}
