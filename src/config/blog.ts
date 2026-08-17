export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  image: string;
  category: string;
  readTime: string;
  body: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'korku-evine-gitmeden-once-bilmeniz-gerekenler',
    title: 'Korku Evine Gitmeden Önce Bilmeniz Gerekenler',
    description:
      'Yaş sınırı, güvenlik kuralları, sağlık uyarıları ve rezervasyon süreci — Garez Korku Evi hakkında kapsamlı bilgi.',
    pubDate: '2026-08-10',
    image: '/images/horror/garez-detail-red-door.webp',
    category: 'Bilgi',
    readTime: '5 dk',
    body: `
      <p>Randevu aldın, ekibin hazır — ama kapıdan girmeden önce bilmen gereken birkaç önemli detay var. Garez Korku Evi’nde güvenli ve keyifli bir deneyim için tüm misafirlerimizin kuralları okumuş sayılması gerekir.</p>
      <h2>Yaş sınırı ve katılım</h2>
      <p>14 yaşından küçük misafirler yalnızca bir yetişkin eşliğinde oyuna katılabilir. Deneyim ani sesler, karanlık ortam ve yoğun gerilim içerir; yaş sınırı hem güvenlik hem de içerik uygunluğu için konulmuştur.</p>
      <h2>Sağlık uyarıları</h2>
      <p>Korku evleri herkes için uygun olmayabilir. Özellikle şu durumlarda katılım önerilmez:</p>
      <ul>
        <li>Hamilelik</li>
        <li>Epilepsi veya ışığa duyarlılık</li>
        <li>Klostrofobi (kapalı alan korkusu)</li>
        <li>Panik atak öyküsü</li>
        <li>Kalp veya solunum rahatsızlığı</li>
      </ul>
      <p>Bu durumlarda karar ve sorumluluk katılımcıya aittir. Emin değilsen oynamadan önce ekibimizle WhatsApp üzerinden iletişime geçebilirsin.</p>
      <h2>İçeride yasak olanlar</h2>
      <ul>
        <li>Telefon, fener veya herhangi bir ışık kaynağı</li>
        <li>Fotoğraf, video ve ses kaydı</li>
        <li>Silah, bıçak veya kesici aletler</li>
        <li>Oyuna başladıktan sonra WC, yeme-içme molası</li>
      </ul>
      <h2>Güvenlik ve izleme</h2>
      <p>Oyun süresince alan kameralarla izlenir ve kayıt altına alınır. Bu hem senin güvenliğin hem de ekibimizin seni takip edebilmesi içindir. İstediğin an oyunu sonlandırabilirsin; ancak aynı seansa geri dönemezsin.</p>
      <h2>Fiziksel temas</h2>
      <p>Garez ekibi misafirlerin güvenliğini önceler ve sana <strong>asla kasıtlı fiziksel temas etmez</strong>. Buna karşılık sen de aktörlere, dekorlara veya korku unsurlarına kasıtlı temas etmemelisin. Tekme, yumruk veya cisim fırlatma gibi davranışlar oyunun sonlandırılmasına yol açabilir.</p>
      <h2>Rezervasyon nasıl yapılır?</h2>
      <ol>
        <li>Web sitemizdeki formdan kişi sayısı, tarih ve saat tercihini seç.</li>
        <li>Oluşan WhatsApp mesajını gönder.</li>
        <li>Ekibimiz uygun seansı onaylar ve detayları paylaşır.</li>
      </ol>
      <p>Form ödeme almaz; kesin onay WhatsApp üzerinden netleşir.</p>
      <h2>Hasar sorumluluğu</h2>
      <p>Korku evinde şiddet veya güç kullanmanı gerektiren hiçbir unsur yoktur. Dekora veya ekipmana verilen hasarlardan katılımcı sorumludur. Sakin kal, etrafına dikkat et — deneyim herkes için daha iyi olur.</p>
      <h2>Özet</h2>
      <p>Kuralları oku, ekibinle gel, rahat kıyafetler giy ve iletişimde kal. Gerisini karanlık halleder.</p>
    `,
  },
  {
    slug: 'korku-evi-takim-oyunu-ipuclari',
    title: 'Korku Evinde Takım Oyunu: 5 Altın Kural',
    description:
      'Garez Korku Evi’nde ekibinle birlikte nasıl daha iyi oynarsın? Takım oyunu ipuçları ve stratejiler.',
    pubDate: '2026-07-28',
    image: '/images/horror/garez-detail-corridor.webp',
    category: 'İpuçları',
    readTime: '3 dk',
    body: `
      <p>Korku evinde bireysel cesaret yetmez; asıl güç takımda yatar. Garez’te birçok görev, kapı ve gizem ekip halinde çözülmek üzere tasarlandı. İşte deneyimini bir üst seviyeye taşıyacak beş altın kural.</p>
      <h2>1. Birbirinizi kaybetmeyin</h2>
      <p>Karanlık koridorlarda dağılmak en sık yapılan hatadır. Mümkün olduğunca bir arada kal, sesli iletişim kur. “Buradayım”, “kapıyı buldum”, “arkana bak” gibi kısa cümleler ekibin bağını güçlendirir.</p>
      <h2>2. Panik yerine plan</h2>
      <p>Ani bir ses veya görüntü ekibi dağıtabilir. Birinin sakin kalıp yön vermesi gerekir. Rol dağılımı yapabilirsiniz: biri önde, biri arkada, biri çevreyi tarar.</p>
      <h2>3. Detaylara dikkat et</h2>
      <p>Duvarlardaki yazılar, eşyaların yerleşimi ve sesler genellikle ipucu taşır. Herkes aynı anda bağırmak yerine, sessizce gözlem yapmayı da deneyin.</p>
      <h2>4. Herkesi dinle</h2>
      <p>Bazen en sessiz kişi en önemli detayı fark eder. Fikirlerini paylaşmaktan çekinen arkadaşını teşvik et. Takım oyunu, herkesin katkı verdiği oyundur.</p>
      <h2>5. Kurallara saygı göster</h2>
      <p>Aktörlere, dekorlara veya birbirinize kasıtlı temas etmekten kaçının. Tekme, yumruk veya cisim fırlatmak hem güvenliği hem de deneyimi bozar. Kurallara uyan ekipler en keyifli seansı yaşar.</p>
      <h2>Ekstra ipucu</h2>
      <p>Deneyimden önce ekibinle kısa bir “oyun planı” konuş. Kim liderlik edecek, korkuya nasıl tepki veriyorsunuz, çıkmak isteyen olursa ne yapacaksınız? Bu 2 dakikalık sohbet, 45 dakikalık oyunu çok daha akıcı kılar.</p>
    `,
  },
  {
    slug: 'ilk-kez-korku-evine-gidenler-icin-rehber',
    title: 'İlk Kez Korku Evine Gidenler İçin Rehber',
    description:
      'Korku evine ilk kez mi gidiyorsun? Garez Korku Evi deneyimine hazırlanırken bilmen gereken temel ipuçları ve beklentiler.',
    pubDate: '2026-07-12',
    image: '/images/horror/garez-hero-v2.webp',
    category: 'Rehber',
    readTime: '4 dk',
    body: `
      <p>Korku evi, sinema salonunda izlediğin bir gerilim filminin içine adım atmak gibidir — ama burada sen yalnızca izleyici değilsin; hikâyenin parçasısın. İlk kez gidecekler için bu deneyim hem heyecan verici hem de biraz endişe uyandırıcı olabilir. Endişelenme; doğru hazırlıkla Garez’te geçireceğin 45 dakika unutulmaz bir anıya dönüşür.</p>
      <h2>Korku evi tam olarak nedir?</h2>
      <p>Korku evi; karanlık koridorlar, ses-ışık efektleri, dekor ve canlı aktör performansının bir araya geldiği takım tabanlı bir deneyimdir. Klasik bir “evden kaçış” odasından farklı olarak odak noktası bulmaca çözmekten çok atmosfer, hikâye ve gerilimdir. Ekibin birlikte ilerler, görevleri tamamlar ve çıkışı arar.</p>
      <h2>İlk kez gidecekler ne beklemeli?</h2>
      <ul>
        <li><strong>Karanlık ortam:</strong> Çoğu bölüm loş veya tamamen karanlıktır. Gözlerin birkaç dakikada alışır.</li>
        <li><strong>Ani sesler ve ışık değişimleri:</strong> Jump scare ve atmosfer efektleri deneyimin doğal parçasıdır.</li>
        <li><strong>Canlı aktörler:</strong> Sahne içinde senaryoya uygun karakterler belirebilir; fiziksel temas yapılmaz.</li>
        <li><strong>Takım oyunu:</strong> Tek başına değil, ekibinle birlikte ilerlersin. İletişim kritiktir.</li>
      </ul>
      <h2>Garez’e gelmeden önce</h2>
      <ol>
        <li><strong>Rahat kıyafet giy.</strong> Koşman, eğilmen gerekebilir; topuklu ayakkabıdan kaçın.</li>
        <li><strong>Telefonu dışarıda bırak.</strong> İçeride telefon, fener veya ışık kaynağı kullanmak yasaktır.</li>
        <li><strong>Ekibini önceden belirle.</strong> 2–8 kişilik gruplar idealdir; tanıdık insanlarla gelmek deneyimi kolaylaştırır.</li>
        <li><strong>Sağlık durumunu değerlendir.</strong> Hamilelik, epilepsi, klostrofobi veya kalp rahatsızlığı varsa katılım riskli olabilir.</li>
      </ol>
      <h2>Korktuğunda ne olur?</h2>
      <p>Garez’te istediğin an oyunu sonlandırabilirsin. Görevliye işaret vermen yeterli. Ancak çıktıktan sonra aynı seansa geri dönemezsin — bu hem güvenlik hem de hikâye bütünlüğü için geçerlidir.</p>
      <h2>Sonuç</h2>
      <p>İlk korku evi deneyimin seni ne kadar etkileyeceğini ancak içeri girince anlarsın. Hazırlıklı ol, ekibine güven ve kurallara uy — gerisini Garez halleder.</p>
    `,
  },
];

export function getBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function formatBlogDate(date: string): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
