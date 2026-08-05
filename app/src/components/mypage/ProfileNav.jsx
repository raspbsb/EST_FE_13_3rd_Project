import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import theme from '../../styles/theme';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function ProfileNav() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ bgcolor: '#f3f4f5', display: 'flex', justifyContent: 'center' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor='text.primary'
          indicatorColor='primary'
          aria-label='마이페이지 메뉴'
          sx={{
            '& .MuiTabs-flexContainer': {
              gap: 2,
            },
          }}
        >
          <Tab
            label='Profile'
            sx={{
              textTransform: 'none',
              typography: 'h6',
              py: 0,
            }}
            component={NavLink}
            to='/mypage'
          />
          <Tab
            label='My Projects'
            sx={{
              textTransform: 'none',
              typography: 'h6',
              py: 0,
            }}
            component={NavLink}
            to='/mypage/projects'
          />
          <Tab
            label='Bookmarks'
            sx={{
              textTransform: 'none',
              typography: 'h6',
              py: 0,
            }}
            component={NavLink}
            to='/mypage/collections'
          />
          {/* 컨택 클릭 시 모달 띄우기 */}
          <Tab
            label='Interest & Contect'
            sx={{
              textTransform: 'none',
              typography: 'h6',
              py: 0,
            }}
          />
        </Tabs>
      </Box>
    </>
  );
}
