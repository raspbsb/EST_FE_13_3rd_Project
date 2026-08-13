import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";

import ProjectCard from "../ProjectCard";
import styles from "./MyProjectsSection.module.css";

import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function MyProjectsSection({ mode }) {
  const { userId: profileUserId } = useParams();

  const { profile } = useOutletContext();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  //(현재 Auth 연결이 안되어 mypage모드와 잠시 분리, 로그인 연결되면 null; -> currentUserId; 로 변경 )
  // Public Profile -> URL의 userId
  // MyPage -> 현재 profile의 user_id
  const targetUserId = mode === "public" ? profileUserId : profile?.user_id;

  // supabase portfolios 테이블 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      if (!targetUserId) {
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
            profiles (
              user_name,
              avatar_path
            )
          `,
        )
        .eq("author_id", targetUserId)
        .order("created_at", { ascending: false })
        .limit(3);

      // Public Profile에서는 공개 프로젝트만 조회
      if (mode === "public") {
        query = query.eq("is_public", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("프로젝트 조회 실패", error);
        setProjects([]);
      } else {
        setProjects(data ?? []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [targetUserId, mode]);

  if (loading) {
    return null;
  }

  return (
    <Box
      component="section"
      className={styles.section}
      sx={{
        pt: 9,
      }}
    >
      <Box className={styles.header} sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {mode === "mypage" ? (
          <>
            <Text component="h2" variant="h6">
              내 프로젝트
            </Text>
            <Link component="a" href="/mypage/projects" underline="hover" variant="subtitle2">
              View all
            </Link>
          </>
        ) : (
          <Text component="h2" variant="h6">
            {profile?.user_name}의 프로젝트
          </Text>
        )}
      </Box>
      <div className={styles.grid}>
        {projects.map(project => (
          <ProjectCard key={project.project_id} project={project} />
        ))}
      </div>
    </Box>
  );
}
