import { supabase } from "../../utils/supabase";
import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Text from "@mui/material/Typography";

export default function ActivityStats({ mode, profile }) {
  const [stats, setStats] = useState({
    projects: 0,
    likes: 0,
    contacts: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const userId = profile?.user_id;

      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // 해당 사용자 프로젝트 조회
        const { data: portfolios, error: portfolioError } = await supabase
          .from("portfolios")
          .select("project_id")
          .eq("author_id", userId);

        if (portfolioError) {
          throw portfolioError;
        }

        const projects = portfolios ?? [];

        // 프로젝트 ID 목록
        const projectIds = projects.map(project => project.project_id);

        // 해당 프로젝트들이 받은 Like 조회
        let likes = 0;

        if (projectIds.length > 0) {
          const { count, error: likeError } = await supabase
            .from("portfolio_likes")
            .select("*", { count: "exact", head: true })
            .in("project_id", projectIds);

          if (likeError) {
            throw likeError;
          }

          likes = count ?? 0;
        }

        // 프로필 조회수
        const views = profile?.profile_view ?? 0;

        // 받은 메세지 수 가져오기
        const { data: messages, error: messageError } = await supabase
          .from("messages")
          .select("id")
          .eq("receiver_id", userId);

        if (messageError) {
          throw messageError;
        }

        const messageCount = messages?.length ?? 0;

        setStats({
          projects: projects.length,
          likes,
          contacts: messageCount,
          views,
        });
      } catch (error) {
        console.error("활동 통계 조회 실패:", error);

        setStats({
          projects: 0,
          likes: 0,
          contacts: 0,
          views: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile?.user_id]);

  const statItems = [
    {
      id: "projects",
      title: "프로젝트",
      count: stats.projects,
    },
    {
      id: "likes",
      title: "받은 관심",
      count: stats.likes,
    },
    {
      id: "contacts",
      title: "받은 연락",
      count: stats.contacts,
    },
    {
      id: "views",
      title: "조회수",
      count: stats.views,
    },
  ];

  return (
    <Box
      sx={{
        pt: "0",
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          justifyContent: "space-around",
          bgcolor: "text.primary",
          borderRadius: 3,
          alignContent: "center",
          py: 3,
          height: {
            mobile: "64px",
            tablet: "118px",
            desktop: "118px",
          },
        }}
      >
        {statItems.map(item => (
          <Grid
            key={item.id}
            sx={{
              color: "background.default",
              justifyItems: "center",
            }}
          >
            <Text
              component="h3"
              variant="h6"
              sx={{
                fontSize: {
                  mobile: "10px",
                  tablet: "20px",
                  desktop: "20px",
                },
              }}
            >
              {item.title}
            </Text>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Text
                component="span"
                variant="h4"
                sx={{
                  fontSize: {
                    mobile: "16px",
                    tablet: "34px",
                    desktop: "34px",
                  },
                }}
              >
                {loading ? "-" : item.count}
              </Text>
              <Text
                component="span"
                variant="h5"
                sx={{
                  fontSize: {
                    mobile: "14px",
                    tablet: "24px",
                    desktop: "24px",
                  },
                }}
              >
                개
              </Text>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
