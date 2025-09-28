import LanguageSwitcher from '@components/common/LanguageSwitcher';
import { Container } from '@mui/material';
import styles from '@styles/scss/Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className={styles.header}>
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 5 }, py: 1 }}>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <Link href="/" passHref>
              <Image
                src="/assets/logo.svg"
                alt="Mobile Logo"
                className={styles.mobileLogo}
                width={100}
                height={64}
              />
            </Link>
            <Link href="/" passHref>
              <Image
                src="/assets/logo.svg"
                alt="Logo"
                className={styles.logo}
                width={128}
                height={64}
              />
            </Link>
          </div>
          <div className={styles.rightContent}>
            <LanguageSwitcher />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
