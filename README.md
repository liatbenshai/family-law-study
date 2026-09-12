# דיני משפחה — לימוד עצמי

אפליקציית לימוד אישית בדיני משפחה בישראל. יחידות קצרות, שאלה ואז הסבר, חזרה מרווחת לפי SM-2, ומקרה לכל שיעור.

## הרצה מקומית

```bash
npm install
npm run dev
```

בלי משתני סביבה של Supabase האפליקציה נפתחת במצב מקומי (demo): כניסה אחת, תוכן ראשוני, ושמירת התקדמות בקובץ `data/.demo-state.json`.

## חיבור ל-Supabase

1. צרי פרויקט Supabase.
2. הריצי את `supabase/migrations/001_schema.sql` ואחר כך את `supabase/seed.sql`.
3. העתיקי `.env.example` ל-`.env.local` ומלאי:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
```

`SUPABASE_SERVICE_ROLE_KEY` נשאר בשרת בלבד. אחרי ההרשמה הראשונה סמני מנהלת:

```sql
update public.profiles set is_admin = true where id = '<user-id>';
```

## עקרונות תוכן

- שיעור חדש נשמר כ־draft.
- פרסום ללמידה רק מפאנל הניהול, אחרי סטטוס review ואישור ידני של השיעור ושל המקרה.
- רק תוכן published מוצג במסלול הלמידה.

החומר הלימודי אינו ייעוץ משפטי.
