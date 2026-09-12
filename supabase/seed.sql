-- Seed data: the topic tree for the family-law-study app.
-- Parent topics have parent_id = null; each child references its parent by slug.
-- Re-runnable: inserts are idempotent on the unique `slug`.

-- =========================================================================
-- Parent topics (parent_id is null)
-- =========================================================================

insert into topics (parent_id, title, slug, sort_order) values
  (null, 'יסודות ומסגרת', 'foundations', 1),
  (null, 'נישואין וגירושין', 'marriage-divorce', 2),
  (null, 'יחסי ממון', 'property-relations', 3),
  (null, 'מזונות', 'support', 4),
  (null, 'משמורת וזמני שהות', 'custody', 5),
  (null, 'אבהות והורות', 'parentage', 6),
  (null, 'אלימות במשפחה', 'domestic-violence', 7),
  (null, 'ירושה ועיזבון', 'inheritance', 8)
on conflict (slug) do nothing;

-- =========================================================================
-- Sub-topics (parent_id resolved from the parent slug)
-- =========================================================================

-- 1. יסודות ומסגרת (foundations)
insert into topics (parent_id, title, slug, sort_order) values
  ((select id from topics where slug = 'foundations'), 'ערכאות', 'courts', 1),
  ((select id from topics where slug = 'foundations'), 'סמכות מקבילה', 'concurrent-jurisdiction', 2),
  ((select id from topics where slug = 'foundations'), 'כרוך ולא כרוך', 'linked-vs-unlinked', 3),
  ((select id from topics where slug = 'foundations'), 'מרוץ הסמכויות', 'jurisdiction-race', 4)
on conflict (slug) do nothing;

-- 2. נישואין וגירושין (marriage-divorce)
insert into topics (parent_id, title, slug, sort_order) values
  ((select id from topics where slug = 'marriage-divorce'), 'עילות גירושין', 'divorce-grounds', 1),
  ((select id from topics where slug = 'marriage-divorce'), 'גט', 'get', 2),
  ((select id from topics where slug = 'marriage-divorce'), 'סרבנות גט', 'get-refusal', 3),
  ((select id from topics where slug = 'marriage-divorce'), 'נישואין וגירושין אזרחיים', 'civil-marriage-divorce', 4),
  ((select id from topics where slug = 'marriage-divorce'), 'ידועים בציבור', 'common-law-partners', 5)
on conflict (slug) do nothing;

-- 3. יחסי ממון (property-relations)
insert into topics (parent_id, title, slug, sort_order) values
  ((select id from topics where slug = 'property-relations'), 'חוק יחסי ממון', 'property-relations-law', 1),
  ((select id from topics where slug = 'property-relations'), 'איזון משאבים', 'resource-balancing', 2),
  ((select id from topics where slug = 'property-relations'), 'הסכמי ממון', 'property-agreements', 3),
  ((select id from topics where slug = 'property-relations'), 'חזקת השיתוף', 'community-property-presumption', 4),
  ((select id from topics where slug = 'property-relations'), 'מועד הקרע', 'separation-date', 5)
on conflict (slug) do nothing;

-- 4. מזונות (support)
insert into topics (parent_id, title, slug, sort_order) values
  ((select id from topics where slug = 'support'), 'מזונות אישה', 'spousal-support', 1),
  ((select id from topics where slug = 'support'), 'מזונות ילדים', 'child-support', 2)
on conflict (slug) do nothing;

-- 5. משמורת וזמני שהות (custody)
insert into topics (parent_id, title, slug, sort_order) values
  ((select id from topics where slug = 'custody'), 'טובת הילד', 'best-interests-of-child', 1),
  ((select id from topics where slug = 'custody'), 'חזקת הגיל הרך', 'tender-years-presumption', 2),
  ((select id from topics where slug = 'custody'), 'משמורת משותפת', 'joint-custody', 3),
  ((select id from topics where slug = 'custody'), 'הסדרי שהות', 'visitation-arrangements', 4),
  ((select id from topics where slug = 'custody'), 'חטיפת ילדים ואמנת האג', 'child-abduction-hague', 5)
on conflict (slug) do nothing;

-- 6. אבהות והורות (parentage)
insert into topics (parent_id, title, slug, sort_order) values
  ((select id from topics where slug = 'parentage'), 'בדיקות רקמות', 'paternity-tests', 1),
  ((select id from topics where slug = 'parentage'), 'הורות משותפת', 'shared-parenthood', 2),
  ((select id from topics where slug = 'parentage'), 'פונדקאות', 'surrogacy', 3),
  ((select id from topics where slug = 'parentage'), 'אימוץ', 'adoption', 4)
on conflict (slug) do nothing;

-- 7. אלימות במשפחה (domestic-violence)
insert into topics (parent_id, title, slug, sort_order) values
  ((select id from topics where slug = 'domestic-violence'), 'צווי הגנה', 'protection-orders', 1),
  ((select id from topics where slug = 'domestic-violence'), 'צווי הרחקה', 'restraining-orders', 2),
  ((select id from topics where slug = 'domestic-violence'), 'החוק למניעת אלימות במשפחה', 'domestic-violence-prevention-law', 3)
on conflict (slug) do nothing;

-- 8. ירושה ועיזבון (inheritance)
insert into topics (parent_id, title, slug, sort_order) values
  ((select id from topics where slug = 'inheritance'), 'דיני ירושה', 'inheritance-law', 1),
  ((select id from topics where slug = 'inheritance'), 'צוואות', 'wills', 2)
on conflict (slug) do nothing;
