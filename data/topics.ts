import type { Topic } from "../lib/types.ts";

export function topicId(n: number) {
  return `11111111-1111-1111-1111-11111111${String(n).padStart(4, "0")}`;
}

export const FOUNDATIONS_ID = topicId(1);
export const PROPERTY_ID = topicId(2);
export const CHILD_SUPPORT_ID = topicId(3);
export const PARENTAL_RESPONSIBILITY_ID = topicId(4);
export const SUPPORT_ID = topicId(5);
export const CUSTODY_ID = topicId(6);
export const MARRIAGE_DIVORCE_ID = topicId(7);
export const PARENTAGE_ID = topicId(8);
export const DOMESTIC_VIOLENCE_ID = topicId(9);
export const INHERITANCE_ID = topicId(10);

export const JURISDICTION_RACE_ID = topicId(14);
export const GET_REFUSAL_ID = topicId(17);
export const COMMON_LAW_ID = topicId(19);
export const PROPERTY_AGREEMENTS_ID = topicId(22);
export const SPOUSAL_SUPPORT_ID = topicId(25);
export const PROTECTION_ORDERS_ID = topicId(34);
export const INHERITANCE_LAW_ID = topicId(37);

function topic(
  n: number,
  slug: string,
  title: string,
  description: string,
  sortOrder: number,
  parentId: string | null = null,
): Topic {
  return { id: topicId(n), slug, title, description, sortOrder, parentId };
}

export const topics: Topic[] = [
  topic(
    1,
    "foundations",
    "יסודות ומסגרת",
    "ערכאות, סמכות מקבילה, כריכה ומרוץ הסמכויות.",
    1,
  ),
  topic(
    7,
    "marriage-divorce",
    "נישואין וגירושין",
    "עילה, גט, סרבנות, נישואין אזרחיים וידועים בציבור.",
    2,
  ),
  topic(
    2,
    "property-relations",
    "יחסי ממון",
    "איזון משאבים, נכסים חיצוניים, הסכמי ממון וחזקת השיתוף.",
    3,
  ),
  topic(5, "support", "מזונות", "מזונות ילדים ומזונות אישה, וגבולות כל אחד מהם.", 4),
  topic(
    6,
    "custody",
    "משמורת וזמני שהות",
    "טובת הילד, חזקת הגיל הרך, משמורת משותפת ואמנת האג.",
    5,
  ),
  topic(8, "parentage", "אבהות והורות", "בדיקות רקמות, הורות משותפת, פונדקאות ואימוץ.", 6),
  topic(
    9,
    "domestic-violence",
    "אלימות במשפחה",
    "צווי הגנה, צווי הרחקה והחוק למניעת אלימות במשפחה.",
    7,
  ),
  topic(10, "inheritance", "ירושה ועיזבון", "ירושה על פי דין, צוואות וזכויות בן הזוג.", 8),

  topic(11, "courts", "ערכאות", "בית המשפט לענייני משפחה ובתי הדין הדתיים.", 1, FOUNDATIONS_ID),
  topic(
    12,
    "concurrent-jurisdiction",
    "סמכות מקבילה",
    "מתי שתי ערכאות יכולות לדון, ומה קורה אחרי הגשה ראשונה.",
    2,
    FOUNDATIONS_ID,
  ),
  topic(
    13,
    "linked-vs-unlinked",
    "כרוך ולא כרוך",
    "מתי עניין נכרך כדין לתביעת גירושין.",
    3,
    FOUNDATIONS_ID,
  ),
  topic(
    14,
    "jurisdiction-race",
    "מרוץ הסמכויות",
    "למה מגישים ראשונים, ומה המחיר של המרוץ.",
    4,
    FOUNDATIONS_ID,
  ),

  topic(15, "divorce-grounds", "עילות גירושין", "עילות בבית הדין הרבני ובמסלולים אזרחיים.", 1, MARRIAGE_DIVORCE_ID),
  topic(16, "get", "גט", "מהו גט, רצון חופשי, וסמכות בית הדין.", 2, MARRIAGE_DIVORCE_ID),
  topic(17, "get-refusal", "סרבנות גט", "סנקציות, נזיקין, וגבולות הכפייה על מתן גט.", 3, MARRIAGE_DIVORCE_ID),
  topic(
    18,
    "civil-marriage-divorce",
    "נישואין וגירושין אזרחיים",
    "נישואי חוץ לארץ, בני זוג בני דתות שונות, ופירוד אזרחי.",
    4,
    MARRIAGE_DIVORCE_ID,
  ),
  topic(
    19,
    "common-law-partners",
    "ידועים בציבור",
    "מעמד, סמכות ערכאה, ושיתוף בנכסים בלי נישואין.",
    5,
    MARRIAGE_DIVORCE_ID,
  ),

  topic(20, "property-relations-law", "חוק יחסי ממון", "הסדר איזון המשאבים כברירת מחדל.", 1, PROPERTY_ID),
  topic(21, "resource-balancing", "איזון משאבים", "מה נכנס לאיזון ומה נשאר בחוץ.", 2, PROPERTY_ID),
  topic(22, "property-agreements", "הסכמי ממון", "אישור לפני ואחרי הנישואין, ומה קורה בלי אישור.", 3, PROPERTY_ID),
  topic(
    23,
    "community-property-presumption",
    "חזקת השיתוף",
    "מתי חלה חזקת השיתוף במקום או לצד חוק יחסי ממון.",
    4,
    PROPERTY_ID,
  ),
  topic(24, "separation-date", "מועד הקרע", "למה חשוב מועד הקרע בחישוב האיזון.", 5, PROPERTY_ID),

  topic(25, "spousal-support", "מזונות אישה", "חובה במהלך הנישואין, ומה קורה אחרי הגט.", 1, SUPPORT_ID),
  {
    id: CHILD_SUPPORT_ID,
    slug: "child-support",
    title: "מזונות ילדים",
    description: "חובת המזונות, גילאים, והשפעת בע״מ 919/15.",
    sortOrder: 2,
    parentId: SUPPORT_ID,
  },

  {
    id: PARENTAL_RESPONSIBILITY_ID,
    slug: "parental-responsibility",
    title: "טובת הילד",
    description: "אפוטרופסות, החזקה וזמני שהות לפי טובת הילד.",
    sortOrder: 1,
    parentId: CUSTODY_ID,
  },
  topic(26, "tender-years-presumption", "חזקת הגיל הרך", "מעמד החזקה היום, ומה נשאר ממנה.", 2, CUSTODY_ID),
  topic(27, "joint-custody", "משמורת משותפת", "זמני שהות משמעותיים אצל שני ההורים.", 3, CUSTODY_ID),
  topic(28, "visitation-arrangements", "הסדרי שהות", "קביעת זמנים, חגים ומעברים.", 4, CUSTODY_ID),
  topic(29, "child-abduction-hague", "חטיפת ילדים ואמנת האג", "החזרה למקום המגורים הרגיל.", 5, CUSTODY_ID),

  topic(30, "paternity-tests", "בדיקות רקמות", "מתי בודקים אבהות, ומה האינטרס של הקטין.", 1, PARENTAGE_ID),
  topic(31, "shared-parenthood", "הורות משותפת", "הורות מכוונת ומעמדו של בן הזוג שאינו הורה ביולוגי.", 2, PARENTAGE_ID),
  topic(32, "surrogacy", "פונדקאות", "המסגרת בחוק הסכמים לנשיאת עוברים.", 3, PARENTAGE_ID),
  topic(33, "adoption", "אימוץ", "עקרונות מחוק אימוץ ילדים.", 4, PARENTAGE_ID),

  topic(34, "protection-orders", "צווי הגנה", "צו הגנה לפי החוק למניעת אלימות במשפחה.", 1, DOMESTIC_VIOLENCE_ID),
  topic(35, "restraining-orders", "צווי הרחקה", "הרחקה במסגרת צו הגנה וצווים נלווים.", 2, DOMESTIC_VIOLENCE_ID),
  topic(
    36,
    "domestic-violence-prevention-law",
    "החוק למניעת אלימות במשפחה",
    "מטרת החוק, סמכות ומשך הצו.",
    3,
    DOMESTIC_VIOLENCE_ID,
  ),

  topic(37, "inheritance-law", "דיני ירושה", "ירושה על פי דין לפי חוק הירושה.", 1, INHERITANCE_ID),
  topic(38, "wills", "צוואות", "צורות צוואה ופגמים נפוצים.", 2, INHERITANCE_ID),
];
