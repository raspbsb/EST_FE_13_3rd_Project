import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { useSelector } from "react-redux";

import ProjectCard from "../components/ProjectCard";
import styles from "./MyProjects.module.css";

import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";

export default function MyProjects({ mode }) {
  // const [currentUserId, setCurrentUserId] = useState(null);
  const { user } = useSelector(state => state.user);
  const currentUserId = user?.id ?? null;
  const [collectionExists, setCollectionExists] = useState(true);

  const { userId: profileUserId, collectionId } = useParams();
  const { profile } = useOutletContext();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const targetUserId = mode === "public" ? profileUserId : profile?.user_id;

  //auth user 가져오기
  // useEffect(() => {
  //   const getCurrentUser = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     setCurrentUserId(user?.id ?? null);
  //   };

  //   getCurrentUser();
  // }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      // 컬렉션 상세 페이지
      if (mode === "collection") {
        if (!collectionId || !currentUserId) {
          setProjects([]);
          setLoading(false);
          return;
        }
        // 컬렉션 조회
        const { data: collection, error: collectionError } = await supabase
          .from("collections")
          .select("collection_id")
          .eq("collection_id", collectionId)
          .eq("owner_id", currentUserId)
          .maybeSingle();

        if (collectionError) {
          console.error("컬렉션 조회 실패:", collectionError);
          setCollectionExists(false);
          setProjects([]);
          setLoading(false);
          return;
        }

        if (!collection) {
          setCollectionExists(false);
          setProjects([]);
          setLoading(false);
          return;
        }

        setCollectionExists(true);

        // 북마크 조회
        const { data, error } = await supabase
          .from("bookmarks")
          .select(
            `
          project_id,
          created_at,
          portfolios (
            *,
            portfolio_images (
              image_id,
              image_path,
              display_order,
              is_thumbnail,
              alt_text
            ),
            portfolio_tech_stacks (
              tech_stack
            ),
            profiles!portfolios_author_id_fkey (
              user_name,
              avatar_path
            )
          )
        `,
          )
          .eq("collection_id", collectionId)
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("북마크 프로젝트 조회 실패:", error);
          setProjects([]);
        } else {
          const bookmarkProjects = data.map(bookmark => bookmark.portfolios).filter(Boolean);

          setProjects(bookmarkProjects);
        }

        setLoading(false);
        return;
      }

      // MyPage / Public Profile 데이터 조회
      if (!targetUserId) {
        setProjects([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from("portfolios")
        .select(
          `
        *,
        portfolio_images (
          image_id,
          image_path,
          display_order,
          is_thumbnail,
          alt_text
        ),
        portfolio_tech_stacks (
          tech_stack
        ),
        profiles!portfolios_author_id_fkey (
          user_name,
          avatar_path
        )
      `,
        )
        .eq("author_id", targetUserId)
        .order("created_at", { ascending: false });

      // Public Profile에서는 공개 프로젝트만 조회
      if (mode === "public" && currentUserId !== profileUserId) {
        query = query.eq("is_public", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("프로젝트 조회 실패:", error);
        setProjects([]);
      } else {
        setProjects(data ?? []);
      }

      setLoading(false);
    };

    fetchProjects();
  }, [targetUserId, collectionId, mode, currentUserId]);

  if (loading) {
    return null;
  }

  // 데이터가 없을 때 메세지
  const emptyMessage = mode === "collection" ? "북마크 한 프로젝트가 없습니다." : "등록된 프로젝트가 없습니다.";

  return (
    <Box component="section" className={styles.section}>
      <Text component="h2" variant="h6" className={styles.title}>
        {mode === "mypage"
          ? "내 프로젝트"
          : mode === "collection"
            ? "북마크 한 프로젝트"
            : `${profile?.user_name}의 프로젝트`}
      </Text>

      {!collectionExists ? (
        <Box className={styles.empty}>
          <Text component="p" variant="body1">
            존재하지 않는 컬렉션입니다.
          </Text>
        </Box>
      ) : projects.length === 0 ? (
        <Box className={styles.empty}>
          <Text component="p" variant="body1">
            {emptyMessage}
          </Text>
        </Box>
      ) : (
        <div className={styles.grid}>
          {projects.map(project => (
            <ProjectCard key={project.project_id} project={project} />
          ))}
        </div>
      )}
    </Box>
  );
}
