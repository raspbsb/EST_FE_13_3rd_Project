import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { supabase } from "../utils/supabase";

import ProjectCard from "../components/ProjectCard";
import styles from "./MyProjects.module.css";

import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";

export default function MyProjects({ mode }) {
  const { userId: profileUserId } = useParams();
  const { profile } = useOutletContext();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const targetUserId = mode === "public" ? profileUserId : profile?.user_id;

  useEffect(() => {
    const fetchProjects = async () => {
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
        .order("created_at", { ascending: false });

      // Public Profile에서는 공개 프로젝트만 조회
      if (mode === "public") {
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
  }, [targetUserId, mode]);

  if (loading) {
    return null;
  }

  return (
    <Box component="section" className={styles.section}>
      <Text component="h2" variant="h6" className={styles.title}>
        {mode === "mypage" ? "내 프로젝트" : `${profile?.user_name}의 프로젝트`}
      </Text>

      {projects.length === 0 ? (
        <Box className={styles.empty}>
          <Text variant="body1">등록된 프로젝트가 없습니다.</Text>
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
