// Public connection values only. Never put a secret/service_role key here.
// Enable after provisioning the database in cloud/schema.sql and configuring
// the Supabase Auth site URL. Empty values keep all existing local features.
globalThis.YuetReadCloudConfig = Object.freeze({
  url: '',
  publishableKey: ''
});
