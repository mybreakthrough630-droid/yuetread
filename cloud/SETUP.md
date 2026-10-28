# 雲端文稿啟用

前端功能已準備；`cloud-config.js` 沒有設定時保持本機模式，不會把文稿傳至任何新服務。

1. 連接 Supabase，選擇或建立供粵讀使用的專案。
2. 在專案套用 `schema.sql`，確認三個 row-level security policies 均已啟用。
3. 在 Supabase Auth 啟用 email，將 Site URL 及 redirect allow-list 設為 `https://mybreakthrough630-droid.github.io/yuetread/`。設定可正式寄信的 SMTP 服務；內建測試郵件服務有收件人及速率限制。
4. 在 `cloud-config.js` 填入專案 URL 及 public publishable key（或 legacy anon key）。不可使用 secret／service_role key。
5. 用兩個測試帳戶確認每人只可讀寫自己的文稿；在兩個瀏覽器登入同一帳戶驗證同步，並測試離線保存及重連。
6. 部署到現有 GitHub Pages，並更新 service worker cache/version。

## 使用流程

- 電郵登入連結由 Supabase 寄送；在各裝置使用同一電郵登入。
- 本機文稿不會自動上傳；使用「將本機文稿備份到雲端」才會建立雲端副本。
- 選擇「雲端文稿」時，新文稿會先保存在此裝置的帳戶專屬快取，再同步上傳。介面會分辨待同步、離線、同步失敗及已同步。
- 雲端與本機文稿分開顯示，避免舊文稿被覆寫。文稿列表可按名稱及內文搜尋。
- 登出只登出目前裝置，不會令其他裝置退出。

SDK: `@supabase/supabase-js` 2.118.0，MIT，授權檔在 `vendor/licenses/supabase-js-LICENSE`。
