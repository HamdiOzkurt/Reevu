const translations = {
  tr: {
    // Tabs
    home: "Ana Sayfa",
    favorites: "Favoriler",
    cart: "Sepet",
    profile: "Profil",

    // Home / Search
    searchPlaceholder: "Ürün ara...",
    errorOccurred: "Bir hata oluştu",
    retry: "Tekrar Dene",

    // Categories
    allProducts: "Tüm Ürünler",
    skinCare: "Cilt Bakımı",
    sunProtection: "Güneş Koruma",
    cleansing: "Temizleme",
    mask: "Maske",
    toner: "Tonik",
    makeup: "Makyaj",

    // Product Detail
    reviews: "Yorum",
    addToCart: "Sepete Ekle",
    added: "Eklendi!",
    reviewsTitle: "Yorumlar",
    noReviews: "Henüz yorum yok",
    productLoadError: "Ürün yüklenemedi",

    // Cart
    emptyCart: "Sepetiniz boş",
    clearCart: "Sepeti Temizle",

    // Favorites
    noFavorites: "Henüz favori ürün yok",
    favoritesHint:
      "Beğendiğiniz ürünlerdeki kalp ikonuna dokunarak favorilerinize ekleyebilirsiniz.",
    favoriteCount: "favori ürün",

    // Profile
    user: "Kullanıcı",
    editProfile: "Profili Düzenle",
    firstName: "Ad",
    lastName: "Soyad",
    emailLabel: "E-posta",
    firstNamePlaceholder: "Adınız",
    lastNamePlaceholder: "Soyadınız",
    emailPlaceholder: "E-posta adresiniz",
    save: "Kaydet",
    cancel: "İptal",
    success: "Başarılı",
    profileUpdated: "Profil bilgileriniz güncellendi.",

    // Profile sections
    appearance: "GÖRÜNÜM",
    darkMode: "Karanlık Mod",
    language: "Dil",
    account: "HESAP",
    notifications: "Bildirimler",
    privacy: "Gizlilik",
    other: "DİĞER",
    help: "Yardım",
    about: "Hakkında",
    logout: "Çıkış Yap",

    // Alerts
    privacyMessage:
      "Verileriniz güvenle saklanmaktadır. Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz.",
    helpMessage:
      "Destek için: destek@reevu.com\n\nSık sorulan sorular yakında eklenecek.",
    aboutMessage: "Reevu Store\nVersiyon 1.0.0\n\nTüm hakları saklıdır.",
    logoutConfirm: "Çıkış yapmak istediğinize emin misiniz?",
    logoutTitle: "Çıkış",

    // Lang modal
    selectLanguage: "Dil Seçin",
    changeLanguage: "Uygulama dilini değiştirin",
  },
  en: {
    // Tabs
    home: "Home",
    favorites: "Favorites",
    cart: "Cart",
    profile: "Profile",

    // Home / Search
    searchPlaceholder: "Search products...",
    errorOccurred: "An error occurred",
    retry: "Retry",

    // Categories
    allProducts: "All Products",
    skinCare: "Skin Care",
    sunProtection: "Sun Protection",
    cleansing: "Cleansing",
    mask: "Mask",
    toner: "Toner",
    makeup: "Makeup",

    // Product Detail
    reviews: "Review",
    addToCart: "Add to Cart",
    added: "Added!",
    reviewsTitle: "Reviews",
    noReviews: "No reviews yet",
    productLoadError: "Failed to load product",

    // Cart
    emptyCart: "Your cart is empty",
    clearCart: "Clear Cart",

    // Favorites
    noFavorites: "No favorite products yet",
    favoritesHint:
      "Tap the heart icon on products you like to add them to your favorites.",
    favoriteCount: "favorites",

    // Profile
    user: "User",
    editProfile: "Edit Profile",
    firstName: "First Name",
    lastName: "Last Name",
    emailLabel: "Email",
    firstNamePlaceholder: "Your first name",
    lastNamePlaceholder: "Your last name",
    emailPlaceholder: "Your email address",
    save: "Save",
    cancel: "Cancel",
    success: "Success",
    profileUpdated: "Your profile has been updated.",

    // Profile sections
    appearance: "APPEARANCE",
    darkMode: "Dark Mode",
    language: "Language",
    account: "ACCOUNT",
    notifications: "Notifications",
    privacy: "Privacy",
    other: "OTHER",
    help: "Help",
    about: "About",
    logout: "Log Out",

    // Alerts
    privacyMessage:
      "Your data is stored securely. Personal information is not shared with third parties.",
    helpMessage: "Support: destek@reevu.com\n\nFAQ will be added soon.",
    aboutMessage: "Reevu Store\nVersion 1.0.0\n\nAll rights reserved.",
    logoutConfirm: "Are you sure you want to log out?",
    logoutTitle: "Log Out",

    // Lang modal
    selectLanguage: "Select Language",
    changeLanguage: "Change app language",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["tr"];
export type Translations = { [K in TranslationKey]: string };
export type LangCode = keyof typeof translations;

export function getTranslations(language: string): Translations {
  if (language === "English") return translations.en;
  return translations.tr;
}

// Category label mapping per language
const categoryMap: Record<string, Record<string, string>> = {
  en: {
    "Tüm Ürünler": "All Products",
    "Cilt Bakımı": "Skin Care",
    "Güneş Koruma": "Sun Protection",
    Temizleme: "Cleansing",
    Maske: "Mask",
    Tonik: "Toner",
    Makyaj: "Makeup",
  },
};

export function translateCategory(label: string, language: string): string {
  if (language === "English") {
    return categoryMap.en[label] ?? label;
  }
  return label;
}
