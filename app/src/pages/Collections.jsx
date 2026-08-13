import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import Link from "@mui/material/Link";

import BookmarkCard from "../components/mypage/BookmarkCard";
import CollectionManageDialog from "../components/mypage/CollectionManageDialog";

import styles from "./Collections.module.css";

export default function Collections() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  //컬렉션 관리 dialog
  const [openManage, setOpenManage] = useState(false);

  //임시
  const targetUserId = userId || "ac77e6ec-340c-425e-8fcb-9a1ca0e4e1fe";

  // collections DB 불러오기
  const fetchCollections = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

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
      .eq("owner_id", targetUserId);

    if (error) {
      console.error("컬렉션 조회 실패:", error);
      setLoading(false);
      return;
    }

    console.log("컬렉션:", data);

    const formattedCollections = data.map(collection => {
      // 가장 최근에 북마크한 순서
      const sortedBookmarks = [...collection.bookmarks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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

  // 컴포넌트가 처음 렌더링될 때 컬렉션 조회
  useEffect(() => {
    fetchCollections();
  }, [userId]);

  // 컬렉션 상세페이지로 이동
  const handleCollectionClick = collectionId => {
    navigate(`/mypage/collections/${collectionId}`);
  };

  // 컬렉션 생성
  const handleCreateCollection = async title => {
    const { error } = await supabase.from("collections").insert({
      owner_id: "ac77e6ec-340c-425e-8fcb-9a1ca0e4e1fe", // auth 연결되면 user.id 로 변경
      title,
    });

    if (error) {
      console.error("컬렉션 생성 실패:", error);
      return;
    }

    console.log("컬렉션 생성 성공");

    // 목록 다시 조회
    await fetchCollections();
  };

  return (
    <Box component="section" className={styles.section}>
      <Box className={styles.header}>
        <Text component="h2" variant="h6">
          북마크 컬렉션
        </Text>

        <Link component="button" underline="hover" variant="subtitle2" onClick={() => setOpenManage(true)}>
          +컬렉션 관리
        </Link>
        <CollectionManageDialog
          open={openManage}
          onClose={() => setOpenManage(false)}
          collections={collections}
          onCreate={handleCreateCollection}
        />
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
