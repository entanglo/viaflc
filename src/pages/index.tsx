import { useState } from 'react';
import { Box } from '@mui/material';
import Faq from '@components/home/Faq';
import Hero from '@components/home/Hero';
import MergeMining from '@components/home/MergeMining';
import MinerSettingsGenerator from '@components/home/MinerSettingsGenerator';
import PoolInformation from '@components/home/PoolInformation';
import TrackShares from '@components/home/TrackShares';

const HomePage = () => {
  const [flcAddress, setFlcAddress] = useState('');
  const [nostrSettings, setNostrSettings] = useState<any[] | null>(null);
  const [generated, setGenerated] = useState(false);

  // Callback when settings are fetched by the generator
  const handleSettingsGenerated = (address: string, settings: any[] | null) => {
    setFlcAddress(address);
    setNostrSettings(settings);
    setGenerated(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Hero />
      <MinerSettingsGenerator
        flcAddress={flcAddress}
        onAddressChange={setFlcAddress}
        onSettingsGenerated={handleSettingsGenerated}
      />
      <MergeMining
        flcAddress={flcAddress}
        onAddressChange={setFlcAddress}
        nostrSettings={nostrSettings}
        onPayoutsFetched={handleSettingsGenerated}
        generated={generated}
      />
      <TrackShares flcAddress={flcAddress} onAddressChange={setFlcAddress} />
      <PoolInformation />
      <Faq />
    </Box>
  );
};

export default HomePage;
