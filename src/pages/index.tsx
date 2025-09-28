import { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import Hero from '@components/home/Hero';
import PoolServer from '@components/home/PoolServer';
import PoolInformation from '@components/home/PoolInformation';
import MergeMining from '@components/home/MergeMining';
import TrackShares from '@components/home/TrackShares';
import Faq from '@components/home/Faq';

const HomePage = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Hero />
      <PoolServer />
      <PoolInformation />
      <MergeMining />
      <TrackShares />
      <Faq />
    </Box>
  );
};

export default HomePage;
