import { supabase } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toUrl } from "../../services/toUrl";

import BookmarkCard from "./BookmarkCard";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function BookmarkSection() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!user?.id) {
        setCollections([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("collections")
        .select(
          `
          collection_id,
          title,
          bookmarks (
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
        .eq("owner_id", user.id);

      if (error) {
        console.error("북마크 컬렉션 조회 실패:", error);
        setCollections([]);
        setLoading(false);
        return;
      }

      const formattedCollections = (data ?? []).map(collection => {
        const sortedBookmarks = [...(collection.bookmarks ?? [])].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        const latestBookmark = sortedBookmarks[0];

        const thumbnailPath =
          latestBookmark?.portfolios?.portfolio_images?.find(image => image.is_thumbnail)?.image_path ?? null;

        const thumbnail = thumbnailPath ? toUrl("portfolio_images", thumbnailPath) : null;

        return {
          id: collection.collection_id,
          title: collection.title,
          total: collection.bookmarks?.length ?? 0,
          thumbnail,
        };
      });

      setCollections(formattedCollections);
      setLoading(false);
    };

    fetchCollections();
  }, [user?.id]);

  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text variant="h6">북마크</Text>

        <Link href="/mypage/collections" underline="hover" variant="subtitle2">
          View all
        </Link>
      </Box>
      <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {collections.map(c => (
          <BookmarkCard
            key={c.id}
            title={c.title}
            total={c.total}
            thumbnail={c.thumbnail}
            handleClick={() => navigate(`/mypage/collections/${c.id}`)}
          />
        ))}
      </List>
    </Box>
  );
}
