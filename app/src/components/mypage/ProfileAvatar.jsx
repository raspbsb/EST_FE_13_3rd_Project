import { supabase } from "../../utils/supabase";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

import { AccountCircleIcon, AddAPhotoIcon, CloseIcon } from "../../lib/icons";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ProfileAvatar({ avatarPath, editable = false, onChange }) {
  //avatarPath -> public URL로 변환
  const getAvatarUrl = avatarPath => {
    if (!avatarPath) return null;

    const { data } = supabase.storage.from("profile_avatars").getPublicUrl(avatarPath);

    return data.publicUrl;
  };

  const [image, setImage] = useState(getAvatarUrl(avatarPath));
  const [isHover, setIsHover] = useState(false);

  // 파일 선택 함수
  const handleChange = e => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    onChange?.(file);
  };

  //avatarPath 변경 됐을 때 이미지 리렌더링
  useEffect(() => {
    setImage(getAvatarUrl(avatarPath));
  }, [avatarPath]);

  // 프사 삭제
  const handleDelete = () => {
    setImage(null);

    onChange?.(null);
  };

  return (
    <Box
      sx={{
        width: {
          mobile: 120,
          tablet: 191,
          desktop: 191,
        },
        height: {
          mobile: 120,
          tablet: 192,
          desktop: 192,
        },
        position: "relative",
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* 프로필 이미지 */}
      {image ? (
        <Box
          component="img"
          src={image}
          alt="프로필 이미지"
          sx={{
            width: {
              mobile: 120,
              tablet: 191,
              desktop: 191,
            },
            height: {
              mobile: 120,
              tablet: 192,
              desktop: 192,
            },
            borderRadius: "50%",
            border: "1px solid #e0e0e0",
            objectFit: "cover",
          }}
        />
      ) : (
        <AccountCircleIcon
          sx={{
            width: {
              mobile: 120,
              tablet: 191,
              desktop: 191,
            },
            height: {
              mobile: 120,
              tablet: 192,
              desktop: 192,
            },
            borderRadius: "50%",
            border: "1px solid #e0e0e0",
          }}
        />
      )}

      {/* 이미지가 있고, hover 했을 때 삭제 버튼 */}
      {editable && image && isHover && (
        <Button
          onClick={handleDelete}
          startIcon={<CloseIcon />}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "auto",
            px: 1,
            py: 0.5,
            bgcolor: "secondary.main",
            color: "text.primary",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: 1,
            "&:hover": {
              bgcolor: "#ccc",
            },
          }}
        >
          Delete Image
        </Button>
      )}

      {/* 이미지 첨부 버튼 */}
      {editable && (
        <IconButton
          component="label"
          aria-label="add Profile image"
          sx={{
            width: 45,
            height: 45,
            background: "#fff",
            border: "1px solid #aaa",
            position: "absolute",
            right: 0,
            bottom: 0,
          }}
        >
          <VisuallyHiddenInput type="file" accept="image/*" onChange={handleChange} />

          <AddAPhotoIcon />
        </IconButton>
      )}
    </Box>
  );
}
