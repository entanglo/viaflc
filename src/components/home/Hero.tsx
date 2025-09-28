import { Container } from '@mui/material';
import { HeroSection, HeroSubtitle, HeroTitle } from '@components/styled/Hero';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <HeroSection>
      <Container maxWidth="md">
        <HeroTitle variant="h3">{t('home.hero.title')}</HeroTitle>
        <HeroSubtitle sx={{ mt: 1 }}>{t('home.hero.subtitle')}</HeroSubtitle>
      </Container>
    </HeroSection>
  );
};

export default Hero;
