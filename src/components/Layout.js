import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2984910822285596"
        data-ad-slot="6191136340"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
      <Footer />
      <amp-ad width="100vw" height="320"
        type="adsense"
        data-ad-client="ca-pub-2984910822285596"
        data-ad-slot="6191136340"
        data-auto-format="rspv"
        data-full-width="">
        <div overflow=""></div>
      </amp-ad>
    </>
  );
}
